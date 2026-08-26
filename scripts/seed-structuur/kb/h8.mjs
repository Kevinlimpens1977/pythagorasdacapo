// Hoofdstuk 8 - Zelf maken: programmeren, ontwerpen en terugblikken.
// Kaderberoepsgerichte leerweg (kb).
//
// BRON (leidend)
// --------------
// Het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College
// (auteurs Jennifer Leijen, Sander Theunissen, Gerdien Dohmen en Mirko
// Ensinck, CC BY 4.0).
//   8.4  <- les 18 "Introductie Canva"
//   8.5  <- les 19 "Eindopdracht Canva en AI"
//   8.6  <- les 20 "Afsluiting en terugblik Digitale Vaardigheden" (checkpoint,
//           tevens de eindtoets van het leerjaar: final = true)
// Er is niets uit die drie lessen weggelaten. Elke alinea, elke stap, elke
// voorwaarde, elk onderwerp uit de keuzelijst, elke link en elke verwijzing
// naar beeld komt terug. Waar de bron een handelingslijstje geeft (de zeven
// aanmeldstappen, de negen posterstappen, de negen onderwerpen, de zes
// voorwaarden, de vijf postertips, de eisen bij optie A, B en C) staat dat
// lijstje in de PRAKTIJKOPDRACHT: daar voert de leerling het uit en daar kan
// hij het afvinken. De aanmoedigingsregel van de bron tussen opdracht 1 en
// opdracht 2 van les 18 staat er ook in.
//
// AANVULLENDE ARRANGEMENTINFORMATIE UIT LES 20 (docentmetadata)
// ------------------------------------------------------------
// Onder het colofon van les 20 staat in de bron nog:
//   Leerniveaus:          VMBO kaderberoepsgerichte leerweg, 1;
//                         VMBO gemengde leerweg, 1
//   Leerinhoud en doelen: Techniek
//   Eindgebruiker:        leerling/student
// Dat is docentmetadata en geen leerlingtekst. Het staat daarom hier en niet in
// een theorieblok. Het bevestigt wel dat deze lessenserie op kaderniveau
// bedoeld is, dus dat de kb-versie de maat is en niet de uitzondering.
//
// TOEGEVOEGDE PARAGRAFEN (docentmetadata, staat niet in de leerlingtekst)
// ----------------------------------------------------------------------
// 8.1, 8.2 en 8.3 vullen kerndoel 22B (computationeel denken), dat in de
// lessenserie zelf ontbreekt. Ze zijn in eigen woorden geschreven op basis van:
//   - de SLO-pagina "Computational thinking - leermaterialen" voor het vmbo
//     (slo.nl, digitale geletterdheid vo);
//   - de SLO-handreiking bij subdomein B1 Algoritmen, waar opeenvolging, keuze
//     en herhaling de drie basisbouwstenen van een algoritme heten;
//   - de aflevering "Wat is een algoritme? | Huh?!" van Het Klokhuis;
//   - de Nederlandstalige Scratch-uitleg "Als...dan | Blokkenseries Scratch";
//   - het Wikiwijs-arrangement "Scratch programmeren voor kinderen"
//     (maken.wikiwijs.nl/189084) en de open videoreeks Scratch programmeren
//     voor kinderen van TU Delft OpenCourseWare;
//   - het lemma "Bug (technologie)" op nl.wikipedia.org voor de herkomst van
//     het woord bug.
// Die bronnamen horen bij de docent en bij sourceBasis, niet in de zin die een
// brugklasser leest.
//
// WAT KB ANDERS MAAKT DAN TL - EN WAT WEL GELIJK IS
// -------------------------------------------------
// Zelfde onderwerpen, zelfde volgorde, zelfde leerdoelen als tl/h8.mjs. De
// leerlingtekst is voor kader opnieuw geschreven. Om te voorkomen dat iemand
// deze claim later voor waar aanneemt zonder te kijken, staat er precies bij
// wat wel en niet gelijk is aan tl.
//
// GELIJK AAN TL, EN DAT HOORT ZO:
//   - de zeventien leerdoelzinnen. Die staan letterlijk in het jaarplan en
//     mogen tussen de leerwegen niet uit elkaar lopen; zie de const DOEL;
//   - de vier leerdoelen van hoofdstuk 7 in de const VORIG, om dezelfde reden;
//   - de handelingslijstjes die uit de bron komen: de zeven aanmeldstappen,
//     de negen posterstappen, de negen onderwerpen, de zes voorwaarden, de
//     vijf postertips en de eisen bij optie A, B en C. Dat is de bron, en een
//     stap uit een stappenplan herschrijven levert alleen maar afwijking op;
//   - eigennamen, knopnamen, bloknamen, URL's en het colofon.
// Na ronde 2 zijn dat samen nog 34 zinnen van acht woorden of meer die
// woordelijk in tl/h8 terugkomen: 21 leerdoelzinnen, 11 bronstappen uit les 18
// en 19, de paragraaftitel van 8.3 en twee video-titels. Buiten die vier
// categorieën staat er geen enkele zin meer dubbel. Ronde 1 had er 168, waarvan
// ruim 125 buiten de bronstappen om.
//
// OPNIEUW GESCHREVEN VOOR KADER (ronde 2 - hier ging ronde 1 de fout in):
//   - alle twaalf theorieblokken. Geen enkel leesblok loopt nog langer door dan
//     zes zinnen; daarna komt een lijst, een genummerd stappenplan of een
//     "Doe dit even"-regel waarin de leerling zelf iets doet. Ronde 1 had hier
//     alinea's van 12 tot 17 zinnen staan, en dat is de vorm van tl;
//   - de deeltoets in de checks van 8.4 en de diagnostische ronde in de checks
//     van 8.6. Die waren in ronde 1 grotendeels woordelijk uit tl overgenomen;
//   - de startvragen, de oefenblokken, de modelantwoorden en de nakijkpunten;
//   - zinnen van ongeveer 12 tot 15 woorden, één idee per zin. Zinnen die uit
//     tl waren meegekomen en daar 17 tot 26 woorden telden, zijn gesplitst;
//   - elk begrip krijgt EERST een concreet voorbeeld en wordt daarna pas
//     gebruikt: eerst het recept, dan het woord stappenplan; eerst de jas bij
//     regen, dan het woord voorwaarde; eerst de kat die de rand raakt, dan het
//     woord als-dan-blok; eerst de jas- en petzin, dan het woord computationeel
//     denken;
//   - meer hoe dan waarom. Waar tl uitlegt waarom de vijf posterkenmerken
//     werken, staat hier wat je doet om je poster leesbaar te krijgen.
//
// EEN VALKUIL DIE IN RONDE 1 BLEEF LIGGEN. In 8.2 staat dat de vorm van een
// blok onmogelijke combinaties uitsluit. Een kaderleerling leest daar makkelijk
// "dan kan er dus niets fout gaan", terwijl 8.3 een hele paragraaf over bugs
// is. Daarom staat er nu meteen achteraan dat de volgorde nog steeds fout kan
// zijn, met een eigen goed/fout-vraag en een plusvraag erover.
//
// GEMETEN, ZODAT DE VOLGENDE LEZER HET KAN NAREKENEN
// --------------------------------------------------
// Langste ononderbroken leesblok per theorieblok, in zinnen. Norm voor kader:
// hoogstens 6 of 7. Tussen haakjes wat tl op datzelfde blok heeft.
//   8.1 A 6 (15)   8.1 B 5 (9)    8.2 A 6 (11)   8.2 B 5 (15)
//   8.3 A 5 (11)   8.3 B 5 (9)    8.4 A 4 (8)    8.4 B 5 (12)
//   8.5 A 5 (8)    8.5 B 5 (8)    8.6 A 6 (4)    8.6 B 5 (13)
// Elk theorieblok heeft één of twee "Doe dit even"-regels: een taakje van
// hooguit twee minuten, midden in de tekst. Dat is de plek waar de leerweg om
// vraagt ("wissel voordoen en zelf proberen af") en die de generator zelf niet
// kan bieden, want die zet de blokvolgorde vast op check, theorie A, theorie B,
// oefenen, media, opdracht, samenvatting, quiz. Geteld na ronde 2: alle twaalf
// theorieblokken hebben er minstens één; 8.6 A had er in ronde 1 geen.
//
// Zinslengte over de 234 theoriezinnen na ronde 2: gemiddeld 12,0 woorden,
// mediaan 12, p90 15, achttien zinnen boven de 15 en 29 onder de 10. Dat zit
// midden in de kaderband van 12 tot 15. Ronde 1 stond op gemiddeld 11,3 met
// 54 zinnen onder de 10; die hakkelige korte zinnen zijn in ronde 2 paarsgewijs
// samengetrokken. Ter vergelijking: tl h8 zit op gemiddeld 17,0 woorden, dus
// de twee leerwegen liggen ruim uit elkaar.
//
// Langste alinea van het hele hoofdstuk, opdrachten meegerekend: 91 woorden en
// 7 zinnen (8.2 theorieblok B). tl h8 komt daar op 249 woorden en 15 zinnen.
// Alle stappenlijsten staan sinds ronde 2 in echte <ol><li>-lijsten, ook in de
// praktijkopdrachten van 8.1 tot en met 8.6. In ronde 1 stonden de zestien
// stappen van 8.4 en de acht van 8.5 als doorlopend proza in één alinea.
//
// Leesbelasting per verplichte paragraaf, theorie plus uitgewerkt voorbeeld:
//   8.1 568   8.2 693   8.3 567   8.4 667   8.5 619   8.6 642
//   kb gemiddeld 626 woorden, tl 578 over zijn zes verplichte paragrafen.
// Dat verschil van 48 woorden is de prijs van de kaderband: zinnen van 12 tot
// 15 woorden zijn nu eenmaal langer dan zinnen van 11. De leerling leest dus
// iets meer woorden, maar in kortere brokken (langste alinea 91 tegen 249) en
// met een "Doe dit even" in elk blok. Waar de winst wél te halen viel is hij
// gepakt: de twaalf uitgewerkte voorbeelden gingen van gemiddeld 82 naar 78
// woorden, met 84 als langste; tl zit op 74 met 110 als langste.
//
// DE HOOFDSTUKLAAG VAN DE BLAUWDRUK
// ---------------------------------
// A. VOORKENNISCHECK OVER HOOFDSTUK 7 (blauwdruk: "Startcheck over het vorige
//    hoofdstuk, 4-6 vragen"). Vier terugblikvragen staan bovenaan de `checks`
//    van 8.1. Ze gaan over leren van data (7.1), de vier onderdelen van een
//    prompt (7.3), het controleren van een chatbotantwoord (7.4) en het niet
//    delen van persoonlijke gegevens (7.2). Die vier leerdoelen staan letterlijk
//    in de const VORIG hieronder, overgetypt uit het jaarplan. Het checkblok van
//    8.1 telt daardoor zeven vragen: vier voorkennis en drie eigen startvragen.
//    De afsluitquiz van 8.1 heeft daarnaast twee terugkeervragen naar hoofdstuk
//    7, zodat de terugblik niet alleen in de startcheck leeft.
// B. DEELTOETS OVER 8.1, 8.2 EN 8.3 (blauwdruk: "8-10 vragen over paragraaf 1
//    tot en met 3. Geen cijfer; uitkomst bepaalt wie steun en wie plus krijgt").
//    Die staat in de `checks` van 8.4, dus in het blok "Startcheck: wat weet je
//    al?" van de eerste paragraaf ná het programmeerdeel. Dat blok heeft de drie
//    eigenschappen die de blauwdruk eist: geen cijfer en geen tokens, Digidocent
//    uit, en de uitleg pas na het eigen antwoord in een dichtgeklapte details.
//    Voor kb zijn de negen deeltoetsvragen bewust kort gehouden: één zin vraag,
//    één zin antwoord. Vier van de negen zijn goed/fout-vragen, zodat het blok
//    geen schrijfmarathon wordt. De routevraag bovenaan zegt wat de uitslag
//    betekent, en de twee sporen staan verderop als EERSTE opgave van "Extra
//    steun" en van "Extra plus", met de instapdrempel in de vraagtekst.
// C. DIAGNOSTISCHE RONDE (blauwdruk: "Alle leerdoelen, 1 vraag elk. Per gemist
//    doel opent gericht herhaalmateriaal"). Die staat in de `checks` van
//    checkpoint 8.6 en is dus de startcheck van dat checkpoint: zeventien
//    diagnosevragen, één per verplicht leerdoel van 8.1 tot en met 8.6, elk met
//    het herhaalmateriaal in de uitleg. Vijf ervan zijn goed/fout, om dezelfde
//    reden als bij de deeltoets. De routering is sluitend gemaakt: tien of
//    minder is het herstelspoor, elf tot en met veertien is het herstelspoor op
//    alleen de gemiste doelen, vijftien of meer is het verdiepingsspoor. In
//    ronde 1 kreeg de grootste groep (elf tot en met zestien goed) geen spoor.
//    Daarna volgt de herhaling (de twee theorieblokken van 8.6), dan de twee
//    sporen, dan de eindtoets.
//
// PLAN 8.6 OVER DRIE LESUREN. In deze ene paragraafcode vallen vier dingen
// samen: de hele hoofdstukafsluiting van de blauwdruk, les 20 van de bron, de
// eindtoets van het hele leerjaar en het colofon. Uur 1 is de diagnostische
// ronde, de twee theorieblokken en het spoor dat daaruit volgt. Uur 2 is de
// eindcreatie en het inleveren, precies de 25 plus 5 minuten van de bron. Uur 3
// is de eindtoets en de game. Die planningsafspraak staat ook in de
// leerlingtekst van theorieblok A, zodat hij niet alleen in dit commentaar leeft.
//
// DE A3/A4-TEGENSPRAAK UIT LES 18 (OPGELOST, NIET GEKOPIEERD)
// ----------------------------------------------------------
// De bron noemt het product vier keer een A4-poster en zegt bij stap 2 dat je
// "poster staand, A3" aanklikt. Die tegenspraak is rechtgezet in plaats van
// overgenomen: theorieblok B van 8.4 en stap 2 van de praktijkopdracht zeggen
// allebei dat Canva dit formaat A3 noemt, dat A3 twee keer zo groot is als A4
// en dat de verhouding gelijk blijft. De naam A4-poster blijft staan, want de
// bron en het jaarplan gebruiken die.
//
// DE SCRATCH-BLOKNAMEN, GEVERIFIEERD OP DE DUTCH SCRATCH-WIKI
// -----------------------------------------------------------
// Exacte bloknamen zijn hier lesstof, want 8.2 gaat letterlijk over blokken
// zoeken en vastklikken. Alle namen hieronder zijn nagelopen op
// nl.scratch-wiki.info (Waarnemen, Herhaal, Beweging), niet uit het hoofd
// opgeschreven:
//   "wanneer op de groene vlag wordt geklikt"  Gebeurtenissen, geel
//   "herhaal"                                  Besturen, oranje, oneindige lus
//   "als ... dan"                              Besturen, oranje
//   "raak ik ( rand )?"                        Waarnemen, lichtblauw, zeshoek
//   "neem 10 stappen" en "keer om aan de rand" Beweging, blauw
// Ronde 1 schreef hier twee namen die in het Nederlandse Scratch niet bestaan:
// de voorwaarde heette "raak je de rand" en de lus "herhaal oneindig". Die
// stonden in theorieblok B van 8.2, in de praktijkopdracht, in het
// modelantwoord, in het oefenblok, in deeltoetsvraag 5 en in diagnose 5 - dus
// nergens in het hoofdstuk stond de goede naam. Allemaal hersteld. De
// categorie staat er sinds ronde 2 overal bij, want kleur alleen is te weinig:
// er staan tientallen oranje blokken in de lijst.
// Ronde 1 waarschuwde al terecht dat zoeken op "keer om" niets oplevert; de
// volledige naam "keer om aan de rand" staat daarom nog steeds overal voluit.
//
// HET SCRIPT ZELF IS OOK RECHTGEZET (VERBETERPUNT UIT RONDE 1)
// -----------------------------------------------------------
// Ronde 1 bouwde "als <raak je de rand> dan <keer om aan de rand>". Dat is
// bouwkundig dubbelop: "keer om aan de rand" controleert de rand zelf al, dus
// de als-dan eromheen doet niets extra's en een docent streept dat aan.
// Het voorbeeldscript zet nu "neem 10 stappen" en "keer om aan de rand" naast
// elkaar binnen de herhaling, en gebruikt de als-dan voor iets wat het
// kaatsblok NIET levert: als "raak ik ( rand )?", zeg dan "Boing!". Zo dragen
// de herhaling en de keuze allebei hun eigen werk. De theorie zegt er expliciet
// bij dat om het kaatsblok geen als-dan hoeft. Meegetrokken omdat ze aan
// hetzelfde script hingen: de praktijkopdracht van 8.2 en haar modelantwoord,
// twee navertelvragen, twee oefenopgaven, deeltoetsvraag 5 en 6, diagnose 5 en
// 6, het uitgewerkte voorbeeld bij 8.2 B en drie vragen in de hoofdstuktoets.
//
// LES 18 EN HET BEELD DAT ONTBREEKT (OPENSTAANDE POST)
// ---------------------------------------------------
// De bron toont vier schermafbeeldingen: de homepagina, de grote plusknop
// links, de lege poster met het linkermenu, en het menu "laag" bij "Zo:". Die
// vier beelden zijn niet met de tekst meegeleverd en zijn hier dus NIET
// gereproduceerd. In plaats daarvan staat er een tekstuele vervanging: een
// genummerd stappenplan in de opdracht en een lijst die per schermdeel zegt wat
// er staat en waar. Op kaderniveau scheelt een schermafbeelding meer dan een
// genummerde stap, dus dit blijft een gat. Zodra de schermafbeeldingen er zijn,
// horen ze als extra mediablokken bij 8.4.
//
// MEDIA IN DIT HOOFDSTUK
// ----------------------
// Negen mediablokken over zes paragrafen. De generator zet elk mediablok ná het
// oefenblok en vóór de praktijkopdracht; dat is een bewuste keuze in
// scripts/generate-digitale-vaardigheden-seed.mjs (een filmpje vóór de eigen
// poging wordt een tweede uitlegmoment). Het beeld staat dus NIET vooraan in de
// paragraaf, en de kijkvragen zijn daarop geschreven: ze vragen de leerling om
// de video te vergelijken met wat hij zelf al gedaan heeft.
//   8.1  vmq6Rehhl6Q  "Wat is een algoritme? | Huh?!" (Het Klokhuis)
//   8.2  NkjtZl1MpfI  "Scratch voor beginners" (Makersbase Breda), voordoen van
//        het bouwen zelf, + uY6smVKxjQA "Als...dan | Blokkenseries Scratch"
//        (Scratch Labs) voor de keuze.
//   8.3  GlqkuktSmyE  "In de ruimte - Scratch Game Tutorial Nederlands"
//        (Skillsdojo): de maker bouwt in kleine stukjes en test er steeds
//        tussendoor, precies de werkwijze van deze paragraaf.
//   8.4  oVH6Qu9HEZ4  Canva-account maken en downloaden (uit links.txt, de
//        video die de bron zelf bij stap 8 noemt) + z9z7RLIc4u8 "Easy4u: een
//        poster ontwerpen met Canva.com" (meneerICT) als voordoen van de poster.
//   8.5  qYys36TLtuA  "3 Tips Om je Eigen Poster te Ontwerpen" (Helloacademy)
//        + talkai.info, de chatbot die de bronopdracht zelf noemt (uit
//        links.txt). Dat tweede blok is bewust geen video: het is gereedschap
//        dat de leerling moet openen.
//   8.6  pdVvcAav_Jk  "Basicly - Wat is digitale geletterdheid?" voor de
//        terugblik over het hele jaar.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/kb/h8.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

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

// Leerdoelen uit hoofdstuk 7, letterlijk overgetypt uit het jaarplan. Ze horen
// bij de voorkennischeck bovenaan 8.1 en bij de twee terugkeervragen in de
// afsluitquiz van 8.1. De keuze is niet willekeurig: 8.1 leunt op "AI denkt
// niet zelf mee", en 8.5 leunt op de prompt, op het controleren van een
// chatbotantwoord en op het niet delen van gegevens.
const VORIG = {
  data: 'Je weet dat AI leert van data en niet denkt zoals een mens.',
  prompt: 'Je kunt een duidelijke prompt schrijven met opdracht, onderwerp, doelgroep en lengte.',
  controleren: 'Je kunt controleren of het antwoord van een chatbot klopt.',
  gegevens: 'Je weet waarom je geen persoonlijke gegevens deelt met AI.'
};

export default {
  chapter: 8,
  chapterTitle: 'Zelf maken: programmeren, ontwerpen en terugblikken',
  badge: 'Digitale Maker',
  paragraphs: [
    p('8.1', 'Algoritmes: een stappenplan voor de computer', ['22B', '21A'], 'eigen stappenplan van een dagelijkse handeling, getest door een klasgenoot', 100, 'Stappen Sorteren',
      ['Een algoritme is een stappenplan',
        'Pak in gedachten het recept erbij waarmee jij pannenkoeken bakt. ' +
        'Daar staat stap voor stap in wat je moet doen. ' +
        "Zo'n rij stappen in een vaste volgorde heet een stappenplan. " +
        'Met een moeilijker woord noem je zoiets een algoritme.' +
        '</p><p><strong>Doe dit even:</strong> noem hardop de eerste drie stappen van jouw ochtend, vanaf de wekker.</p><p>' +
        'Zeg tegen een klasgenoot "smeer een boterham" en hij snapt je meteen. ' +
        'Een machine snapt die opdracht niet en wacht op elke losse handeling. ' +
        'Voor de machine schrijf je dus op: pak de zak, haal er twee sneetjes uit. ' +
        'Daarna schrijf je op: pak een mes en doe daar boter op. ' +
        'Wat jij in je hoofd overslaat, gebeurt bij een machine gewoon niet. ' +
        'In hoofdstuk 7 zag je al dat AI leert van data en niet meedenkt.' +
        '</p><p><strong>Doe dit even:</strong> schrijf op hoe je je jas aantrekt. Tel daarna de handelingen die je vergat.</p><p>' +
        'De volgorde weegt net zo zwaar als de stappen zelf. ' +
        'Eerst smeren en dan beleggen geeft een andere boterham dan andersom. ' +
        'Je controleert je lijstje door het letterlijk uit te voeren. ' +
        'Loop je vast, dan weet je meteen welke stap ontbreekt. ' +
        'Het woord algoritme komt van Al-Chwarizmi, een wiskundige van rond het jaar 800. ' +
        'Hij schreef rekenregels op die iedereen kon volgen zonder eigen invulling.'],
      ['Herhaling en keuze in een stappenplan',
        'Een stappenplan dat alleen rechtdoor loopt, wordt al snel eindeloos lang. ' +
        'Daarom zitten er in bijna elk stappenplan twee handige bouwstenen. ' +
        'De eerste zie je hier: je schrijft niet twintig keer "doe een stap". ' +
        'Je schrijft één regel: herhaal twintig keer, doe een stap. ' +
        'Dat heet een herhaling, en die zegt hoe vaak iets gebeurt.' +
        '</p><p><strong>Doe dit even:</strong> zeg in één zin hoe je twaalf keer je naam schrijft.</p><p>' +
        'De tweede bouwsteen begint met iets dat je vast herkent. ' +
        'Als het regent, dan pak je een jas, anders pak je een pet. ' +
        'Dat heet een keuze, en zo\'n keuze begint bijna altijd met "als". ' +
        'Het stuk achter "als" heet de voorwaarde. ' +
        'Een voorwaarde kan waar zijn of niet waar, meer smaken zijn er niet.' +
        '</p><ul>' +
        '<li>Regent het? Dan is de voorwaarde waar en pak je de jas.</li>' +
        '<li>Regent het niet? Dan is de voorwaarde niet waar en pak je de pet.</li>' +
        '</ul><p>' +
        'Elke programmeertaal ter wereld kent een herhaling en een keuze. ' +
        'Je komt ze in de volgende paragraaf in Scratch dus meteen weer tegen. ' +
        'Denken in stappen die een machine kan uitvoeren heet computationeel denken. ' +
        'Dat is precies wat jij hierboven met die jas en die pet deed.'],
      media('https://www.youtube.com/embed/vmq6Rehhl6Q', 'Het Klokhuis: wat is een algoritme?', 'Noem uit de video één algoritme dat jij vandaag zelf al gebruikt hebt. Schrijf er de eerste stap bij op.'),
      [
        {
          vraag: 'Terugblik hoofdstuk 7. Waarvan leert AI, en waarom is dat iets anders dan zelf meedenken?',
          antwoord: 'AI leert uit data, dus uit heel veel voorbeelden. Snappen waar iets echt over gaat, dat gebeurt niet.',
          uitleg: 'Precies daarom schrijf je in dit hoofdstuk elke stap uit. Een machine vult nooit in wat jij vergeten bent.',
          leerdoel: VORIG.data
        },
        {
          vraag: 'Terugblik hoofdstuk 7. Uit welke vier onderdelen bestaat een goede prompt?',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte die je terug wilt krijgen.',
          uitleg: 'In 8.5 schrijf je zelf zo\'n prompt voor je poster. Hoe scherper die vier zijn, hoe bruikbaarder het antwoord.',
          leerdoel: VORIG.prompt
        },
        {
          vraag: 'Terugblik hoofdstuk 7. Hoe controleer je of het antwoord van een chatbot echt klopt?',
          antwoord: 'Je zoekt hetzelfde feit nog een keer op bij een andere bron. Komt het niet overeen, dan klopt het niet.',
          uitleg: 'Dat verzinnen heet hallucinatie. In 8.5 zet je chatbottekst op een poster, dus controleren is daar geen luxe.',
          leerdoel: VORIG.controleren
        },
        {
          vraag: 'Terugblik hoofdstuk 7. Waarom houd je persoonlijke gegevens weg bij een chatbot?',
          antwoord: 'Die gegevens komen bij een bedrijf terecht. Samen vormen ze een profiel waarmee iemand jou kan vinden.',
          uitleg: 'Dezelfde regel geldt straks bij je poster. Zet er niets op wat jou of een klasgenoot herkenbaar maakt.',
          leerdoel: VORIG.gegevens
        },
        {
          vraag: 'Een klasgenoot moet van jou een boterham smeren. Wat zeg je, zodat hij niets zelf hoeft in te vullen?',
          antwoord: 'Je noemt elke handeling apart en op volgorde: pak de zak, haal er twee sneetjes uit, pak een mes, doe er boter op.',
          uitleg: 'Een mens vult zelf aan wat jij vergeet. Een machine doet dat niet en heeft elke handeling los nodig.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Hoeveel stappen denk jij nodig te hebben om het inpakken van je tas op te schrijven? Noem er alvast twee.',
          antwoord: 'Bijvoorbeeld acht stappen. Twee ervan zijn: open je rooster, en kijk welke vakken je morgen hebt.',
          uitleg: 'Je merkt hier al iets belangrijks. Je hebt bijna altijd meer stappen nodig dan je vooraf denkt.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Hoe zeg je in gewone taal dat iets twintig keer moet gebeuren? En dat iets alleen bij regen gebeurt?',
          antwoord: 'Bijvoorbeeld zo: "herhaal twintig keer, doe een stap" en "als het regent, dan pak je een jas".',
          uitleg: 'Deze twee zinnen zijn precies een herhaling en een keuze, alleen nog in gewone taal.',
          leerdoel: DOEL.herhaalKeuze
        }
      ],
      {
        tekst: 'Schrijf een stappenplan van een dagelijkse handeling en laat het testen. Werk deze zes stappen op volgorde af.</p><ol>' +
          '<li>Pak een handeling die je elke dag doet. Denk aan je tas inpakken, thee zetten of inloggen op je schoolaccount.</li>' +
          '<li>Schrijf die handeling in Word op in genummerde stappen, minimaal zes en maximaal twaalf.</li>' +
          '<li>Bouw er minstens één herhaling in, bijvoorbeeld: herhaal voor elk vak op je rooster.</li>' +
          '<li>Bouw er minstens één keuze met een voorwaarde in, bijvoorbeeld: als je gym hebt, dan pak je je sporttas.</li>' +
          '<li>Geef je stappenplan aan een klasgenoot. Hij speelt robot en voert het letterlijk uit, zonder zelf iets in te vullen.</li>' +
          '<li>Schrijf onder je stappenplan op welke stap misging en wat je hebt aangepast. Zet daaronder je verbeterde versie, zodat allebei de versies in het bestand staan.</li>' +
          '</ol><p>Lever het Word-bestand in bij je docent.',
        label: 'Lever je Word-bestand met beide versies in. Schrijf hier in één zin bij welke stap jouw tester vastliep.',
        modelAnswer: 'Een voldoende inzending is een genummerde lijst van ongeveer acht stappen. Neem als voorbeeld "tas inpakken voor morgen". Er staat een echte herhaling in, zoals "herhaal voor elk vak op je rooster: pak het boek en het schrift". Er staat ook een echte keuze in, zoals "als je gym hebt, pak dan ook je sporttas". Daaronder staat een concrete testuitkomst. Bijvoorbeeld: "Mijn tester kwam niet verder bij stap 1. Ik had niet gezegd dat je eerst je rooster opent. Die stap staat er nu vooraan bij." De tweede versie in het bestand laat die aanpassing ook echt zien.',
        nakijkpunten: [
          'Elke stap is uitvoerbaar op het moment dat hij aan de beurt is.',
          'Er staat een werkende herhaling in, en een keuze waarvan de voorwaarde te herkennen is.',
          'Je noemt een concrete fout uit de test en de aanpassing die daarop volgde.',
          'Allebei de versies staan in het bestand, dus voor en na de test.'
        ]
      },
      ['Wat is een algoritme?', 'Waarom telt de volgorde van de stappen mee?', 'Wat doet een herhaling in een stappenplan?', 'Wat is een voorwaarde bij een keuze?', 'Waarom mag je tester niet meedenken?', 'Terugblik hoofdstuk 7: waarvan leert AI?'],
      'Sleep de losse instructies op volgorde. Bouw er daarna zelf een herhaling en een keuze bij.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Sam schrijft: 1. doe de deur op slot, 2. loop naar buiten, 3. pak je sleutel. Welke stap staat verkeerd?',
            antwoord: 'Stap 3 staat te laat. Je moet je sleutel al hebben voordat je in stap 1 de deur op slot doet.',
            uitleg: 'Voer het rijtje eens letterlijk uit. Bij stap 1 heb je nog geen sleutel, dus daar loop je vast. Goed is: pak je sleutel, loop naar buiten, doe de deur op slot.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'samen',
            vraag: 'Zeg om de beurt in één zin wat een algoritme is. Wat zei de ander anders dan jij?',
            antwoord: 'Een goede zin is: een algoritme is een stappenplan dat precies zegt hoe je iets doet.',
            uitleg: 'Wie het woord stappenplan of volgorde gebruikt, zit dicht bij de tekst. Wie zegt "een computerprogramma", mist dat je het ook op papier kunt schrijven.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf het opladen van je telefoon op in hooguit zes stappen. Een ander moet ze precies zo kunnen doen.',
            antwoord: 'Bijvoorbeeld: 1. pak de kabel. 2. steek de stekker in het stopcontact. 3. steek het kleine eind in je telefoon. 4. kijk of het laadsymbool verschijnt.',
            uitleg: 'Let op de stappen die je normaal overslaat, zoals het pakken van de kabel. Op precies zulke vergeten stappen loopt een machine vast.',
            leerdoel: DOEL.stappen
          },
          {
            groep: 'zelf',
            vraag: 'Waar past in jouw stappenplan van hierboven een herhaling? En waar past een keuze met een voorwaarde?',
            antwoord: 'Een herhaling past bij "herhaal tot de accu vol is". Een keuze past bij "als de accu onder de twintig procent zit, laad dan op".',
            uitleg: 'Een herhaling herken je aan iets dat vaker moet gebeuren. Een keuze herken je aan het woordje "als". De voorwaarde is hier het percentage van je accu.',
            leerdoel: DOEL.herhaalKeuze
          },
          {
            groep: 'steun',
            vraag: 'Vul de twee gaten. Een algoritme is een ..., en pas als de ... klopt werkt het.',
            antwoord: 'Op de eerste plek hoort stappenplan. Op de tweede plek hoort volgorde.',
            uitleg: 'Deze twee woorden zijn de kern van de paragraaf. Stappenplan gaat over wat er gebeurt, volgorde over wanneer het gebeurt.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat er niet bij hoort. Een herhaling zegt: hoe vaak / onder welke voorwaarde / hoeveel keer iets gebeurt.',
            antwoord: '"Onder welke voorwaarde" hoort er niet bij. Dat is namelijk een keuze en geen herhaling.',
            uitleg: 'Hoe vaak en hoeveel keer betekenen hier hetzelfde. Een voorwaarde hoort altijd bij het woordje "als".',
            leerdoel: DOEL.herhaalKeuze
          },
          {
            groep: 'plus',
            vraag: 'Twee mensen voeren hetzelfde stappenplan uit en krijgen toch een ander resultaat. Hoe kan dat?',
            antwoord: 'Er staat een stap in die niet precies genoeg is. Of een keuze valt bij hen op een andere voorwaarde uit.',
            uitleg: 'Een stap als "doe er wat suiker in" laat ruimte voor eigen invulling. En "als het regent" valt bij de een anders uit dan bij de ander.',
            leerdoel: DOEL.herhaalKeuze
          }
        ]
      }),

    p('8.2', 'Zelf programmeren met blokken', ['22B', '22A'], 'werkend blokprogramma in Scratch met een herhaling en een als-dan-keuze', 100, 'Blokkenbouwer',
      ['Van stappenplan naar blokken',
        'Je stappenplan uit 8.1 stond op papier, en nu laat je het echt werken. ' +
        'Dat doe je in Scratch, en Scratch is een blokkentaal. ' +
        'In een blokkentaal klik je gekleurde blokken aan elkaar in plaats van tekst te typen. ' +
        'Elk blok is één instructie, net als één stap in jouw stappenplan. ' +
        'De vorm van een blok laat zien welk blok eronder past. ' +
        'Blokken die niet bij elkaar horen, klikken simpelweg niet vast.' +
        '</p><p>' +
        'Let op: dat betekent niet dat je programma daarna vanzelf klopt. ' +
        'Je kunt de blokken namelijk nog steeds in de verkeerde volgorde zetten. ' +
        'Over dat soort fouten opsporen gaat paragraaf 8.3 helemaal.' +
        '</p><p><strong>Doe dit even:</strong> open scratch.mit.edu, klik op Maken en wijs aan waar het speelveld staat.</p><p>' +
        'Je werkt in Scratch altijd met een sprite, en dat woord kom je overal tegen. ' +
        'Een sprite is het figuur op het speelveld dat jouw opdrachten uitvoert. ' +
        'Standaard is dat de kat die je bij een nieuw project meteen ziet staan. ' +
        'De blokken die je onder elkaar klikt heten samen een script. ' +
        'Dat script is jouw programma, en de computer werkt het van boven naar beneden af.' +
        '</p><p>' +
        'Installeren hoeft niet, want Scratch werkt gewoon in je browser. ' +
        'Handig aan blokken is dat je er geen tikfout in kunt maken. ' +
        'Je aandacht gaat naar de volgorde en niet naar de spelling.'],
      ['Gebeurtenis, herhaling en de als-dan-keuze',
        'Elk script begint met een gebeurtenis, en die zegt wanneer je programma gaat lopen. ' +
        'Meestal is dat het gele blok "wanneer op de groene vlag wordt geklikt" uit Gebeurtenissen. ' +
        'Dat blok zet je helemaal bovenaan, en de rest van je blokken klik je eronder vast. ' +
        'Daarna heb je twee blokken nodig die je uit 8.1 al kent. ' +
        'Let goed op de categorie erbij, want zo vind je een blok in de lijst terug.' +
        '</p><ul>' +
        '<li>Het herhaal-blok heet in het Nederlandse Scratch gewoon <strong>herhaal</strong> en staat in de oranje categorie Besturen. Het is een lus met een opening erin. Alles wat je in die opening legt, gebeurt steeds opnieuw.</li>' +
        '<li>De keuze is het blok <strong>als … dan</strong>, ook uit Besturen. In de zeshoekige gleuf schuif je een voorwaarde uit de lichtblauwe categorie Waarnemen, bijvoorbeeld <strong>raak ik (rand)?</strong> met rand gekozen in het uitklapmenu.</li>' +
        '</ul><p>' +
        'De blokken binnen een als-dan-blok werken alleen op de momenten dat de voorwaarde waar is. ' +
        'Hier is een klein programma dat meteen al speelbaar is op je scherm. ' +
        'Zet het blok herhaal onder de groene vlag en leg daarin "neem 10 stappen". ' +
        'Leg daar ook "keer om aan de rand" in, allebei blauwe blokken uit de categorie Beweging. ' +
        'Zoek je in de blokkenlijst alleen op "keer om", dan vind je dat laatste blok niet.' +
        '</p><p><strong>Doe dit even:</strong> klik op de groene vlag en tel de omkeringen in tien seconden.</p><p>' +
        'Om "keer om aan de rand" hoef je geen als-dan te zetten. ' +
        'Dat blok kijkt namelijk zelf al of de sprite de rand raakt. ' +
        'Een als-dan gebruik je juist voor iets extra\'s dat het kaatsblok niet doet. ' +
        'Leg er bijvoorbeeld een in met de voorwaarde "raak ik (rand)?" en daarbinnen zeg "Boing!".' +
        '</p><p>' +
        'Test je programma altijd met de groene vlag voordat je weer verdergaat. ' +
        'Zorg dat je je eigen script daarna blok voor blok kunt navertellen aan een ander. ' +
        'Wie zijn script kan uitleggen, kan het later ook uitbreiden of repareren.'],
      [
        media('https://www.youtube.com/embed/NkjtZl1MpfI', 'Scratch voor beginners: je eerste programma', 'Welk blok zet de maker als eerste bovenaan, en wat gebeurt er pas nadat hij op de groene vlag klikt?'),
        media('https://www.youtube.com/embed/uY6smVKxjQA', 'Als...dan: de keuze in Scratch', 'Welke voorwaarde schuift de maker in het als-dan-blok? Schrijf op wat er gebeurt als die voorwaarde niet waar is.')
      ],
      [
        {
          vraag: 'Heb je eerder met gekleurde blokken geprogrammeerd? Wat verwacht jij als je drie blokken onder elkaar klikt?',
          antwoord: 'De computer voert ze van boven naar beneden uit. Het bovenste blok het eerst, het onderste als laatste.',
          uitleg: 'Blokken werken als de genummerde stappen uit 8.1. De plek in de stapel bepaalt wanneer een instructie aan de beurt is.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'In 8.1 schreef je een herhaling in gewone taal op. Hoe zou zo\'n herhaling er als klikbaar blok uitzien?',
          antwoord: 'Als een blok met een opening erin. In die opening leg je de blokken die steeds opnieuw moeten gebeuren.',
          uitleg: 'De vorm doet hier het werk. Aan de opening zie je meteen wat binnen de herhaling valt en wat erbuiten.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Denk aan een spel dat jij kent. Wat gebeurt er precies nadat je op start drukt? Noem drie dingen op volgorde.',
          antwoord: 'Bijvoorbeeld: de score gaat op nul, het figuur verschijnt links in beeld, en daarna begint hij te lopen.',
          uitleg: 'Dit navertellen op volgorde doe je straks ook bij je eigen script, alleen dan blok voor blok.',
          leerdoel: DOEL.navertellen
        }
      ],
      {
        tekst: 'Bouw je eerste werkende programma in Scratch. Werk deze zeven stappen op volgorde af.</p><ol>' +
          '<li>Ga naar scratch.mit.edu en klik op Maken, zodat de editor opent. Inloggen hoeft niet, maar met een account bewaar je je werk.</li>' +
          '<li>Zet het gele blok "wanneer op de groene vlag wordt geklikt" uit Gebeurtenissen bovenaan je script.</li>' +
          '<li>Klik daaronder het oranje blok <strong>herhaal</strong> uit de categorie Besturen. Leg daarin het blauwe blok "neem 10 stappen" uit Beweging.</li>' +
          '<li>Leg in diezelfde herhaling ook "keer om aan de rand", eveneens uit Beweging. Zoek je alleen op "keer om", dan vind je dat blok niet. Om dit blok hoeft geen als-dan heen, want het kijkt zelf al naar de rand.</li>' +
          '<li>Voeg iets extra\'s toe met een als-dan-blok uit Besturen. Schuif in de gleuf de voorwaarde <strong>raak ik (rand)?</strong> uit Waarnemen, met rand gekozen in het uitklapmenu. Leg daarbinnen bijvoorbeeld zeg "Boing!" uit Uiterlijken.</li>' +
          '<li>Druk op de groene vlag en kijk of er gebeurt wat jij bedacht had. Werkt het niet? Kijk dan of je beweegblok wel echt binnen de herhaling ligt. Maak daarna een screenshot van je script en een screenshot van het speelveld.</li>' +
          '<li>Schrijf er in Word vijf tot acht regels bij. Leg daarin stap voor stap uit wat jouw programma doet en waarom je die blokken koos.</li>' +
          '</ol><p>Lever het Word-bestand met allebei de screenshots in bij je docent.',
        label: 'Lever je screenshots met uitleg in. Schrijf hier in twee zinnen wat jouw programma doet.',
        modelAnswer: 'Een voldoende inzending toont een screenshot waarop het gele startblok bovenaan staat. Daaronder staat het oranje blok "herhaal". Daarbinnen staan "neem 10 stappen" en "keer om aan de rand", plus een als-dan-blok met de voorwaarde "raak ik (rand)?" en daarin zeg "Boing!". De uitleg eronder klinkt bijvoorbeeld zo: "Mijn script begint zodra iemand op de groene vlag klikt. Door de herhaling blijft de kat steeds opnieuw tien stappen lopen. Het blok keer om aan de rand zorgt zelf dat ze terugkaatst. Het als-dan-blok kijkt elke ronde of ze de rand raakt. Alleen op dat moment roept ze Boing." Die uitleg volgt de blokken netjes van boven naar beneden.',
        nakijkpunten: [
          'Het script bevat een gebeurtenisblok, een herhaling en een als-dan-keuze.',
          'Op het speelveld doet het programma zichtbaar wat de leerling beschrijft.',
          'De uitleg loopt van blok naar blok en zegt wat binnen de herhaling ligt.'
        ]
      },
      ['Wat is een sprite?', 'Waarmee begint bijna elk Scratch-script?', 'Wat doet een herhaal-blok?', 'Wat schuif je in een als-dan-blok?', 'Waarom kun je met blokken geen tikfout maken?', 'Terugblik 8.1: wat doet een herhaling?'],
      'Klik blokken vast tot je sprite de opdracht haalt. Elk level vraagt er een herhaling of keuze bij.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een klasgenoot legde "neem 10 stappen" los op het werkveld, zonder blok erboven. Waarom gebeurt er niets?',
            antwoord: 'Er is geen gebeurtenis die het script start. De computer weet dus niet wanneer dat blok aan de beurt is.',
            uitleg: 'Een script zonder gebeurtenisblok is als een recept zonder beginmoment. Zet "wanneer op de groene vlag wordt geklikt" erboven, dan loopt het wel.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'samen',
            vraag: 'Wijs samen op het scherm aan: waar zit de sprite, waar zit het script, en waar staat de groene vlag?',
            antwoord: 'De sprite is het figuur op het speelveld rechts. Het script is de stapel blokken in het midden. De groene vlag staat boven het speelveld.',
            uitleg: 'Als je deze drie plekken kunt aanwijzen, kun je elke uitleg volgen. Sprite is wie het doet, script is wat hij doet.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'zelf',
            vraag: 'Je sprite moet blijven lopen en bij de rand omdraaien. Welke twee blokken zet je in de herhaling?',
            antwoord: 'Het blok "neem 10 stappen" en het blok "keer om aan de rand". Allebei staan ze in de categorie Beweging.',
            uitleg: 'Een als-dan is hier niet nodig, want "keer om aan de rand" controleert de rand helemaal zelf. De plek telt wel mee: liggen deze blokken buiten de herhaling, dan gebeuren ze maar één keer.',
            leerdoel: DOEL.gebruiken
          },
          {
            groep: 'zelf',
            vraag: 'Vertel je eigen script na in vier zinnen. Je klasgenoot ziet je scherm niet, dus begin bij het startblok.',
            antwoord: 'Bijvoorbeeld: het start bij de groene vlag. Dan begint de herhaling. Daarbinnen loopt de kat tien stappen en keert ze om aan de rand. Het als-dan-blok laat haar op dat moment Boing roepen.',
            uitleg: 'Navertel je in de volgorde van je blokken, dan vallen de gaten vanzelf op. Blijf je ergens hangen, dan zit daar meestal de fout.',
            leerdoel: DOEL.navertellen
          },
          {
            groep: 'steun',
            vraag: 'In welke categorie zoek je deze drie blokken? "wanneer op de groene vlag wordt geklikt", "herhaal" en "raak ik (rand)?".',
            antwoord: 'Het startblok staat in Gebeurtenissen. Het blok herhaal staat in Besturen. De voorwaarde "raak ik (rand)?" staat in Waarnemen.',
            uitleg: 'De categorie is sneller dan de kleur, want er staan tientallen oranje blokken in de lijst. Gebeurtenis zegt wanneer, herhaling zegt hoe vaak, keuze zegt onder welke voorwaarde.',
            leerdoel: DOEL.gebruiken
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: het figuur op het speelveld heet een ..., en de stapel blokken heet een ...',
            antwoord: 'Op de eerste plek hoort sprite. Op de tweede plek hoort script.',
            uitleg: 'Deze twee woorden gebruik je de rest van het hoofdstuk. Sprite is de uitvoerder, script is de opdracht.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'plus',
            vraag: 'In blokken klikt een onmogelijke combinatie niet vast. Waarom kan er dan toch nog een fout in je script zitten?',
            antwoord: 'De vorm regelt alleen wat past. De volgorde bepaal je zelf, en die kan gewoon verkeerd zijn.',
            uitleg: 'Een blok buiten de herhaling past prima, maar doet dan iets anders dan je bedoelde. Dat soort fouten heet een bug, en die haal je er in 8.3 uit.',
            leerdoel: DOEL.bouwen
          }
        ]
      }),

    p('8.3', 'Testen en verbeteren: fouten uit je programma halen', ['22B'], 'testverslag met drie fouten erin en de verbetering erbij', 100, 'Bugjacht',
      ['Wat een bug is en hoe je hem vindt',
        'Je kat loopt dwars door de rand heen in plaats van om te keren. ' +
        'Zoiets heet een bug. ' +
        'Een bug is een fout waardoor je programma iets anders doet dan de bedoeling. ' +
        'Dat woord bestond in de techniek al lang voor de computer. ' +
        'Thomas Edison schreef er in 1878 al over in zijn brieven.' +
        '</p><p>' +
        'Beroemd werd het woord pas in 1947, en wel door een insect. ' +
        'Toen zat er echt een mot tussen de contacten van een computer. ' +
        'Nu bedoelen we er elke programmeerfout mee, van een verkeerd getal tot een vergeten blok. ' +
        'Elke programmeur ter wereld maakt bugs, en dat gebeurt elke werkdag opnieuw.' +
        '</p><p><strong>Doe dit even:</strong> leg je buurman uit wat een bug is, zonder het woord fout.</p><p>' +
        'Het echte werk zit dus niet in foutloos bouwen, maar in het opsporen van fouten. ' +
        'Dat opsporen begint bij testen: je probeert je programma ook uit waar het stuk kan gaan.' +
        '</p><p>' +
        'Verschijnt er een foutmelding, lees die dan echt en klik hem niet meteen weg. ' +
        'In zo\'n melding staat meestal al bij welk blok het misging. ' +
        'Gebeurt er niets zichtbaars, klik dan je blokken één voor één aan. ' +
        'Zo vind je het laatste moment waarop alles nog goed ging.'],
      ['Debuggen doe je stap voor stap, en samen',
        'Fouten opsporen en herstellen heet debuggen, en dat doe je niet op goed geluk. ' +
        'Je werkt bij het debuggen met een vaste werkwijze, en drie regels helpen daarbij altijd.' +
        '</p><ul>' +
        '<li>Verander steeds maar één ding tegelijk. Dan weet je na elke test wat die wijziging deed.</li>' +
        '<li>Zet een stuk van je script tijdelijk uit. Zo zie je of de fout verdwijnt of gewoon blijft.</li>' +
        '<li>Laat je sprite tussendoor iets zeggen. Dan zie je op het scherm hoe ver je programma komt.</li>' +
        '</ul><p>' +
        'Naast deze drie regels is er nog een truc die verrassend goed werkt. ' +
        'Leg je programma hardop uit aan een klasgenoot of desnoods aan een badeendje. ' +
        'Halverwege je eigen uitleg zie je de fout meestal zelf. ' +
        'Uitleggen dwingt je namelijk elke stap te benoemen, ook de stappen die je in je hoofd overslaat.' +
        '</p><p><strong>Doe dit even:</strong> leg de eerste drie blokken van je script hardop uit aan je buurman.</p><p>' +
        'Werk daarnaast met een testplan, waarin je vooraf opschrijft wat er zou moeten gebeuren. ' +
        'Laat daarna een klasgenoot je programma proberen en noteer letterlijk wat hij zag gebeuren. ' +
        'Schrijf dus op wat hij zag gebeuren, en niet wat hij ervan vond. ' +
        'Dat opmerken van een ander over jouw werk is precies wat feedback betekent. ' +
        'Verbeter één fout tegelijk en test na elke verbetering opnieuw.'],
      media('https://www.youtube.com/embed/GlqkuktSmyE', 'In de ruimte: een Scratch-spel stap voor stap gebouwd', 'De maker klikt steeds tussendoor op de groene vlag. Noem één zo\'n tussentijdse test en zeg wat hij anders pas veel later gemerkt had.'),
      [
        {
          vraag: 'Een app op je telefoon reageert opeens raar. Hoe kom jij erachter waar het misloopt?',
          antwoord: 'Bijvoorbeeld door het nog eens te proberen. Je gaat stap voor stap terug en kijkt wanneer het nog wel goed ging.',
          uitleg: 'Dat terugstappen is precies wat testen is. Je zoekt het laatste moment waarop alles nog klopte, want daarna zit de fout.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Uit games ken je het woord bug misschien al. Wat betekent het volgens jou, en waar komt het vandaan?',
          antwoord: 'Een fout in een programma waardoor het iets anders doet dan bedoeld. Het woord bug betekent letterlijk insect.',
          uitleg: 'Die betekenis is geen toeval. In 1947 zat er echt een mot in een computer, en dat verhaal bleef hangen.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Iemand ziet in jouw werkstuk iets ontbreken wat jij zelf over het hoofd zag. Wat doe je met die opmerking?',
          antwoord: 'Je vraagt precies wat hij zag. Daarna controleer je het zelf en beslis je of je het aanpast.',
          uitleg: 'Een ander kijkt naar je werk zonder te weten wat je bedoelde. Daardoor valt hem juist op wat jij overslaat bij het lezen.',
          leerdoel: DOEL.feedback
        }
      ],
      {
        tekst: 'Schrijf een testverslag over het programma dat je in 8.2 gebouwd hebt. Werk deze vijf stappen op volgorde af.</p><ol>' +
          '<li>Schrijf in Word een testplan met drie dingen die zouden moeten werken. Bijvoorbeeld: de sprite start bij de groene vlag, hij blijft bewegen, hij keert om aan de rand.</li>' +
          '<li>Bouw zelf bewust een fout in, bijvoorbeeld door de voorwaarde in je als-dan-blok te veranderen. Schrijf op wat er daarna misging.</li>' +
          '<li>Ruil van plek met een klasgenoot en laat hem jouw programma testen. Noteer letterlijk wat hij opmerkte.</li>' +
          '<li>Los de fouten één voor één op. Schrijf per fout drie dingen op: wat er misging, wat je veranderd hebt, en hoe je gecontroleerd hebt dat het nu klopt.</li>' +
          '<li>Sluit af met twee regels over de feedback van je klasgenoot. Zeg wat je overnam en wat niet, en waarom.</li>' +
          '</ol><p>Lever het testverslag in bij je docent.',
        label: 'Lever je testverslag in. Schrijf hier welke fout je klasgenoot vond die jij zelf gemist had.',
        modelAnswer: 'Een voldoende testverslag bevat een tabel met drie rijen. Zo\'n rij ziet er bijvoorbeeld zo uit: "Verwacht: de kat keert om bij de rand. Gebeurde: de kat bleef trillen tegen de rand aan. Veranderd: na het omkeren eerst drie stappen laten lopen. Gecontroleerd: tien keer laten stuiteren, en het trillen was weg." Daaronder staat een echte reactie op de feedback. Bijvoorbeeld: "Sami zag dat mijn kat op zijn kop hing. Die tip heb ik overgenomen en ik heb de draaistijl aangepast. Hij zei ook dat ik alles opnieuw moest bouwen. Dat heb ik niet gedaan, want er zat maar één blok fout."',
        nakijkpunten: [
          'Het testplan is vooraf geschreven en zegt per punt wat er zou moeten gebeuren.',
          'Per fout staat er wat er misging, wat er veranderd is en hoe dat gecontroleerd is.',
          'Van de feedback staat erbij wat is overgenomen en wat niet, met een reden.'
        ]
      },
      ['Wat is een bug?', 'Waarom probeer je ook wegen die je niet bedacht had?', 'Wat betekent debuggen?', 'Waarom verbeter je één fout tegelijk?', 'Waarom helpt hardop uitleggen je bij het zoeken?', 'Terugblik 8.2: wat schuif je in een als-dan-blok?'],
      'Vind in vijf kapotte programma\'s de bug, kies de juiste verbetering en test opnieuw.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een sprite beweegt helemaal niet. Welke drie dingen loop je na, en in welke volgorde?',
            antwoord: 'Eerst het startblok. Dan de volgorde van de blokken. Daarna of het beweegblok wel binnen de herhaling ligt.',
            uitleg: 'Je werkt van buiten naar binnen. Eerst of het script start, dan of de stappen kloppen, en pas daarna of ze goed liggen.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'samen',
            vraag: 'Schrijf samen een testplan van drie regels voor het programma van 8.2. Wat zou er moeten gebeuren?',
            antwoord: 'Bijvoorbeeld: 1. hij start bij de groene vlag, 2. hij blijft lopen, 3. hij keert om zodra hij de rand raakt.',
            uitleg: 'Een testplan schrijf je vooraf op. Anders praat je je resultaat achteraf goed en vind je de fout niet.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'zelf',
            vraag: 'Leg in twee zinnen uit wat een bug is. Zeg er ook bij waarom een foutmelding hulp is en geen straf.',
            antwoord: 'Een bug is een fout waardoor je programma iets anders doet dan bedoeld. Een foutmelding zegt vaak precies waar het misging.',
            uitleg: 'Krijg je geen melding, dan moet je zelf op zoek naar de plek. Met een melding heb je die plek al, en dat scheelt je veel tijd.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'zelf',
            vraag: 'Je verandert drie dingen tegelijk en daarna werkt het programma. Waarom is dat toch een slecht idee?',
            antwoord: 'Je weet nu niet welke van de drie de fout oploste. De andere twee kunnen ondertussen nieuwe fouten geven.',
            uitleg: 'Debuggen betekent: één ding veranderen, dan testen, dan pas verder. Zo hoort er bij elke wijziging een eigen uitkomst.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: fouten opsporen en herstellen heet ..., en je verandert daarbij steeds ... ding tegelijk.',
            antwoord: 'Op de eerste plek hoort debuggen. Op de tweede plek hoort één.',
            uitleg: 'Deze twee woorden zijn de kern van deze paragraaf. Debuggen is het werk, één ding tegelijk is de werkwijze.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'steun',
            vraag: 'Je klasgenoot zegt: "je kat blijft aan de rand hangen." Welke vraag stel je hem als eerste?',
            antwoord: 'Je vraagt precies wat hij deed en wat hij zag. Bijvoorbeeld: hoe vaak gebeurde het, en aan welke rand?',
            uitleg: 'Feedback wordt pas bruikbaar als je weet wat er precies gebeurde. "Het werkt niet" is nog geen fout die je kunt zoeken.',
            leerdoel: DOEL.feedback
          },
          {
            groep: 'plus',
            vraag: 'Waarom vind je een fout vaak zelf terwijl je hem hardop uitlegt aan een badeendje dat niets terugzegt?',
            antwoord: 'Bij hardop uitleggen moet je elke stap echt benoemen. Dan valt op welke stap je stilletjes oversloeg.',
            uitleg: 'Stappen die je goed kent, sla je in gedachten over. Zeg je ze hardop, dan moet je ze alsnog uitspreken, en daar duikt de fout op.',
            leerdoel: DOEL.feedback
          }
        ]
      }),

    p('8.4', 'Zelf ontwerpen in Canva', ['22A'], 'eigen A4-poster uit Canva, ingeleverd als PNG-bestand of PDF', 100, 'Canva Ontwerpduel',
      ['Canva openen en je account aanmaken',
        'Je kent posters vast van de gang op school. ' +
        'Zoiets ga je nu zelf maken, en dat doe je in Canva. ' +
        'Canva is een online ontwerptool voor afbeeldingen, posters, presentaties en meer. ' +
        'Online wil zeggen dat je niets hoeft te installeren op je eigen computer.' +
        '</p><p>' +
        'In Canva begin je meestal met een template, en dat scheelt je een hoop werk. ' +
        'Een template is een kant-en-klaar ontwerp waarin jij de tekst, de kleur en de plaatjes verandert. ' +
        'Van Canva bestaat een gratis versie en daarnaast een betaalde versie met extra\'s. ' +
        'Voor al je schoolwerk is de gratis versie Canva Free ruim genoeg.' +
        '</p><p><strong>Doe dit even:</strong> open www.canva.nl en kijk of je rechtsboven de knop Registreren ziet staan.</p><p>' +
        'Je maakt je account op die site met je schoolmail, dus niet met je privémail. ' +
        'Zo hoort je werk bij je schoolaccount en kom je er op elke schoolcomputer bij. ' +
        'De zeven aanmeldstappen staan één voor één in de praktijkopdracht hieronder. ' +
        'Lukt het aanmelden niet, kijk dan de video verderop in deze paragraaf.' +
        '</p><p>' +
        'Na het inloggen kom je terecht op de homepagina van Canva. ' +
        'Daar staan vier onderdelen die je straks blind moet kunnen aanwijzen.' +
        '</p><ul>' +
        '<li>Bovenin een zoekbalk: daar typ je wat je wilt maken, bijvoorbeeld poster of flyer.</li>' +
        '<li>Links een grote plusknop: daarmee begin je meteen een nieuw leeg ontwerp.</li>' +
        '<li>Een overzicht van je eerdere ontwerpen, zodat je verder kunt waar je stopte.</li>' +
        '<li>Toegang tot templates en tot uploads van je eigen foto\'s.</li>' +
        '</ul><p>' +
        'Ken je die vier, dan vind je alles terug op elke vreemde computer.'],
      ['Je eerste A4-poster en het downloaden',
        'Nu ga je zelf je eerste poster bouwen in Canva. ' +
        'Klik links op de grote plus en typ het woord poster in de zoekbalk. ' +
        'Kies daarna "poster staand, A3" uit de lijst die verschijnt. ' +
        'Je leest hier A3 terwijl de opdracht steeds A4-poster zegt. ' +
        'Dat is geen fout: A3 is twee keer zo groot, met dezelfde verhouding.' +
        '</p><p>' +
        'Links staan de menu\'s Ontwerpen, tekst, elementen en uploads. ' +
        'Onder elementen vind je afbeeldingen, iconen en vormen zoals lijnen en cirkels. ' +
        'Klik nu op een wit gedeelte van je poster, dan verschijnt bovenin een kleurwieltje. ' +
        'Met dat kleurwieltje kies je de achtergrondkleur van je hele poster. ' +
        'Kies daarbij een kleur waarbij jouw letters altijd goed leesbaar blijven.' +
        '</p><p><strong>Doe dit even:</strong> zet één woord op je poster en probeer drie achtergrondkleuren uit. Welke leest het prettigst?</p><p>' +
        'Canva slaat automatisch op, dus zoeken naar een knop bewaren heeft geen zin. ' +
        'Met de rechtermuisknop op een element gooi je het weg via het prullenbakje. ' +
        'Kies je met de rechtermuisknop "laag", dan zet je iets naar voren of naar achteren. ' +
        'Klaar? Klik rechtsboven op Delen en daarna op Downloaden, als PNG of PDF.' +
        '</p><p>' +
        'Lukt downloaden niet omdat je betaalde elementen gebruikt hebt? Dan heb je drie uitwegen.' +
        '</p><ul>' +
        '<li>Vervang de betaalde elementen door gratis elementen die er ongeveer hetzelfde uitzien.</li>' +
        '<li>Maak een screenshot en snijd daaruit alleen je poster, zoals je in hoofdstuk 1 leerde.</li>' +
        '<li>Deel bij Delen een link in plaats van een bestand, zodat je docent online kijkt.</li>' +
        '</ul><p>' +
        'Lever je poster daarna in en vraag je docent hoe dat op jouw school gaat.'],
      [
        media('https://www.youtube.com/embed/oVH6Qu9HEZ4', 'Starten met Canva: account maken en downloaden', 'Welke stap uit de video ging bij jou anders dan in het stappenplan van de opdracht? Schrijf op hoe je het oploste.'),
        media('https://www.youtube.com/embed/z9z7RLIc4u8', 'Een poster ontwerpen met Canva', 'Noem één handeling uit de video die niet in het stappenplan van de opdracht staat en die jij gaat gebruiken.')
      ],
      [
        {
          vraag: 'Deeltoets over 8.1, 8.2 en 8.3. Maak eerst de negen vragen hieronder zonder terug te lezen. Hoeveel had je er goed?',
          antwoord: 'Reken een vraag pas goed als jouw antwoord alles bevat wat in het opengeklapte antwoord staat. Zeven of meer goed? Dan ga je gewoon door en doe je verderop het plusspoor bij Extra plus. Zes of minder goed? Doe dan verderop eerst het steunspoor bij Extra steun en lees de theorie terug die bij je gemiste vragen hoort. De vier vragen ná de deeltoets zijn de gewone startvragen van deze paragraaf.',
          uitleg: 'Deze deeltoets levert geen cijfer op maar een route. Hij staat hier omdat het programmeerdeel af is en je nu overstapt op ontwerpen. Onder elke vraag staat welk stuk theorie je nog eens doorleest als die vraag misging.'
        },
        {
          vraag: 'Deeltoets vraag 1. Beschrijf in één zin wat een algoritme is.',
          antwoord: 'Het is een stappenplan dat precies zegt hoe je van het begin bij het resultaat komt.',
          uitleg: 'Ging deze mis? Lees theorieblok A van 8.1 terug. Let op het woord precies: een stap waar je zelf iets bij mag verzinnen is nog geen instructie.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Deeltoets vraag 2. Goed of fout? Voor een computer mag je stappen weglaten die vanzelf spreken.',
          antwoord: 'Fout. Een computer vult niets zelf in, dus juist die vanzelfsprekende stappen moet je opschrijven.',
          uitleg: 'Ging deze mis? Kijk naar je eigen stappenplan uit de opdracht van 8.1 en naar de stap waarop je tester vastliep.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Deeltoets vraag 3. Waarin verschilt een herhaling van een keuze?',
          antwoord: 'Een herhaling doet dezelfde stappen meerdere keren. Een keuze kijkt eerst naar een voorwaarde en gaat dan één kant op.',
          uitleg: 'Ging deze mis? Lees theorieblok B van 8.1 terug. Een herhaling zegt hoe vaak iets gebeurt, een keuze zegt of het gebeurt.',
          leerdoel: DOEL.herhaalKeuze
        },
        {
          vraag: 'Deeltoets vraag 4. Goed of fout? De sprite is de stapel blokken en het script is het figuur op het speelveld.',
          antwoord: 'Fout, het is precies andersom. De sprite is het figuur, en het script is de stapel blokken.',
          uitleg: 'Ging deze mis? Lees theorieblok A van 8.2 terug. Onthoud het zo: de sprite voert uit, het script zegt wat hij doet.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'Deeltoets vraag 5. Welk blok zet je bovenaan je script, en wat hoort er in een als-dan-blok?',
          antwoord: 'Bovenaan komt "wanneer op de groene vlag wordt geklikt" uit Gebeurtenissen. In het als-dan-blok schuif je een voorwaarde uit Waarnemen, bijvoorbeeld "raak ik (rand)?".',
          uitleg: 'Ging deze mis? Lees theorieblok B van 8.2 terug en kijk daarna naar het screenshot van je eigen script.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Deeltoets vraag 6. Beschrijf jouw eigen Scratch-programma in drie zinnen, van het bovenste blok naar beneden.',
          antwoord: 'Bijvoorbeeld: het start bij de groene vlag. De herhaling laat de kat doorlopen en aan de rand omkeren. Het als-dan-blok laat haar dan Boing roepen.',
          uitleg: 'Ging deze mis? Pak je uitlegtekst uit de opdracht van 8.2 erbij. Navertellen betekent: de volgorde van je blokken volgen.',
          leerdoel: DOEL.navertellen
        },
        {
          vraag: 'Deeltoets vraag 7. Je programma start wel maar beweegt niet. Wat controleer je, en in welke volgorde?',
          antwoord: 'Eerst het startblok. Dan de volgorde van de blokken. Daarna of het beweegblok binnen de herhaling ligt.',
          uitleg: 'Ging deze mis? Lees theorieblok A van 8.3 terug. Je werkt van buiten naar binnen: eerst of het start, dan pas waar het spaak loopt.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Deeltoets vraag 8. Goed of fout? Debuggen betekent een fout inbouwen om je programma te testen.',
          antwoord: 'Fout. Debuggen is een fout opsporen en herstellen, en zo\'n fout heet een bug.',
          uitleg: 'Ging deze mis? Lees theorieblok B van 8.3 terug. Ook een programma dat gewoon draait kan een bug bevatten.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Deeltoets vraag 9. Goed of fout? Vier tips van een klasgenoot voer je het handigst in één keer allemaal door.',
          antwoord: 'Fout. Je doet er één tegelijk en test daartussen, anders weet je niet welke tip hielp.',
          uitleg: 'Ging deze mis? Kijk naar je testverslag uit 8.3 en naar de regel dat je één ding verandert en daarna test.',
          leerdoel: DOEL.feedback
        },
        {
          vraag: 'Welk mailadres gebruik jij bij het aanmelden voor schoolwerk, en waarom niet dat van thuis?',
          antwoord: 'Met je schoolmail. Je werk hoort dan bij je schoolaccount en je docent kan je erop bereiken.',
          uitleg: 'Je schoolmail ken je uit hoofdstuk 1. Alles wat je met dat adres maakt blijft aan school gekoppeld, ook op een ander device.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Je start een programma dat je nog nooit eerder gebruikt hebt. Waar op het beginscherm kijk je als eerste?',
          antwoord: 'Meestal naar de zoekbalk en naar een duidelijke knop om iets nieuws te beginnen. Daarmee kom je overal.',
          uitleg: 'Bijna elk ontwerpprogramma zet dezelfde vier dingen op het beginscherm: zoeken, nieuw starten, je eerdere werk en je sjablonen.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Denk aan een poster uit de gang. Welke onderdelen stonden erop, en waardoor was de titel goed te lezen?',
          antwoord: 'Meestal een grote titel, een afbeelding en een korte tekst. De achtergrondkleur verschilde genoeg van de letterkleur.',
          uitleg: 'Tekst, beeld en kleur zijn precies de drie dingen die je straks zelf toevoegt. Te weinig kleurverschil maakt een titel onleesbaar.',
          leerdoel: DOEL.starten
        },
        {
          vraag: 'Je hebt iets online gemaakt en het moet naar je docent. Welke manieren om in te leveren ken je al?',
          antwoord: 'Bijvoorbeeld uploaden in de leeromgeving, als bijlage meesturen met een mail, of een link doorgeven.',
          uitleg: 'In hoofdstuk 1 leverde je een screenshot in, en dat is dezelfde route. Onthoud dat een link ook een volwaardig alternatief is.',
          leerdoel: DOEL.delen
        }
      ],
      {
        tekst: '<strong>Opdracht 1: maak je eerste A4-poster.</strong> Maak eerst je account in zeven stappen.</p><ol>' +
          '<li>Ga naar www.canva.nl.</li>' +
          '<li>Klik rechtsboven op Registreren.</li>' +
          '<li>Kies hoe je een account maakt: met e-mail. Gebruik je schoolmail en dus niet je privémail.</li>' +
          '<li>Vul je voornaam, achternaam en wachtwoord in en klik op Doorgaan.</li>' +
          '<li>Controleer je e-mail en klik op de link om te bevestigen, of vul de code in.</li>' +
          '<li>Ga terug naar Canva, kies Inloggen en vul je gegevens in.</li>' +
          '<li>Je komt terecht op de homepagina van Canva.</li>' +
          '</ol><p>Niet gelukt? Kijk dan de video verderop in deze paragraaf. Bouw daarna je poster in negen stappen.</p><ol>' +
          '<li>Klik op de grote plus aan de linkerkant.</li>' +
          '<li>Er opent een nieuw scherm. Typ bovenin de zoekbalk poster en klik op "poster staand, A3". Je leest hier dus A3 en geen A4, en dat klopt: het is dezelfde staande poster, alleen twee keer zo groot.</li>' +
          '<li>Nu opent een lege poster. Links zie je de menu\'s Ontwerpen, tekst, elementen, uploads en meer.</li>' +
          '<li>Voeg een tekst toe. Ga links naar tekst, kies een stijl die je mooi vindt en zet die in het midden. Je bepaalt zelf de titel, maximaal vijf woorden.</li>' +
          '<li>Ga naar elementen en kies iets dat bij jouw tekst past. Hoeveel plaatjes, iconen of vormen je toevoegt mag je zelf weten.</li>' +
          '<li>Klik op een wit gedeelte van je poster. Bovenin verschijnt een kleurwieltje. Kies een achtergrondkleur waarbij je de tekst nog makkelijk kunt lezen, of pas anders je tekstkleur aan.</li>' +
          '<li>Canva slaat automatisch op.</li>' +
          '<li>Experimenteer verder met tekst, afbeeldingen en vormen. Met de rechtermuisknop en het prullenbakje verwijder je een element. Met de rechtermuisknop en dan "laag" breng je een element naar voren of naar achteren.</li>' +
          '<li>Klaar? Klik rechtsboven op Delen en daarna op Downloaden, als PNG of PDF. Lukt downloaden niet door betaalde elementen? Vervang ze, of maak een screenshot waaruit je alleen je poster snijdt, of deel een link.</li>' +
          '</ol><p>Lever je poster in en vraag je docent hoe dat gaat. Je hebt opdracht 1 ingeleverd en de basis van Canva geoefend. Goed gedaan!</p>' +
          '<p><strong>Opdracht 2: verder oefenen.</strong> Nu kies je zelf wat je maakt.</p><ol>' +
          '<li>Klik linksboven op het woord Canva om terug te gaan naar de homepagina.</li>' +
          '<li>Klik weer op de plus en kies nu zelf wat je maakt. Je mag alles gebruiken: templates, elementen en teksten.</li>' +
          '<li>Je mag een video proberen, een website, een poster, een flyer of iets anders. Je bepaalt het helemaal zelf.</li>' +
          '<li>Download ook dit project als PNG of PDF en lever het in bij de docent. Ook hier gelden dezelfde drie uitwegen als downloaden niet lukt.</li>' +
          '</ol><p>Oefen daarna thuis nog even met inloggen. Volgende les moet je zonder hulp in Canva kunnen werken.',
        label: 'Lever je twee ontwerpen in. Schrijf hier op bij welke stap je het langst bezig was.',
        modelAnswer: 'Een voldoende inzending bestaat uit twee bestanden. Het eerste is de A4-poster uit opdracht 1, met een bestandsnaam als "poster-veiliginternet-Jayden-1C.png". Die poster staat rechtop. In het midden staat een titel van hooguit vijf woorden. Er staat minstens één element bij dat past bij die titel. De achtergrondkleur verschilt genoeg van de letterkleur, zodat de titel leesbaar blijft. Het tweede bestand komt uit opdracht 2 en is zelf gekozen, bijvoorbeeld een flyer of een korte video, ook als PNG of PDF. Lukte downloaden niet, dan zit er een uitgesneden screenshot of een gedeelde link bij, met de reden erbij.',
        nakijkpunten: [
          'Het account is met de schoolmail gemaakt en de leerling logt zelfstandig in.',
          'De poster is staand, met een titel van maximaal vijf woorden en één passend element.',
          'De titel is goed te lezen tegen de achtergrondkleur die de leerling koos.',
          'Allebei de ontwerpen zijn er, als PNG of PDF, of via een van de drie uitwegen.'
        ]
      },
      ['Waarvoor gebruik je Canva?', 'Welke vier onderdelen staan op het beginscherm?', 'Welk mailadres gebruik je bij het registreren?', 'Hoe zet je een element achter een ander element?', 'Welke twee bestandsformaten kies je bij downloaden?', 'Terugblik 8.3: waarom verander je één ding tegelijk?'],
      'Ontwerp tegen de klok. Kies snel de template, de tekst, het element en de kleur die bij de opdracht horen.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg aan iemand die Canva niet kent uit wat het is. Noem daarbij de vier onderdelen van de homepagina.',
            antwoord: 'Canva is een online ontwerptool voor posters, flyers en presentaties. Op de homepagina staan de zoekbalk, de plusknop links, je eerdere ontwerpen en de templates en uploads.',
            uitleg: 'Online betekent dat je niets installeert. Die vier onderdelen vormen je vaste kaart: zoeken, nieuw beginnen, verder werken en materiaal halen.',
            leerdoel: DOEL.account
          },
          {
            groep: 'samen',
            vraag: 'Een klasgenoot registreerde zich bij Canva met zijn privé-Gmail. Welke twee problemen loopt hij nu op?',
            antwoord: 'Zijn werk hangt niet aan zijn schoolaccount. En op een schoolcomputer kan hij er niet zomaar bij.',
            uitleg: 'De school beheert alleen wat aan het schoolaccount hangt. Met een privéadres raak je je werk kwijt zodra je dat adres niet meer gebruikt.',
            leerdoel: DOEL.account
          },
          {
            groep: 'zelf',
            vraag: 'Je titel verdwijnt in een donkere foto op de achtergrond. Noem twee manieren om dat te repareren.',
            antwoord: 'Maak de achtergrondkleur lichter met het kleurwieltje. Of verander de tekstkleur naar wit.',
            uitleg: 'Leesbaar wordt het pas door verschil tussen letter en ondergrond. Je kunt dus twee kanten op: de ondergrond aanpassen of de letter.',
            leerdoel: DOEL.starten
          },
          {
            groep: 'zelf',
            vraag: 'Een plaatje ligt over je titel heen. Wat doe je om de titel weer bovenop te krijgen?',
            antwoord: 'Rechtermuisknop op het plaatje, dan "laag", dan naar achteren. Of rechtermuisknop op de titel en naar voren.',
            uitleg: 'De laag bepaalt wie voor wie staat. Het maakt niet uit welke van de twee je verschuift, zolang de titel maar bovenaan eindigt.',
            leerdoel: DOEL.starten
          },
          {
            groep: 'steun',
            vraag: 'Steunspoor na de deeltoets. Zes of minder van de negen goed? Zoek per gemiste vraag op bij welke paragraaf hij hoort.',
            antwoord: 'De vragen 1, 2 en 3 komen uit 8.1. De vragen 4, 5 en 6 komen uit 8.2. De vragen 7, 8 en 9 komen uit 8.3. Lees die theorieblokken terug voordat je verdergaat.',
            uitleg: 'Op gevoel terugbladeren kost veel tijd en levert weinig op. Noteer eerst het gemiste doel, dan weet je precies welk stuk tekst je nodig hebt. Programmeren is bovendien niet afgesloten: het komt terug in de eindtoets van 8.6.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'steun',
            vraag: 'Vul de drie gaten. Downloaden gaat via de knop ..., dan ..., en je kiest daarna ... of PDF.',
            antwoord: 'Op de eerste plek hoort Delen. Op de tweede plek hoort Downloaden. Op de derde plek hoort PNG.',
            uitleg: 'Delen staat rechtsboven en is de ingang voor alles wat je ontwerp verlaat. Downloaden én een link delen zitten allebei daar.',
            leerdoel: DOEL.delen
          },
          {
            groep: 'plus',
            vraag: 'Plusspoor na de deeltoets. Zeven of meer van de negen goed? Leg uit waarom 8.1, 8.2 en 8.3 in deze volgorde staan.',
            antwoord: 'Eerst bedenk je de stappen in gewone taal. Dan bouw je ze in blokken. Pas daarna kun je testen of ze doen wat je bedoelde.',
            uitleg: 'Zonder stappenplan weet je niet wat je moet bouwen. Zonder werkend programma weet je niet wat je moet testen. Bij ontwerpen gaat het net zo: eerst bedenken, dan maken, dan controleren.',
            leerdoel: DOEL.navertellen
          },
          {
            groep: 'plus',
            vraag: 'Je gebruikte vijf betaalde elementen en de les is bijna om. Welke uitweg kies je, en wat kost dat je?',
            antwoord: 'Een link delen gaat het snelst. Het nadeel is dat je docent online moet kijken en jij geen bestand hebt.',
            uitleg: 'Vervangen kost tijd maar levert een echt bestand op. Een uitgesneden screenshot verliest kwaliteit. Een link is snel maar hangt aan je Canva-account.',
            leerdoel: DOEL.delen
          }
        ]
      }),

    p('8.5', 'Eindopdracht: poster met Canva en AI', ['22A', '21D', '23C'], 'staande A4-poster over een eigen onderwerp, met AI-informatie in eigen woorden', 100, 'Posterlab',
      ['Van chatbotantwoord naar bruikbare postertekst',
        'In deze eindopdracht laat je twee dingen tegelijk zien. ' +
        'Je laat zien wat je van AI weet en hoe je een poster maakt in Canva. ' +
        'Je gebruikt een chatbot, bijvoorbeeld TalkAI, om informatie te verzamelen. ' +
        'Een chatbot is een programma waarmee je typend een gesprek voert. ' +
        'Je docent kijkt straks naar vier dingen.' +
        '</p><ul>' +
        '<li>Je laat zien dat je met een chatbot iets over je onderwerp te weten komt.</li>' +
        '<li>Je geeft die chatbot een goede prompt en niet zomaar een los woord.</li>' +
        '<li>Je maakt van het antwoord bruikbare tekst voor op je poster.</li>' +
        '<li>Je maakt in Canva een poster die er goed uitziet en zijn boodschap overbrengt.</li>' +
        '</ul><p>' +
        'Een goede prompt zegt wat de chatbot moet doen en waarover het gaat. ' +
        'Zet er ook bij voor wie het is en hoe lang het antwoord mag zijn. ' +
        'Een voorbeeld is: "Geef vijf korte tips over veilig internetten voor twaalfjarigen." ' +
        'Wat de chatbot terugstuurt neem je daarna nooit zomaar letterlijk over. ' +
        'Je controleert het, kort het in en schrijft het in je eigen woorden. ' +
        'Anders staat er straks tekst op je poster die je zelf niet kunt uitleggen.' +
        '</p><p><strong>Doe dit even:</strong> schrijf één prompt op en streep de vier onderdelen erin aan.</p><p>' +
        'Je kiest je onderwerp uit een vaste lijst van negen onderwerpen. ' +
        'Die hele lijst staat in de praktijkopdracht verderop in deze paragraaf.'],
      ['Zo maak je een poster die werkt',
        'Een poster wordt door een voorbijganger in een paar seconden bekeken. ' +
        'Iemand loopt langs jouw poster en kiest zelf of hij blijft staan. ' +
        'Daarom werkt alles wat je poster druk maakt uiteindelijk tegen je. ' +
        'Aan een goede poster zie je daarom deze vijf dingen terug.' +
        '</p><ul>' +
        '<li>Hij is leesbaar: de teksten vallen niet weg in foto\'s of in de achtergrond.</li>' +
        '<li>Hij is niet te druk: er staan niet te veel plaatjes en losse tekstjes op.</li>' +
        '<li>Hij is aantrekkelijk: een mooie kleur, een duidelijke titel en een pakkend plaatje.</li>' +
        '<li>Hij laat meteen zien waar hij over gaat en zet aan tot actie. Voorbeelden van actie zijn een ticket kopen, naar een website gaan, een enquête invullen of iets verkopen.</li>' +
        '<li>Hij gebruikt geen plaatjes of teksten van iemand anders zonder toestemming. Alles wat in Canva zelf zit mag je wel gebruiken.</li>' +
        '</ul><p>' +
        'Vijf tips helpen je daarbij, en die staan ook in de opdracht. ' +
        'Gebruik grote letters voor je titel, zodat hij van een meter afstand leesbaar is. ' +
        'Houd je tekst kort, want niemand blijft lang voor een poster staan lezen. ' +
        'Gebruik hooguit twee of drie kleuren die goed bij elkaar passen. ' +
        'Laat genoeg witruimte over en kies iconen die echt bij je onderwerp horen.' +
        '</p><p><strong>Doe dit even:</strong> bekijk de poster van een klasgenoot en noem één tip die hij toepast.</p><p>' +
        'In de praktijkopdracht hieronder staan bovendien zes harde voorwaarden. ' +
        'Voldoet je poster daar niet aan, dan krijg je er geen punten voor.'],
      [
        media('https://www.youtube.com/embed/qYys36TLtuA', '3 tips om je eigen poster te ontwerpen', 'Welke van de vijf posterkenmerken uit deze paragraaf zie je in de video terug? Noem er één die er juist niet bij staat.'),
        media('https://talkai.info/', 'TalkAI: de chatbot uit de eindopdracht', 'Schrijf de prompt op waarmee jij begint. Beoordeel daarna in één zin of het antwoord bruikbaar is voor je poster.')
      ],
      [
        {
          vraag: 'Je schreef in hoofdstuk 7 al een prompt voor een chatbot. Welke vier onderdelen horen daarin thuis?',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte die je terug wilt krijgen.',
          uitleg: 'Hoe scherper die vier zijn, hoe bruikbaarder het antwoord. Eén los woord levert je een algemeen verhaal op.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Waarom mag je een tekst van internet niet letterlijk overnemen in je eigen werk?',
          antwoord: 'De tekst is niet van jou. En meestal kun je hem ook niet uitleggen als iemand ernaar vraagt.',
          uitleg: 'Dit kwam in 1.4 al langs, bij bronnen. Overnemen mag alleen als je de bron noemt, en op een poster schrijf je liever zelf.',
          leerdoel: DOEL.eigenWoorden
        },
        {
          vraag: 'Noem een poster of reclame die jou is bijgebleven. Waardoor bleef jij ernaar kijken?',
          antwoord: 'Bijvoorbeeld: de titel was groot, er stond weinig tekst op, de kleuren waren rustig en één plaatje sprong eruit.',
          uitleg: 'Wat jou opviel staat straks in de vijf kenmerken van een goede poster: leesbaar, rustig en aantrekkelijk.',
          leerdoel: DOEL.ontwerp
        }
      ],
      {
        tekst: 'Aan de slag met de eindopdracht. Werk deze acht stappen op volgorde af en vink ze af terwijl je bezig bent.</p><ol>' +
          '<li>Open Canva en log in met de gegevens die je vorige les hebt aangemaakt.</li>' +
          '<li>Klik op de plus, typ poster in en kies daarna een staande poster.</li>' +
          '<li>Kies een onderwerp uit deze negen: cyberpesten; online shoppen op Temu, Shein of AliExpress en de gevaren; achteraf betalen en de risico\'s daarvan; de voordelen of nadelen van AI en chatbots; veilig internetten; privacy online; digitaal gezond blijven; nepnieuws herkennen; de invloed van social media op jongeren.</li>' +
          '<li>Verzamel met een chatbot informatie over dat onderwerp. Bewaar je prompt en het antwoord, want die lever je mee in.</li>' +
          '<li>Schrijf de informatie om naar je eigen woorden. Kort hem in tot korte, bondige zinnen.</li>' +
          '<li>Zorg dat je poster aan alle zes de voorwaarden hieronder voldoet. Voldoe je hier niet aan, dan krijg je geen punten voor je poster.' +
          '<ul><li>Hij heeft een duidelijke titel.</li>' +
          '<li>Hij bevat minstens één afbeelding of symbool.</li>' +
          '<li>Hij bevat minstens twee tekstvakken met uitleg of tips, in korte en bondige zinnen.</li>' +
          '<li>Hij gaat over één onderwerp uit de lijst.</li>' +
          '<li>Hij bevat informatie die je met AI hebt verzameld en naar je eigen woorden hebt aangepast.</li>' +
          '<li>Hij is een staande poster.</li></ul></li>' +
          '<li>Loop deze vijf tips na: grote letters voor de titel, korte en krachtige tekst, maximaal twee of drie kleuren die bij elkaar passen, genoeg witruimte, en iconen of afbeeldingen die bij je onderwerp passen.</li>' +
          '<li>Download je project als PNG of PDF en lever het in bij de docent. Lukt dat niet door betaalde elementen? Vervang ze, maak een uitgesneden screenshot of deel een link.</li>' +
          '</ol><p>Lever samen met je poster een half A4 in. Daarop staan je prompt, het antwoord van de chatbot, en jouw herschreven tekst. Zo ziet je docent wat je zelf gedaan hebt.',
        label: 'Lever je staande poster en je half A4 in. Schrijf hier welke zin je het sterkst herschreven hebt.',
        modelAnswer: 'Een voldoende inzending is een staande poster met bijvoorbeeld de titel "Stop met scrollen, start met slapen". Er staat een icoon van een telefoon op. Verder staan er twee tekstvakken met elk drie korte tips over digitaal gezond blijven. Op het half A4 staat de prompt erbij: "Geef vijf korte tips om digitaal gezond te blijven voor leerlingen van twaalf jaar, elke tip maximaal vijftien woorden." Daaronder staat het antwoord van de chatbot en daaronder de eigen versie. De chatbot schreef bijvoorbeeld "Het wordt aanbevolen mobiele apparaten voorafgaand aan de nachtrust te vermijden". De leerling maakte daarvan: "Leg je telefoon een uur voor het slapen weg."',
        nakijkpunten: [
          'De prompt bevat opdracht, onderwerp, doelgroep en lengte, en het antwoord is meegeleverd.',
          'De postertekst is duidelijk herschreven en de leerling kan hem uitleggen.',
          'De poster haalt alle zes de voorwaarden die in de opdracht staan.',
          'De poster volgt minstens vier van de vijf tips voor een rustige poster.'
        ]
      },
      ['Wat haal je in deze opdracht bij de chatbot?', 'Waarom schrijf je het antwoord in je eigen woorden over?', 'Wanneer is een poster leesbaar?', 'Waarom laat je witruimte over?', 'Hoeveel voorwaarden moet je poster halen?', 'Terugblik 8.4: met welk mailadres maak je je Canva-account?'],
      'Beoordeel posters van anderen op leesbaarheid, drukte en actie. Repareer de zwakste in drie zetten.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Vergelijk twee prompts: "cyberpesten" en "Geef vier tips tegen cyberpesten voor brugklassers, elk hooguit twintig woorden". Welke werkt beter?',
            antwoord: 'De tweede. Die noemt de opdracht, het onderwerp, de doelgroep en de lengte van het antwoord.',
            uitleg: 'Bij de eerste prompt moet de chatbot alles zelf gokken, dus krijg je een algemeen verhaal. De tweede geeft meteen tekst die op een poster past.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'samen',
            vraag: 'Schrijf samen één prompt voor het onderwerp nepnieuws herkennen. Controleer daarna of alle vier de onderdelen erin staan.',
            antwoord: 'Bijvoorbeeld: "Geef drie tips om nepnieuws te herkennen voor leerlingen van twaalf jaar, elke tip maximaal vijftien woorden."',
            uitleg: 'Loop de vier onderdelen af: opdracht is "geef drie tips", onderwerp is nepnieuws, doelgroep zijn twaalfjarigen, lengte is vijftien woorden.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'zelf',
            vraag: 'De chatbot schrijft: "Het is raadzaam om terughoudend te zijn met het delen van persoonsgegevens." Maak daar een posterzin van.',
            antwoord: 'Bijvoorbeeld deze zin: "Zet je adres en je telefoonnummer nooit online."',
            uitleg: 'Je maakt hem korter, je gebruikt gewone woorden en je noemt iets concreets. Zo\'n zin kun je zelf uitleggen als je docent ernaar vraagt.',
            leerdoel: DOEL.eigenWoorden
          },
          {
            groep: 'zelf',
            vraag: 'Op een poster staan acht plaatjes, zes kleuren en een titel van veertien woorden. Wat verander je? Noem er drie.',
            antwoord: 'Terug naar één of twee plaatjes. Terug naar hooguit drie kleuren. En de titel inkorten tot een paar woorden.',
            uitleg: 'Alle drie de wijzigingen zorgen voor hetzelfde: rust op je poster. Een kijker is in seconden weer weg, dus alles wat afleidt kost je lezers.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'steun',
            vraag: 'Vul de twee gaten. Een goede poster leest makkelijk, is niet te ..., en houdt genoeg ... over.',
            antwoord: 'Op de eerste plek hoort druk. Op de tweede plek hoort witruimte.',
            uitleg: 'Deze drie woorden vatten de vijf kenmerken samen. Leesbaar gaat over je letters, druk over de hoeveelheid, witruimte over de rust ertussen.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat er niet bij hoort. Voorbeelden van actie zijn: een ticket kopen / naar een website gaan / de poster mooi vinden.',
            antwoord: '"De poster mooi vinden" hoort er niet bij. Dat is namelijk geen actie die de kijker uitvoert.',
            uitleg: 'Een actie is iets wat de kijker daarna gaat doen. Kopen, klikken, invullen of iets verkopen zijn wel acties.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'plus',
            vraag: 'AI-informatie mag wel op je poster, plaatjes van een ander niet. Waarom is dat geen tegenspraak?',
            antwoord: 'Je herschrijft de AI-informatie zelf. En de plaatjes komen uit Canva, waar de toestemming al geregeld is.',
            uitleg: 'De vraag is steeds: wie heeft het gemaakt en mag jij het gebruiken? Een herschreven zin is jouw werk, en Canva levert zijn elementen mét licentie.',
            leerdoel: DOEL.eigenWoorden
          }
        ]
      }),

    checkpoint('8.6', 'Checkpoint: terugblik en jouw digitale creatie', ['22A', '23C', '21D'], 'eigen eindcreatie in Canva, Word of PowerPoint, met je terugblik erbij', 150, 'Terugblik Challenge',
      ['Terugblikken op een heel leerjaar',
        'Je bent aan het einde gekomen van de lessen over digitale geletterdheid. ' +
        'Dat is een prestatie, en die sluit je in deze paragraaf af. ' +
        'Deze afsluiting is een stuk groter dan een gewone paragraaf. ' +
        'Je docent verdeelt hem daarom over ongeveer drie hele lesuren. ' +
        'Voordat je iets maakt, kijk je eerst terug op dit hele leerjaar. ' +
        'Terugblikken betekent: benoemen wat je nu weet en wat je nu anders doet.' +
        '</p><p>' +
        'Dat is geen tijdverlies, want alleen zo wordt je kennis pas echt van jou. ' +
        'Beantwoord daarom eerst deze vier terugblikvragen op je eigen manier. ' +
        'Je schrijft die antwoorden in het tekstvak van de praktijkopdracht verderop.' +
        '</p><ol>' +
        '<li>Wat is je het meest bijgebleven van de lessen over digitale geletterdheid?</li>' +
        '<li>Wat heb je geleerd dat je nog niet wist, en waarmee je nu blij bent?</li>' +
        '<li>Van welk onderwerp zou je meer willen weten? Waar werd te weinig over gesproken?</li>' +
        '<li>Heb je genoeg tips gekregen om jezelf veilig te houden op internet? Waarom wel of niet?</li>' +
        '</ol><p>' +
        'Daarna ga je je antwoorden vergelijken met je buurman, buurvrouw of een klasgenoot. ' +
        'Noteer welk antwoord van de ander jou het meest verbaasde, en zet er zijn of haar naam bij. ' +
        'Vraag je daarbij af wat jouw buurman al wist wat voor jou juist nieuw was.' +
        '</p><p><strong>Doe dit even:</strong> schrijf nu alvast in drie woorden op wat je het meest is bijgebleven.</p><p>' +
        'Neem voor deze vier vragen echt de tijd, want je docent leest je antwoorden na. ' +
        'Terugkijken is geen bijzaak, maar het onderdeel dat de rest van dit jaar vastzet.'],
      ['Jouw digitale creatie: drie opties',
        'Na het terugblikken ga je zelf een eindcreatie maken. ' +
        'Voor die eindcreatie krijg je in de les vijfentwintig minuten de tijd. ' +
        'Je kiest één van drie opties, en die tellen alle drie even zwaar.' +
        '</p><ul>' +
        '<li>Optie A: een poster in Canva over een onderwerp dat jij interessant vond. Denk aan veilig internet, AI of nepnieuws.</li>' +
        '<li>Optie B: een verslag in Word van één A4. Daarin kijk je terug op deze lessen.</li>' +
        '<li>Optie C: een PowerPoint van drie dia\'s over jouw favoriete onderwerp uit dit jaar.</li>' +
        '</ul><p>' +
        'Bij optie B gebruik je de opmaak uit hoofdstuk 4: koppen, vet en paginanummering. ' +
        'Wil je bij optie C je presentatie echt voor de klas geven? Dat mag gewoon van je docent. ' +
        'Welke eisen bij welke optie horen, dat staat in de praktijkopdracht hieronder. ' +
        'Daarna volgt het inleveren, en daar staat nog eens vijf minuten voor.' +
        '</p><p><strong>Doe dit even:</strong> kies nu vast je optie en schrijf op waarom die bij jou past.</p><p>' +
        'Tot slot nog één ding, en dat gaat over dit lesmateriaal zelf. ' +
        'Het is van DaCapo College, gemaakt door Jennifer Leijen, Sander Theunissen, Gerdien Dohmen en Mirko Ensinck. ' +
        'Het is gedeeld onder de licentie CC BY 4.0, te vinden op creativecommons.org/licenses/by/4.0/. ' +
        'De laatste wijziging aan die versie dateert van 28 oktober 2025, om 19.14 uur.' +
        '</p><p>' +
        'Die licentie zegt: kopiëren, verspreiden en bewerken mag, als je de maker noemt. ' +
        'Zet daarom een bronvermelding onder je eindcreatie, precies zoals je in 1.4 leerde.'],
      media('https://www.youtube.com/embed/pdVvcAav_Jk', 'Basicly: wat is digitale geletterdheid?', 'De video knipt digitale geletterdheid in een paar onderdelen. Zoek bij elk onderdeel een hoofdstuk uit dit jaar en noem het onderdeel waar jij het minst over weet.'),
      [
        {
          vraag: 'Diagnostische ronde. Maak eerst de zeventien Diagnose-vragen hieronder, zonder terug te lezen. Hoeveel had je er goed?',
          antwoord: 'Reken een vraag pas goed als jouw antwoord alles bevat wat in het opengeklapte antwoord staat. Bij elke vraag staat in de uitleg wat je terugpakt als hij misging. Werk dat eerst weg en maak daarna pas de eindtoets. Tien of minder goed? Ga na de theorie naar het herstelspoor bij Extra steun en werk alle zes de paragrafen na. Elf tot en met veertien goed? Ga ook naar het herstelspoor, maar alleen voor de doelen die je miste. Vijftien of meer goed? Kies dan het verdiepingsspoor bij Extra plus.',
          uitleg: 'Deze ronde staat bewust vóór de herhaling. Zo weet je wat je moet herhalen in plaats van alles opnieuw te lezen. Er hangt geen cijfer en geen token aan: het is een zeef en geen prestatie. Elk leerdoel krijgt een eigen vraag, want een steekproef laat juist de doelen liggen die je nog niet kent.'
        },
        {
          vraag: 'Diagnose 1. Wat is een algoritme, en waarom weegt de volgorde van de stappen net zo zwaar?',
          antwoord: 'Een algoritme is een stappenplan. Dezelfde handelingen in een andere volgorde geven een ander resultaat, zoals bij smeren en beleggen.',
          uitleg: 'Gemist? Lees theorieblok A van 8.1 terug en speel daarna het gameblok Stappen Sorteren van die paragraaf.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Diagnose 2. Goed of fout? Bij het opschrijven van een dagelijkse handeling vergeet je vooral de hoofdhandeling.',
          antwoord: 'Fout. Juist de kleine dingen blijven liggen: je spullen pakken vooraf, en achteraf controleren of het lukte.',
          uitleg: 'Gemist? Pak je eigen stappenplan uit de praktijkopdracht van 8.1 erbij en kijk waar je tester vastliep.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Diagnose 3. Schrijf in gewone taal één herhaling op, en daarna één keuze met een voorwaarde.',
          antwoord: 'Bijvoorbeeld: herhaal twintig keer, doe een stap. En: als het regent, dan pak je een jas, anders een pet.',
          uitleg: 'Gemist? Lees theorieblok B van 8.1 terug. Let vooral op de voorwaarde: dat is het stuk dat waar of niet waar kan zijn.',
          leerdoel: DOEL.herhaalKeuze
        },
        {
          vraag: 'Diagnose 4. Goed of fout? Met blokken kun je geen tikfout maken, dus is je programma altijd goed.',
          antwoord: 'Fout. De tikfout is weg, maar de volgorde van je blokken kan nog steeds verkeerd zijn.',
          uitleg: 'Gemist? Lees theorieblok A van 8.2 terug en kijk daarna naar het screenshot van je eigen script.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'Diagnose 5. Welke voorwaarde stopte jij in je als-dan-blok, en wat gebeurde er als die niet waar was?',
          antwoord: 'Bijvoorbeeld "raak ik (rand)?" uit de categorie Waarnemen. Was die niet waar, dan sloeg het programma dat binnenste blok die ronde over.',
          uitleg: 'Gemist? Lees theorieblok B van 8.2 terug en kijk de video "Als...dan" bij die paragraaf nog een keer.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Diagnose 6. Beschrijf je eigen programma in drie zinnen, van het bovenste blok naar het onderste.',
          antwoord: 'Bijvoorbeeld: het start bij de groene vlag. De herhaling laat de kat lopen en aan de rand omkeren. Het als-dan-blok voegt daar het roepen aan toe.',
          uitleg: 'Gemist? Pak je uitlegtekst uit de opdracht van 8.2 erbij. Leg hem naast je script en kijk of de volgorde klopt.',
          leerdoel: DOEL.navertellen
        },
        {
          vraag: 'Diagnose 7. Hoe test je zo, dat je ook een fout vindt die je zelf niet had verwacht?',
          antwoord: 'Schrijf vooraf op wat er zou moeten gebeuren. Probeer daarna ook de wegen die je niet bedacht had.',
          uitleg: 'Gemist? Lees theorieblok A van 8.3 terug en pak je testplan uit het testverslag er nog eens bij.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Diagnose 8. Goed of fout? Een foutmelding is een straf, want hij zegt dat je programma stuk is.',
          antwoord: 'Fout. Een melding wijst je juist naar het blok waar het misging, en dat scheelt je zoekwerk.',
          uitleg: 'Gemist? Lees theorieblok B van 8.3 terug en speel daarna het gameblok Bugjacht van die paragraaf.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Diagnose 9. Je klasgenoot geeft vier tips. Hoe verwerk je die zonder de draad kwijt te raken?',
          antwoord: 'Eén tip tegelijk doorvoeren en daartussen testen. Dan weet je per verandering wat die deed.',
          uitleg: 'Gemist? Pak de twee slotregels van je testverslag uit 8.3 erbij. Daar staat wat je overnam en wat niet.',
          leerdoel: DOEL.feedback
        },
        {
          vraag: 'Diagnose 10. Welk mailadres gebruik je voor je Canva-account, en wat doe je meteen na het registreren?',
          antwoord: 'Je gebruikt je schoolmail. Daarna bevestig je met de link of de code uit je mail, en pas dan log je in.',
          uitleg: 'Gemist? Lees theorieblok A van 8.4 terug en loop de zeven aanmeldstappen uit de praktijkopdracht nog eens na.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Diagnose 11. Hoe ga je van de homepagina naar een lege staande poster met een leesbare titel?',
          antwoord: 'Klik op de plus, typ poster, kies "poster staand, A3". Zet er tekst op en kies een achtergrondkleur die genoeg verschilt.',
          uitleg: 'Gemist? Lees theorieblok B van 8.4 terug. Let erop dat Canva dit formaat A3 noemt terwijl de opdracht A4-poster zegt.',
          leerdoel: DOEL.starten
        },
        {
          vraag: 'Diagnose 12. Goed of fout? Je downloadt je Canva-ontwerp via de knop Bewaren, als JPG of Word-bestand.',
          antwoord: 'Fout. Het gaat via Delen en daarna Downloaden, en je kiest PNG of PDF. Bewaren bestaat niet: Canva slaat vanzelf op.',
          uitleg: 'Gemist? Pak het slot van theorieblok B van 8.4 er nog eens bij, met de drie uitwegen bij betaalde elementen.',
          leerdoel: DOEL.delen
        },
        {
          vraag: 'Diagnose 13. Noem de vier onderdelen die in een bruikbare prompt voor je poster horen.',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte die je terug wilt krijgen.',
          uitleg: 'Gemist? Lees theorieblok A van 8.5 terug. Pak er de prompt bij van het half A4 dat bij je poster zat.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Diagnose 14. Goed of fout? Chatbottekst mag letterlijk op je poster, want een chatbot is geen mens.',
          antwoord: 'Fout. Je schrijft hem om, want anders is de tekst niet van jou en kun je hem niet uitleggen.',
          uitleg: 'Gemist? Lees theorieblok A van 8.5 terug. Leg je eigen herschreven zin naast het antwoord van de chatbot.',
          leerdoel: DOEL.eigenWoorden
        },
        {
          vraag: 'Diagnose 15. Noem drie van de vijf dingen die je aan een goede poster ziet.',
          antwoord: 'Bijvoorbeeld: je leest hem makkelijk, er staat niet te veel op, en hij zet de kijker aan tot een actie.',
          uitleg: 'Gemist? Lees theorieblok B van 8.5 terug. Loop daarna de vijf tips na op je eigen ingeleverde poster.',
          leerdoel: DOEL.ontwerp
        },
        {
          vraag: 'Diagnose 16. Noem twee dingen uit hoofdstuk 1 tot en met 7 die jij nu anders doet op internet dan vorig jaar.',
          antwoord: 'Bijvoorbeeld: je gebruikt nu langere wachtwoorden. En je controleert eerst de URL, want een slotje is geen bewijs.',
          uitleg: 'Gemist? Lees hieronder theorieblok A van deze paragraaf en beantwoord de vier terugblikvragen in het tekstvak van de praktijkopdracht. Gedrag is het beste bewijs van leren: wat je alleen weet maar nooit doet, is vaak toch niet geland.',
          leerdoel: DOEL.terugblik
        },
        {
          vraag: 'Diagnose 17. Welke drie programma\'s uit dit jaar passen bij je eindcreatie, en waarin is elk sterk?',
          antwoord: 'Canva voor een poster, Word voor een verslag en PowerPoint voor een presentatie. Een poster brengt één boodschap, een verslag legt uit, een presentatie toont stappen.',
          uitleg: 'Gemist? Lees hieronder theorieblok B van deze paragraaf, waar de drie opties staan. Kijk daarna terug naar hoofdstuk 4 voor Word en PowerPoint en naar 8.4 voor Canva.',
          leerdoel: DOEL.creatie
        }
      ],
      {
        tekst: 'Maak je eindcreatie en lever hem in samen met je terugblik. De opdracht heeft drie delen.</p>' +
          '<p><strong>Deel 1, de terugblik.</strong></p><ol>' +
          '<li>Beantwoord in een tekstvak of Word-bestand de vier terugblikvragen uit de theorie.</li>' +
          '<li>Vergelijk je antwoorden daarna met die van een klasgenoot.</li>' +
          '<li>Schrijf in twee zinnen op welke verschillen je opvielen.</li>' +
          '</ol><p><strong>Deel 2, de creatie.</strong> Je hebt vijfentwintig minuten en kiest optie A, B of C.</p><ol>' +
          '<li><strong>Optie A</strong> is een Canva-poster over een onderwerp dat jij interessant vond, bijvoorbeeld veilig internet, AI of nepnieuws. Gebruik minstens drie afbeeldingen, voeg een tekstkader met uitleg toe en bedenk een pakkende titel.</li>' +
          '<li><strong>Optie B</strong> is een Word-verslag van één A4 waarin je terugblikt. Beschrijf wat je geleerd hebt, wat je leuk vond en waar je meer over wilt leren. Voeg minstens één afbeelding toe en gebruik opmaak: koppen, vetgedrukte woorden en paginanummering.</li>' +
          '<li><strong>Optie C</strong> is een PowerPoint van drie dia\'s over jouw favoriete onderwerp. Geef elke dia een titel, voeg afbeeldingen toe en zet bij elke dia een korte uitleg. Wil je presenteren? Dat mag.</li>' +
          '</ol><p><strong>Deel 3, het inleveren.</strong> Daar staat vijf minuten voor.</p><ol>' +
          '<li>Lever je terugblik en je creatie samen in zoals je docent heeft uitgelegd.</li>' +
          '<li>Zet er onderaan de bron van het lesmateriaal bij.</li>' +
          '</ol><p>Vergeet die bronvermelding niet: DaCapo College, gedeeld onder CC BY 4.0.',
        label: 'Lever je terugblik en je eindcreatie in. Schrijf hier welke optie je koos en waarom.',
        modelAnswer: 'Een voldoende inzending bevat een terugblik met concrete antwoorden op alle vier de vragen. Bijvoorbeeld: "Het meest is me bijgebleven dat je een deepfake met gewone software maakt. Sindsdien vertrouw ik filmpjes niet meer blind. Mijn buurvrouw noemde phishing. Dat wist ik al, maar zij wist weer niet dat een slotje geen bewijs is." Daarnaast hoort er een creatie bij die alle eisen van de gekozen optie haalt. Bijvoorbeeld een PowerPoint van drie dia\'s over nepnieuws. Elke dia heeft dan een titel, een passende afbeelding en drie regels uitleg. Onderaan de laatste dia staat de bronvermelding van DaCapo College met de licentie CC BY 4.0.',
        nakijkpunten: [
          'Alle vier de terugblikvragen zijn concreet beantwoord.',
          'De vergelijking met een klasgenoot staat erbij, met een genoemd verschil.',
          'De creatie die gekozen is, haalt elke eis die bij die optie hoort.',
          'De bron van het lesmateriaal staat er onderaan bij.'
        ]
      },
      ['Wat is een algoritme?', 'Waar gebruik je een herhaling voor?', 'Wat schuif je in een als-dan-blok?', 'Wat is een bug?', 'Wat betekent debuggen?', 'Met welk mailadres maak je je Canva-account?', 'Hoe download je een Canva-ontwerp?', 'Wanneer is een poster leesbaar?', 'Waarom schrijf je AI-informatie in je eigen woorden over?', 'Uit welke drie opties kies je bij je eindcreatie?', 'Waarom noem je de bron onder je eindcreatie?'],
      'Loop in vijf kamers je hele jaar langs: een stappenplan, een bug, een ontwerp, een prompt en je eigen terugblik.',
      true,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Bij de terugblik zet een klasgenoot er alleen "ik heb veel geleerd" neer. Waarom telt dat niet mee?',
            antwoord: 'Het noemt niets concreets. Het telt pas als hij zegt wat hij leerde en waar hij dat merkt.',
            uitleg: 'Terugblikken is het verschil tussen toen en nu benoemen. Een zin als "ik kijk nu eerst wie de afzender is" laat dat zien, "ik heb veel geleerd" niet.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'samen',
            vraag: 'Bespreek samen: welk hoofdstuk van dit jaar vond je het nuttigst, en welke stap doe je nu echt anders?',
            antwoord: 'Bijvoorbeeld hoofdstuk 3, en de stap is: ik kijk nu eerst naar de URL en de afzender voor ik op een link klik.',
            uitleg: 'Noem altijd een hoofdstuk én een handeling. Zonder handeling blijft het een mening en laat je niet zien wat je geleerd hebt.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'zelf',
            vraag: 'Jij kiest optie B, het Word-verslag. Welke drie opmaakeisen gelden daar, en in welk hoofdstuk leerde je die?',
            antwoord: 'Koppen, vetgedrukte woorden en paginanummering. Die opmaak kwam in hoofdstuk 4 langs, bij Word.',
            uitleg: 'Deze eisen zijn geen versiering. Koppen geven structuur, vet legt nadruk, en paginanummers houden je verslag op volgorde.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'zelf',
            vraag: 'Je wilt laten zien dat je nepnieuws kunt herkennen. Welke optie past daar het best bij, en waarom?',
            antwoord: 'Bijvoorbeeld optie C. Op drie dia\'s kun je een voorbeeld, de kenmerken en de controle netjes uit elkaar halen.',
            uitleg: 'Kies de optie die past bij wat je wilt bewijzen. Een poster brengt één boodschap over, een verslag legt uit, een presentatie laat stappen zien.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Had je veertien of minder van de zeventien goed? Zet dan je gemiste vragen op een rij.',
            antwoord: 'Diagnose 1 tot en met 3 gaan over 8.1. De vragen 4, 5 en 6 over 8.2. De vragen 7, 8 en 9 over 8.3. De vragen 10, 11 en 12 over 8.4. De vragen 13, 14 en 15 over 8.5. De vragen 16 en 17 over deze paragraaf.',
            uitleg: 'Herhalen werkt alleen als het gericht is. Lees per gemiste vraag alleen het theorieblok dat in de uitleg genoemd wordt. Maak daarna de oefening uit die paragraaf opnieuw en controleer jezelf met de diagnosevraag. Had je tien of minder goed, loop dan alle zes de paragrafen langs.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'steun',
            vraag: 'Vul de twee gaten. Je vergelijkt eerst je antwoorden met een klasgenoot, dan maak je een ..., en dan komt het ...',
            antwoord: 'Op de eerste plek hoort eindcreatie. Op de tweede plek hoort inleveren.',
            uitleg: 'Dit zijn de drie delen van deze les op volgorde. Eerst terugblikken en vergelijken, dan maken, dan inleveren zoals je docent uitlegt.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'plus',
            vraag: 'Verdiepingsspoor. Had je vijftien of meer goed? Leg uit wat programmeren uit 8.1 tot 8.3 en ontwerpen uit 8.4 en 8.5 gemeen hebben.',
            antwoord: 'Bij allebei bedenk je eerst wat er moet gebeuren. Daarna maak je het. En daarna test je of het bij een ander overkomt zoals jij bedoelde.',
            uitleg: 'Een programma test je door het uit te voeren. Een poster test je door hem te laten zien aan iemand die je onderwerp niet kent. In beide gevallen is de maker de slechtste beoordelaar, want hij kent zijn eigen bedoeling al.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'plus',
            vraag: 'Waarom noem je onder je eindcreatie de bron van het lesmateriaal, ook als je alles zelf schreef?',
            antwoord: 'Het materiaal is gedeeld onder CC BY 4.0. Die licentie vraagt dat je de maker noemt.',
            uitleg: 'CC BY laat je kopiëren, verspreiden en bewerken, op één voorwaarde: je noemt de maker erbij. Diezelfde regel gold al voor bronnen in 1.4.',
            leerdoel: DOEL.terugblik
          }
        ]
      })
  ]
};
