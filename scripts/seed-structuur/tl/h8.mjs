// Hoofdstuk 8 - Zelf maken: programmeren, ontwerpen en terugblikken (tl).
//
// BRON (leidend)
// --------------
// Het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College
// (auteurs Jennifer Leijen, Sander Theunissen, Gerdien Dohmen en Mirko Ensinck,
// CC BY 4.0).
//   8.4  <- les 18 "Introductie Canva"
//   8.5  <- les 19 "Eindopdracht Canva en AI"
//   8.6  <- les 20 "Afsluiting en terugblik Digitale Vaardigheden" (checkpoint,
//           tevens eindtoets van het leerjaar: final = true)
// Voor de theoretische leerweg zijn die drie lessen zo letterlijk mogelijk
// overgenomen: elke alinea, elke stap, elke voorwaarde, elke link en elke
// verwijzing naar beeld staat erin. Waar een lijstje uit de bron een
// handelingsvolgorde is (de zeven aanmeldstappen, de negen posterstappen, de
// negen onderwerpen, de zes voorwaarden, de vijf postertips, de eisen bij
// optie A, B en C), staat dat lijstje in de PRAKTIJKOPDRACHT en niet in de
// theorie: daar voert de leerling het uit en daar kan hij het afvinken. De
// theorie legt uit waarom en blijft daardoor binnen de 150 tot 250 woorden die
// de blauwdruk vraagt (gemeten: kortste 155, langste 246).
//
// TOEGEVOEGDE PARAGRAFEN (docentmetadata, staat bewust NIET in de leerlingtekst)
// -----------------------------------------------------------------------------
//   8.1, 8.2, 8.3  vullen kerndoel 22B (computationeel denken), dat in de
//           lessenserie zelf ontbreekt. In eigen woorden geschreven op basis
//           van: de SLO-leerlijn digitale geletterdheid voor het vmbo
//           (slo.nl, leermaterialen computational thinking), de aflevering
//           "Wat is een algoritme?" van het NPO-programma Huh?! (YouTube), de
//           Nederlandstalige Scratch-uitleg "Als...dan | Blokkenseries Scratch"
//           (YouTube) en het lemma "Bug (technologie)" op nl.wikipedia.org.
//   8.7  <- toegevoegde vrijwillige plusparagraaf, alleen voor de theoretische
//           leerweg. Bron: nl.wikibooks.org (Programmeren in Python, variabelen
//           en gegevens) en de overzichtspagina "Van Scratch naar Python" op
//           roc.ovh. Die pagina staat sinds ronde 6 als leestip in de
//           praktijkopdracht en niet meer als mediablok; zie MEDIA hieronder.
// Die bronnamen horen bij de docent en bij sourceBasis, niet in de zin die een
// brugklasser leest.
//
// WAT ER IN DEZE RONDE IS HERSTELD (twee blokkerende bevindingen)
// ---------------------------------------------------------------
// (1) DE ETYMOLOGIE VAN "BUG" WAS FOUT. Theorieblok A van 8.3 zei "Het woord
//     stamt uit 1947, toen er letterlijk een mot tussen de contacten van een
//     computer bleek te zitten." Dat is de schoolmythe en niet het feit, en de
//     bron die hierboven onder TOEGEVOEGDE PARAGRAFEN voor 8.3 staat (het
//     lemma "Bug (technologie)" op nl.wikipedia.org) zegt met zoveel woorden
//     het tegendeel: Edison schrijft er in 1878 al over ("Bugs - as such little
//     faults and difficulties are called") en Webster dateert de betekenis op
//     1622. De logregel bij de mot van 1947 luidt zelf "First actual case of
//     bug being found", een zin die alleen klopt als het woord toen al liep.
//     De tekst zegt nu: het woord bestond in de techniek al lang, Edison
//     schreef er in 1878 over, en beroemd werd het pas in 1947 door de mot.
//     De startvraag van 8.3 formuleerde het al goed en is niet aangeraakt.
// (2) EEN DODE VERWIJZING IN 8.6. Theorieblok A stuurde de leerling met
//     "Beantwoord daarom in het tekstvak deze vier vragen" naar een invoerveld
//     dat in een theory-blok niet bestaat; het echte tekstvak zit zeven blokken
//     verderop in de praktijkopdracht, onder Deel 1. De zin komt uit de bron,
//     waar Wikiwijs op die plek wel een tekstvak had. Nu staat er "in het
//     tekstvak van de praktijkopdracht verderop in deze paragraaf". Diagnose 16
//     herhaalde dezelfde misleiding in zijn uitleg en wijst nu ook door.
//
// KLEINERE REPARATIES IN DEZELFDE RONDE
// -------------------------------------
// - 8.5 theorieblok B noemde drie van de vier actievoorbeelden uit les 19;
//   "iets verkopen" is toegevoegd, zodat die opsomming compleet is.
// - De planningsafspraak voor 8.6 (PLAN 8.6 OVER DRIE LESUREN, onderaan deze
//   kop) stond alleen in dit commentaar en was dus onzichtbaar voor wie de app
//   gebruikt. Theorieblok A van 8.6 zegt het nu ook in de leerlingtekst.
// - Twee nakijkpunten waren docentzinnen in een leerlingveld: "De leerling
//   benoemt een concrete fout uit de test..." (8.1) en "De leerling zegt van de
//   feedback wat hij overnam..." (8.3). Allebei staan ze nu in de je-vorm; de
//   nakijkpunten komen immers als succescriteria bij de leerling in beeld.
// - De twee grote startchecks (de deeltoets in 8.4, de diagnostische ronde in
//   8.6) openden met een routeringsinstructie in het veld `vraag`. De generator
//   geeft dat veld een genummerd antwoordveld, dus de leerling werd gevraagd
//   een instructie te beantwoorden. Beide zijn nu een echte vraag ("Hoeveel van
//   die negen had je goed, en welke gingen er mis?"), met de routering naar het
//   steun- of plusspoor in het antwoordveld. Daar staat nu ook hoe je nakijkt:
//   een vraag telt pas goed als je antwoord alle onderdelen van het
//   opengeklapte antwoord bevat. Zonder die regel was de drempel van 7-uit-9
//   respectievelijk 10-uit-17 bij open vragen een gevoel en geen meting.
//
// DE HOOFDSTUKLAAG VAN DE BLAUWDRUK, EN WAAR HIJ NU ECHT STAAT (RONDE 6)
// ---------------------------------------------------------------------
// Ronde 5 zette de drie hoofdstukonderdelen wel in het bestand, maar alle drie
// als losse opgaven in `oefenen`. De generator gooide ze daarmee op een hoop
// met de gewone oefenopgaven in het blok "Zelf oefenen (Digidocent uit)": 8.3
// kwam op elf opgaven in dat ene blok en 8.6 op negentien. De criticus wees
// daar terecht op: een deeltoets en een diagnostische ronde die geen eigen blok
// zijn, geen eigen kop hebben en niets routeren, zijn geen mechanisme maar
// tekst. Ronde 6 verhuist ze naar het blok waar de blauwdruk ze zelf plaatst.
//
// A. VOORKENNISCHECK OVER HOOFDSTUK 7 (blauwdruk, rij Voorkennis: "Startcheck
//    over het vorige hoofdstuk: 4-6 vragen", merk Bewijs). Vier terugblikvragen
//    staan bovenaan de `checks` van 8.1, en de kern ervan staat als ophaalregels
//    aan het begin van theorieblok A van 8.1. Ze gaan over leren van data
//    tegenover zelf meedenken (7.1), de vier onderdelen van een prompt (7.3),
//    het controleren van een chatbotantwoord (7.4) en het niet delen van
//    persoonlijke gegevens (7.2). Het checkblok van 8.1 telt daardoor zeven
//    vragen: vier voorkennis plus drie eigen startvragen. De vier leerdoelen
//    staan letterlijk in de const VORIG hieronder, overgetypt uit h7.
// B. DEELTOETS OVER 8.1, 8.2 EN 8.3 (blauwdruk: "8-10 vragen over paragraaf 1
//    tot en met 3. Geen cijfer; uitkomst bepaalt wie steun en wie plus krijgt",
//    merk Ontwerpkeuze). Staat sinds ronde 6 in de `checks` van 8.4, dus in het
//    blok "Startcheck: wat weet je al?" van de eerste paragraaf NA het
//    programmeerdeel. Dat is precies de plaats die de blauwdruk hem geeft, en
//    het blok heeft de drie eigenschappen die de blauwdruk eist: geen cijfer en
//    geen tokens, Digidocent uit (settings.allowAiHelp = false), en de uitleg
//    pas na het eigen antwoord in een dichtgeklapte details. Het telt veertien
//    vragen: een routevraag, negen deeltoetsvragen (een per leerdoel van 8.1
//    tot en met 8.3) en de vier eigen startvragen van 8.4.
//    DE UITKOMST DOET NU IETS. De routevraag bovenaan zegt: zeven of meer goed
//    is doorgaan plus het plusspoor, zes of minder is eerst het steunspoor. Die
//    twee sporen staan verderop in dezelfde paragraaf als de EERSTE opgave van
//    het blok "Extra steun (Digidocent aan)" en van het blok "Extra plus
//    (Digidocent uit)", met de instapdrempel letterlijk in de vraagtekst. De
//    leerling leest dus meten, dan route, dan bestemming, in leesvolgorde en in
//    twee blokken die de generator zelf al scheidt. Bij elke deeltoetsvraag
//    staat in de uitleg welk theorieblok of welk eigen product je terugleest als
//    hij misging.
// C. DIAGNOSTISCHE RONDE (blauwdruk: "Alle leerdoelen, 1 vraag elk. Per gemist
//    doel opent gericht herhaalmateriaal", merk Bewijs, met erbij: "dit is
//    dezelfde werking als de startcheck, maar dan op hoofdstukniveau"). Die zin
//    is in ronde 6 letterlijk gevolgd: de ronde staat nu in de `checks` van
//    checkpoint 8.6 en is dus de startcheck van dat checkpoint. Achttien
//    vragen: een routevraag en zeventien diagnosevragen, een per verplicht
//    leerdoel van 8.1 tot en met 8.6, elk met het bijbehorende herhaalmateriaal
//    in de uitleg. Daarmee valt de blauwdrukvolgorde op zijn plaats binnen een
//    paragraaf: diagnose (startcheck) -> herhaling (de twee theorieblokken van
//    8.6, die het jaar samenvatten) -> twee sporen (het herstelspoor als eerste
//    opgave bij Extra steun, het verdiepingsspoor als eerste bij Extra plus) ->
//    hoofdstuktoets (de eindtoets). De vrijwillige plusparagraaf 8.7 blijft
//    erbuiten, precies zoals de hoofdstuktoets hem buiten laat.
//    Diagnose 16 en 17 zijn in ronde 6 herschreven, omdat een startcheck geen
//    stof mag veronderstellen die pas verderop in dezelfde paragraaf staat. Ze
//    vragen nu naar wat de leerling meebrengt uit hoofdstuk 1 tot en met 7 en
//    uit hoofdstuk 4 en 8.4, en wijzen voor het antwoord naar de theorie die
//    eronder komt. Diagnose 16 heeft de oude startvraag over hoofdstuk 1 tot en
//    met 7 in zich opgenomen, zodat er niets uit ronde 5 verdwenen is.
//
// WAT DAARMEE NIET IS OPGELOST, EERLIJK GENOTEERD
// ----------------------------------------------
// De blauwdruk vraagt "beloon wat gemeten wordt". Dat lukt hier maar half. De
// tokenverdeling zit in tokenPlan() in de gedeelde generator en geldt voor alle
// 52 paragrafen van alle drie de leerwegen: de praktijkopdracht van een
// checkpoint krijgt 45 tokens en de startcheck nul. Die nul is voor de deeltoets
// en de diagnostische ronde blauwdruk-conform ("Geen cijfer, geen tokens" staat
// er letterlijk bij stap 1), maar de 45 tokens op een opdracht die alleen de
// docent kan nakijken blijven scheef staan tegenover de 40 op de eindtoets. Dat
// rechttrekken is een wijziging in gedeelde code die elk hoofdstuk raakt en
// hoort in een keer voor de hele seed te gebeuren, niet vanuit hoofdstuk 8.
// Zolang dat niet gebeurd is, staat het hier genoteerd in plaats van
// weggeschreven.
//
// DE TIEN BLAUWDRUKSTAPPEN IN DIT BESTAND
// ---------------------------------------
// * Stap 1, startcheck. `checks` bevat objecten { vraag, antwoord, uitleg,
//   leerdoel }, een per leerdoel. De generator zet dat blok direct achter het
//   slidedeck en dus VOOR de theorie, zet de Digidocent er uit en klapt de
//   uitleg dicht tot de leerling hem zelf opent. Het zijn echte voorkennis-
//   vragen: ze gaan over wat de leerling al meebrengt of in een eerder
//   hoofdstuk of een eerdere paragraaf deed, nooit over werk dat pas verderop
//   in deze paragraaf ontstaat. Aantallen: 8.1 zeven (met de voorkennischeck),
//   8.4 veertien (met de deeltoets), 8.6 achttien (de diagnostische ronde), de
//   overige paragrafen drie, een per leerdoel. Samen 51 startvragen.
// * Stap 4, 5 en 6, oefenen. `opties.oefenen` bevat per paragraaf vijf
//   uitgewerkte opgaven in de volgorde samen, zelf, zelf, steun, plus. In 8.4
//   staan er drie bij (een tweede samen-opgave plus het steun- en het plusspoor
//   uit B) en in 8.6 twee (het herstel- en het verdiepingsspoor uit C). Die
//   sporen staan bewust als EERSTE opgave van hun blok, zodat de leerling de
//   instapdrempel leest voordat hij aan het gewone oefenwerk begint. Samen 40
//   oefenopgaven. Het blok staat tussen de theorie en de bewijsopdracht en haalt
//   zijn tokens uit het budget van die opdracht, dus het paragraaftotaal
//   verandert niet.
// * Stap 8, bewijs. `assignment` is een object met tekst, label, modelAnswer en
//   nakijkpunten. De nakijkpunten komen als succescriteria bij de leerling in
//   beeld ("Je bewijs is af als:"), het modelantwoord blijft docentdata in de
//   nakijkstapel. Er staat dus geen rubriek meer in kapitalen in de leerlingtekst.
//
// LES 18 EN HET BEELD DAT ONTBREEKT (OPENSTAANDE POST)
// ---------------------------------------------------
// De bron toont vier schermafbeeldingen: de homepagina, de grote plusknop
// links, de lege poster met het linkermenu, en het menu "laag" bij "Zo:". Die
// vier beelden zijn niet met de tekst meegeleverd en zijn hier dus NIET
// gereproduceerd. Wat er staat is een tekstuele vervanging: een genummerd
// stappenplan in de opdracht en een lijst die per schermdeel zegt wat er staat
// en waar. Dit blijft een openstaande post: zodra de schermafbeeldingen er
// zijn, horen ze als extra mediablokken bij 8.4.
//
// TWEE WOORDEN UIT LES 18 DIE LETTERLIJK TERUG MOESTEN (RONDE 6)
// -------------------------------------------------------------
// Het lesdoel van de bron luidt "experimenteren met tekst, afbeeldingen en
// vormen". Ronde 5 had "vormen" opgelost in het bredere woord "elementen";
// inhoudelijk gedekt, maar een leerling die de bron ernaast legt vond het niet
// terug. Theorieblok B van 8.4 en stap 5 en 8 van de praktijkopdracht noemen
// nu allebei tekst, afbeeldingen en vormen, en leggen erbij uit dat vormen
// (lijnen, cirkels, kaders) samen met afbeeldingen en iconen onder elementen
// zitten. "vormen" is ook kernbegrip van dat theorieblok geworden.
// Het tweede woord is een knopnaam: de bron zegt rechtermuisknop, dan "laag".
// Overal waar dit hoofdstuk "lagen" schreef staat nu "laag", want dat is wat de
// leerling in Canva moet aanklikken.
//
// DE LEERDOELEN VAN 8.4 (RONDE 5, TERUG NAAR HET JAARPLAN)
// --------------------------------------------------------
// Ronde 4 voegde het doel "uitleggen wat Canva is en welke vier onderdelen op
// de homepagina staan" toe en voegde daarvoor de twee jaarplandoelen over de
// poster maken en de poster inleveren samen. Daarmee week 8.4 als enige
// paragraaf van het hoofdstuk af van het jaarplan. De drie doelen staan nu weer
// letterlijk zoals het jaarplan ze noemt: account maken en inloggen, een
// A4-poster starten met tekst, elementen en kleur, en het ontwerp downloaden of
// delen als PNG of PDF. Alle vragen over de homepagina, de plusknop en de vier
// onderdelen zijn blijven staan; ze hangen alleen aan een ander doel. Dekking:
// account 2 startvragen, 2 oefeningen, 4 quizvragen en 4 toetsitems; starten 1,
// 2, 2 en 2; delen 1, 2, 3 en 2. Elk van de drie haalt daarmee de vier-keer-lat
// uit PATROON.md.
// Ronde 7 heeft aan de quiz van 8.4 een tiende vraag toegevoegd. Die hangt niet
// aan een doel van 8.4 maar aan het stappenplandoel van 8.1, omdat 8.4 als
// enige gewone paragraaf van dit hoofdstuk nergens naar een eerdere paragraaf
// van hoofdstuk 8 terugkeek. De dekking hierboven verandert daar niet door.
//
// DE A3/A4-TEGENSPRAAK UIT LES 18 (OPGELOST, NIET GEKOPIEERD)
// ----------------------------------------------------------
// De bron noemt het product vier keer een A4-poster en geeft bij stap 2 de
// instructie om "poster staand, A3" aan te klikken. Die tegenspraak is
// rechtgezet in plaats van overgenomen: theorieblok 8.4-theory-2 en stap 2 van
// de praktijkopdracht zeggen allebei expliciet dat Canva dit formaat A3 noemt,
// dat A3 twee keer zo groot is als A4 en dat de verhouding gelijk blijft. De
// naam A4-poster blijft staan omdat de bron en het jaarplan die gebruiken.
//
// WAAROM 8.6 ZWAARDER IS DAN DE ANDERE ZES, EN HOE JE HEM PLANT
// ------------------------------------------------------------
// Gemeten over de gegenereerde blokken is 8.6 ongeveer 101.000 tekens tegen
// gemiddeld 33.000 in de andere zes paragrafen, dus ruwweg drie keer zo zwaar.
// Dat is een ontwerpkeuze en geen ongeluk, en dit is de verantwoording. In deze
// ene paragraafcode vallen vier dingen samen: de hele hoofdstukafsluiting van de
// blauwdruk (diagnostische toets, herhaling, twee sporen, hoofdstuktoets), les
// 20 van de bron (terugblik, eindcreatie van 25 minuten, inleveren in 5
// minuten), de eindtoets van het HELE leerjaar met zeventien leerdoelen die elk
// twee keer bevraagd worden, en het colofon. Het jaarplan geeft daar een
// paragraafcode voor; de blauwdruk rekent met 45 tot 60 minuten per paragraaf.
// Die twee passen niet op elkaar en dus staat hier het advies: PLAN 8.6 OVER
// DRIE LESUREN. Uur 1 is de diagnostische ronde plus de twee theorieblokken en
// het spoor dat daaruit volgt. Uur 2 is de eindcreatie en het inleveren, precies
// de 25 plus 5 minuten van de bron, met de rest van het uur voor de terugblik en
// de vergelijking met een klasgenoot. Uur 3 is de eindtoets en de game. Wie het
// in een uur wil doen, laat de eindtoets in een volgende les vallen; het
// omgekeerde, de diagnose overslaan, kost precies het effect waar de blauwdruk
// het merkteken Bewijs aan hangt.
//
// MEDIA IN DIT HOOFDSTUK
// ----------------------
// Tien mediablokken over zeven paragrafen; elke paragraaf begint met bewegend
// beeld. Alle YouTube-fragmenten zijn via oembed gecontroleerd.
//   8.1  vmq6Rehhl6Q  "Wat is een algoritme? | Huh?!" (Het Klokhuis)
//   8.2  uY6smVKxjQA  "Als...dan | Blokkenseries Scratch" (Scratch Labs)
//   8.3  GlqkuktSmyE  "In de ruimte - Scratch Game Tutorial" (Skillsdojo).
//        Vervangt sinds ronde 4 de statische Wikipedia-pagina over "Bug
//        (technologie)"; die blijft de geschreven bron van theorieblok 1,
//        maar was als mediablok geen fragment en de kijkvraag stond al
//        woordelijk in de theorie erboven.
//   8.4  oVH6Qu9HEZ4  Canva-account maken en downloaden (uit links.txt)
//   8.5  qYys36TLtuA  "3 Tips Om je Eigen Poster te Ontwerpen" (Helloacademy)
//        + talkai.info, de chatbot uit de eindopdracht (uit links.txt). Dat
//        tweede blok is bewust geen video: het is het gereedschap dat de
//        bronopdracht zelf voorschrijft, en een leerling moet het openen.
//   8.6  pdVvcAav_Jk  "Wat is digitale geletterdheid?" (Basicly), voor de
//        terugblik over het hele jaar, + z9z7RLIc4u8 "Easy4u: een poster
//        ontwerpen met Canva.com" (meneerICT) voor optie A van de eindcreatie.
//   8.7  6qef6zKyaSA  "Scratch Les 3: Variabelen" (ComputerAvonturen)
//        + P9uSfaqJX60 "Leren Programmeren in Python - 4 - Variabelen"
//        (dirkpeetersbilzen). Dat tweede blok was in ronde 5 de statische
//        pagina "Van Scratch naar Python" op roc.ovh. De criticus wees er
//        terecht op dat dezelfde bouwer die regel bij 8.3 wel toepaste en hier
//        niet: blauwdrukstap 7 vraagt bewegend beeld dat iets toevoegt wat
//        tekst niet kan. Deze video doet dat wel, en beter dan de pagina: hij
//        laat dezelfde variabele zien die de leerling net in Scratch-blokken
//        zag, nu als getypte regel. De pagina op roc.ovh is niet verdwenen maar
//        staat als leestip in de praktijkopdracht van 8.7.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/tl/h8.mjs.

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
  creatie: 'Je kunt je kennis laten zien in een eigen eindcreatie in Canva, Word of PowerPoint.',
  variabele: 'Je weet wat een variabele is en waar je hem voor gebruikt.',
  vergelijken: 'Je kunt een klein blokprogramma vergelijken met dezelfde code in tekst.',
  waaromTekst: 'Je kunt uitleggen waarom programmeurs met tekst werken en niet met blokken.'
};

// Leerdoelen uit hoofdstuk 7, letterlijk overgenomen. Ze horen bij de
// voorkennischeck bovenaan 8.1: de blauwdruk vraagt aan het begin van elk
// hoofdstuk 4 tot 6 vragen over het vorige hoofdstuk, en dat is tegelijk de
// spreiding op hoofdstukniveau. Deze vier begrippen zijn niet willekeurig
// gekozen: 8.1 leunt op "AI denkt niet zelf mee", en 8.5 leunt op de prompt,
// het controleren van een chatbotantwoord en het niet delen van gegevens.
// RONDE 8: DE VIER ONDERDELEN VAN EEN PROMPT (BLOKKEREND, OPGELOST)
// -----------------------------------------------------------------
// Paragraaf 8.5 leerde tot en met ronde 7 TWEE verschillende lijstjes van "de
// vier onderdelen van een prompt". Theorieblok A en het uitgewerkte voorbeeld
// in de verrijking zeiden rol/opdracht/doelgroep/lengte; de startcheck van
// diezelfde paragraaf, de feedback bij quizvraag 1, het eerste nakijkpunt van
// de praktijkopdracht, diagnose 13 in 8.6 en het leerdoel van 7.3 zeiden
// opdracht/ONDERWERP/doelgroep/lengte. Het onderwerp was uit de vier gevallen
// en vervangen door de rol, die in hoofdstuk 7 juist GEEN van de vier is maar
// een van de zeven losse tips. Een leerling die het uitgewerkte voorbeeld
// naspreekt - en daar is blauwdrukstap 3 voor bedoeld - gaf daardoor in
// diagnose 13 en in twee eindtoetsvragen het foute antwoord.
// Hersteld: theorieblok A van 8.5 en de exampleHtml van 8.5-theory-1 noemen nu
// allebei opdracht, onderwerp, doelgroep en lengte, met een expliciete zin
// erbij dat de rol GEEN vijfde onderdeel is maar de losse roltip uit hoofdstuk
// 7. Het voorbeeld benoemt per onderdeel welk stuk van de voorbeeldprompt het
// is.
//
// RONDE 9: DEZELFDE TEGENSPRAAK, DE TWEE OVERGESLAGEN VINDPLAATSEN
// ----------------------------------------------------------------
// Ronde 8 claimde hierboven "alle zes de vindplaatsen". Het waren er ACHT. De
// twee die bleven staan zaten in de eindtoets van het leerjaar (8.6), en dat
// is precies de plek die telt: eindtoets-item 27 zei in zijn explanation en in
// zijn feedback nog "Rol, opdracht, doelgroep en lengte". Een leerling die
// diagnose 13 goed beantwoordde, las dertig vragen later in diezelfde
// paragraaf dat zijn antwoord niet de vier was. Beide velden zeggen nu
// opdracht, onderwerp, doelgroep en lengte; de explanation voegt er expliciet
// aan toe dat de rol vooraf de losse tip uit hoofdstuk 7 is en geen vijfde
// onderdeel. Geteld na afloop: nul treffers meer op "Rol, opdracht" in beide
// bestanden.
//
// RONDE 9: DE SCRATCH-BLOKNAMEN IN 8.2 EN 8.3
// -------------------------------------------
// Het uitgewerkte voorbeeld bij theorieblok B van 8.2 bouwde "als raak je de
// rand, dan keer om". Dat was op twee manieren mis. De bloknamen bestaan niet
// in het Nederlandse Scratch 3 (het zijn "raak ik (rand)?" uit Waarnemen en
// "keer om aan de rand" uit Beweging, geverifieerd op de Dutch Scratch-Wiki),
// en de constructie is bouwkundig dubbelop: "keer om aan de rand" controleert
// de rand zelf al, dus een als-dan eromheen doet niets extra's.
// Hersteld: het voorbeeldscript zet nu "neem 10 stappen" en "keer om aan de
// rand" binnen de herhaling, en gebruikt het als-dan-blok voor een actie die
// het kaatsblok NIET levert (zeg "Boing!", of van uiterlijk veranderen). Zo
// dragen de herhaling en de keuze allebei hun eigen werk. De theorie zegt er
// een zin bij dat je om het kaatsblok geen als-dan hoeft te zetten.
// Meegetrokken omdat ze aan hetzelfde script hingen: de praktijkopdracht van
// 8.2 en haar modelantwoord, twee navertelvragen, deeltoetsvraag 6, diagnose 5
// en 6, en het hele debugscenario van 8.3 (dat zocht de bug in "het enige blok
// dat over omdraaien gaat" - dat is sinds deze ronde het kaatsblok, dus de bug
// gaat nu over de extra actie in het als-dan-blok).
//
// RONDE 9: WOORDKEUZE EN VINDBAARHEID (kleine punten van de criticus)
// -------------------------------------------------------------------
// - "überhaupt" (spreektaal die brugklassers passief wel maar actief niet
//   kennen) stond in twee uitlegzinnen en een feedbackzin die het verschil
//   tussen herhaling en keuze moesten dragen: nu "of het gebeurt of niet".
// - "equivalent" in het plusvoorbeeld van 8.7: nu "tegenhanger".
// - "voorlichter" in de promptvoorbeelden: nu "Je geeft voorlichting op een
//   school". De roltip blijft staan, maar hangt niet meer aan een woord dat
//   een twaalfjarige moet raden.
// - "Diagnostische ronde" als kop van de startcheck van 8.6: nu "Zelftest over
//   het hele hoofdstuk", met een zin die uitlegt wat de Diagnose-vragen zijn.
//   De labels Diagnose 1 tot en met 17 blijven, want de sporen verwijzen ernaar.
// - Media staat volgens de blauwdruk op stap 7, dus na het oefenen. Twee
//   theorieblokken verwezen er in de tegenwoordige tijd naar ("de video bij
//   deze paragraaf"), waardoor de leerling vijf blokken moest scrollen om hem
//   te zoeken. Die verwijzingen zeggen nu "verderop in deze paragraaf": 8.1,
//   8.4-theorie en het aanmeldstappenplan van 8.4.
//
// RONDE 8: DE OVERIGE HERSTELPUNTEN
// ---------------------------------
// (1) NAKIJKPUNTEN IN DE JE-VORM. De generator zet nakijkpunten onder de kop
//     "Je bewijs is af als:" bij de leerling in beeld, dus horen ze in de
//     je-vorm. Ronde 7 had 8.1 en 8.3 omgezet; 8.2, 8.4, 8.5 en 8.6 stonden nog
//     in de derde persoon ("wat de leerling beschrijft"). Alle vier omgezet.
// (2) DE DIAGNOSTISCHE RONDE IN 8.6 ROUTEERDE NIET SLUITEND. De route stuurde
//     bij tien of minder van de zeventien naar het herstelspoor en bij ALLES
//     goed naar het verdiepingsspoor; wie elf tot zestien goed had - de grootste
//     groep - las geen enkel spoor. De knip ligt nu bij twaalf: twaalf of minder
//     naar herstel, dertien of meer naar verdieping. Dat is dezelfde sluitende
//     vorm die de deeltoets van 8.4 al had (zeven van de negen). De drempel
//     staat op alle drie de vindplaatsen gelijk: de routevraag, de eerste opgave
//     bij Extra steun en de eerste opgave bij Extra plus.
// (3) DE TWEE STAPPENPLANNEN STONDEN ALS PROZA. De verantwoording bovenin dit
//     bestand zegt dat handelingsvolgordes in de praktijkopdracht staan "daar
//     kan hij het afvinken", maar de opdrachten van 8.4 (491 woorden) en 8.5
//     (402 woorden) waren een lopende alinea met de nummers in de tekst. Beide
//     staan nu in echte <ol>-lijsten: 8.4 in twee lijsten (zeven aanmeldstappen
//     en negen posterstappen), 8.5 in een lijst van acht. De generator wikkelt
//     assignment.tekst in <p>, dus de lijsten breken daar met </p>...<p> uit,
//     precies zoals de theorieblokken dat al deden.
// (4) DE PYTHON-REGEL IN 8.7 WAS NIET WAAR. Het uitgewerkte voorbeeld bij
//     theorieblok B schreef "for i in range(10):" met daaronder vooruit(10).
//     Die functie bestaat niet in Python; intypen geeft een NameError. Nu staat
//     er print("stap"), dat wel bestaat. De logica die het voorbeeld leert
//     (zelfde herhaling, andere schrijfwijze) is ongewijzigd.
// (5) DE OVERGANGSZIN UIT LES 18. Tussen opdracht 1 en opdracht 2 staat in de
//     bron "Je hebt opdracht 1 ingeleverd en de basis van Canva geoefend. Goed
//     gedaan!". Die aanmoediging ontbrak in de tl-versie terwijl de kb-versie
//     hem wel had, en dit bestand claimt les 18 zo letterlijk mogelijk over te
//     nemen. Hij staat nu in de praktijkopdracht van 8.4.
//
// WAT BEWUST IS BLIJVEN STAAN (EN WAAROM)
// ---------------------------------------
// - De terugkeervragen 33 tot en met 36 van de eindtoets hangen aan het doel
//   "terugkijken op wat je dit jaar geleerd hebt over digitale geletterdheid".
//   Dat is geen verkeerde koppeling maar de bedoeling: het doel gaat letterlijk
//   over terugkijken, en de vier vragen halen hun stof uit hoofdstuk 1, 3, 5 en
//   uit 2 plus 6. De prompts zeggen dat er ook bij ("Kijk terug naar hoofdstuk
//   3", "Terugblik op hoofdstuk 5"), zodat de docent in de voortgang ziet wat
//   er gemeten is. De vier vragen op het Canva-accountdoel gaan alle vier echt
//   over Canva: wat het is, de vier onderdelen van de homepagina, de
//   aanmeldstap en de bevestigingsmail.
// - De deeltoets in de checks van 8.4 en de diagnostische ronde in die van 8.6
//   blazen die startcheckblokken op tot veertien en achttien vragen. De
//   blauwdruk wil ze op precies deze plek (voor de theorie), maar geeft ze daar
//   een eigen onderdeel. helpers.mjs kent zo een slot niet, en er een bij maken
//   raakt alle 52 paragrafen van alle leerwegen. Daarom staan ze in checks, met
//   in de eerste vraag van het blok uitgeschreven dat het blok uit twee delen
//   bestaat en welke vragen de gewone startvragen zijn (8.4: de vier na de
//   deeltoets; 8.6: diagnose 16 en 17).
// - tokenPlan() geeft de praktijkopdracht van het checkpoint 45 tokens en de
//   eindtoets 40, terwijl alleen die laatste gemeten wordt. Dat botst met de
//   blauwdrukregel "beloon wat gemeten wordt", maar tokenPlan() is gedeelde
//   code in de generator en hoort niet vanuit een hoofdstukbestand omgezet.

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
    p('8.1', 'Algoritmes: een stappenplan voor de computer', ['22B', '21A'], 'eigen algoritme van een dagelijkse handeling, getest door een klasgenoot', 100, 'Stappen Sorteren',
      ['Een algoritme is een stappenplan',
        'Haal eerst hoofdstuk 7 terug: AI leert van data maar denkt niet en vult dus niets zelf in. Waaruit bestond een goede prompt, en hoe controleerde je een chatbotantwoord? Die vragen staan in het checkblok hierboven. Een algoritme is een stappenplan: een rij instructies die precies zegt hoe je van begin naar resultaat komt. Het woord komt van Al-Chwarizmi, een wiskundige die rond het jaar 800 rekenregels opschreef die iedereen kon volgen. Zijn regels waren zo precies dat je ze zonder nadenken kon uitvoeren, en dat is nog steeds de eis. Denken in zulke uitvoerbare stappen heet computationeel denken, en dat is wat je in deze drie paragrafen oefent. Het verschil met uitleg aan een mens is dat een computer helemaal niets zelf invult. Zeg je tegen een klasgenoot "smeer een boterham", dan begrijpt hij meteen wat jij bedoelt. Een computer heeft elke handeling nodig, van het openen van de zak tot het dichtklappen van de sneetjes. De volgorde weegt daarbij net zo zwaar als de stappen zelf, want dezelfde handelingen in een andere volgorde geven een ander resultaat. Eerst beleggen en dan smeren pakt namelijk heel anders uit dan eerst smeren en dan beleggen. Daarom controleer je een algoritme door het letterlijk uit te voeren, precies zoals het er staat, zonder mee te denken. De video verderop in deze paragraaf laat zien dat jij elke dag algoritmes gebruikt zonder dat je het merkt. Denk aan een recept, aan de route van je navigatie of aan het wasvoorschrift in je trui.'],
      ['Herhaling en keuze in een stappenplan',
        'Een stappenplan dat alleen maar rechtdoor loopt wordt al snel eindeloos lang en behoorlijk dom. Daarom zitten er in bijna elk algoritme twee slimme bouwstenen die het kort en leesbaar houden. De eerste is een herhaling: je schrijft niet twintig keer "doe een stap", maar "herhaal twintig keer: doe een stap". De tweede is een keuze: het programma kijkt naar een voorwaarde en gaat daarna de ene of de andere kant op. Zo een keuze schrijf je op als: als het regent, dan pak je een jas, anders pak je een pet. De voorwaarde is het stuk dat waar of niet waar kan zijn, en juist daar zit de logica van je programma. Herhaling en keuze zijn niet toevallig ook de eerste twee dingen die je straks in Scratch tegenkomt. Elke programmeertaal ter wereld kent ze, van gekleurde blokken tot de code achter je favoriete spel. Wie ze in gewone taal kan opschrijven, kan ze daarna ook in blokken en in tekstcode bouwen.'],
      media('https://www.youtube.com/embed/vmq6Rehhl6Q', 'Huh?!: Wat is een algoritme?', 'Noem uit de video een algoritme dat jij zelf vandaag al gebruikt hebt, en zeg erbij wat de eerste stap is.'),
      [
        {
          vraag: 'Voorkennis hoofdstuk 7, vraag 1. Waarvan leert AI, en waarom is leren iets anders dan zelf meedenken?',
          antwoord: 'AI leert van data, dus van heel veel voorbeelden. Meedenken is snappen waar iets over gaat, en dat doet een computer niet.',
          uitleg: 'Precies daarom moet je in dit hoofdstuk elke stap uitschrijven. Een machine vult nooit voor je in wat je vergeten bent.',
          leerdoel: VORIG.data
        },
        {
          vraag: 'Voorkennis hoofdstuk 7, vraag 2. Uit welke vier onderdelen bestond een goede prompt?',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte van het antwoord dat je terug wilt krijgen.',
          uitleg: 'In paragraaf 8.5 schrijf je zelf zo\'n prompt voor je poster. Hoe preciezer die vier zijn, hoe bruikbaarder het antwoord.',
          leerdoel: VORIG.prompt
        },
        {
          vraag: 'Voorkennis hoofdstuk 7, vraag 3. Hoe controleerde je of het antwoord van een chatbot echt klopte?',
          antwoord: 'Je zoekt hetzelfde feit bij een tweede, onafhankelijke bron en je kijkt of de chatbot niets verzonnen heeft.',
          uitleg: 'Dat verzinnen heette hallucinatie. In 8.5 zet je chatbotinformatie op een poster, dus die controle is daar geen luxe.',
          leerdoel: VORIG.controleren
        },
        {
          vraag: 'Voorkennis hoofdstuk 7, vraag 4. Waarom deel je geen persoonlijke gegevens met een chatbot?',
          antwoord: 'Omdat die gegevens bij een bedrijf terechtkomen en samen een profiel vormen waarmee iemand jou kan vinden.',
          uitleg: 'Dezelfde regel geldt straks bij je poster: zet er niets op wat jou of een klasgenoot herkenbaar maakt.',
          leerdoel: VORIG.gegevens
        },
        {
          vraag: 'Je legt een klasgenoot uit hoe hij een boterham smeert. Wat moet je zeggen zodat hij niets zelf hoeft te bedenken?',
          antwoord: 'Elke handeling apart en op volgorde: pak de zak, haal er twee sneetjes uit, pak een mes, doe boter op het mes.',
          uitleg: 'Een mens vult zelf aan wat je vergeet. Een machine doet dat niet, dus die heeft elke handeling los nodig.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Hoeveel stappen heb jij nodig om het inpakken van je tas op te schrijven? Noem er alvast twee.',
          antwoord: 'Bijvoorbeeld acht: open je rooster, kijk welke vakken je morgen hebt, pak per vak je boek en je schrift.',
          uitleg: 'Je merkt hier al dat je bijna altijd meer stappen nodig hebt dan je vooraf denkt, want kleine handelingen tellen mee.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Hoe zeg je in gewone taal dat iets twintig keer moet gebeuren, en dat iets alleen bij regen moet gebeuren?',
          antwoord: 'Bijvoorbeeld: "herhaal twintig keer: doe een stap" en "als het regent, dan pak je een jas".',
          uitleg: 'Deze twee zinnen zijn precies wat een herhaling en een keuze in een stappenplan doen, alleen nog in gewone taal.',
          leerdoel: DOEL.herhaalKeuze
        }
      ],
      {
        tekst: 'Schrijf een algoritme van een dagelijkse handeling en laat het testen. Stap 1: kies een handeling die je elke dag doet, bijvoorbeeld je tas inpakken, thee zetten of inloggen op je schoolaccount. Stap 2: schrijf de handeling in Word op in genummerde stappen, minimaal zes en maximaal twaalf. Stap 3: bouw er minstens een herhaling in (bijvoorbeeld: herhaal voor elk vak in je rooster) en minstens een keuze met een voorwaarde (bijvoorbeeld: als je gym hebt, dan pak je je sporttas). Stap 4: geef je stappenplan aan een klasgenoot en laat hem het letterlijk uitvoeren als robot, zonder zelf iets in te vullen. Stap 5: schrijf onder je stappenplan op welke stap misging en hoe je hem hebt aangepast. Lever het Word-bestand met beide versies in bij je docent.',
        label: 'Lever je Word-bestand in en schrijf hier op welke stap jouw tester vastliep.',
        modelAnswer: 'Een voldoende inzending is een genummerde lijst van ongeveer acht stappen voor bijvoorbeeld "tas inpakken voor morgen". Bij stap 3 staat een echte herhaling, zoals "herhaal voor elk vak op je rooster: pak het boek en het schrift", en bij stap 6 een echte keuze, zoals "als je gym hebt, pak dan ook je sporttas". Daaronder staat een concrete testuitkomst: "Mijn tester liep vast bij stap 1, want ik was vergeten te zeggen dat je eerst je rooster opent. Dat heb ik als nieuwe stap 1 toegevoegd." De tweede versie laat die aanpassing ook echt zien.',
        nakijkpunten: [
          'Elke stap is letterlijk uitvoerbaar op het moment dat hij aan de beurt is.',
          'Er staat echt een herhaling in en echt een keuze met een voorwaarde.',
          'Je benoemt een concrete fout uit de test en de aanpassing die daarop volgde.'
        ]
      },
      ['Wat is een algoritme?', 'Waarom is de volgorde van stappen belangrijk?', 'Wat doet een herhaling in een stappenplan?', 'Wat is een voorwaarde bij een keuze?', 'Waarom mag een testende klasgenoot niet meedenken?'],
      'Sleep losse instructies in de goede volgorde en bouw daarna een herhaling en een keuze in het stappenplan.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Sam schrijft: 1. doe de deur op slot, 2. loop naar buiten, 3. pak je sleutel. Welke stap staat verkeerd en waarom?',
            antwoord: 'Stap 3 staat te laat; de sleutel moet je hebben voordat je in stap 1 de deur op slot doet.',
            uitleg: 'Controleer een algoritme door het letterlijk uit te voeren. Bij stap 1 heeft de uitvoerder nog geen sleutel, dus daar loopt hij vast. De goede volgorde is: pak je sleutel, loop naar buiten, doe de deur op slot.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf het opladen van je telefoon op in hooguit zes stappen die een ander precies zo kan uitvoeren.',
            antwoord: 'Bijvoorbeeld: 1. pak de kabel, 2. steek de stekker in het stopcontact, 3. steek het kleine uiteinde in je telefoon, 4. controleer of het laadsymbool verschijnt.',
            uitleg: 'Let op de stappen die je normaal overslaat, zoals het pakken van de kabel en het controleren of het laden echt begonnen is. Juist die vergeten stappen zijn de plek waar een computer vastloopt.',
            leerdoel: DOEL.stappen
          },
          {
            groep: 'zelf',
            vraag: 'Waar zit in jouw stappenplan van hierboven een herhaling, en waar zou een keuze met een voorwaarde passen?',
            antwoord: 'Een herhaling past bij "herhaal tot de accu vol is", een keuze bij "als de accu onder de twintig procent zit, dan laad je nu op".',
            uitleg: 'Een herhaling herken je aan iets dat meerdere keren moet gebeuren, een keuze aan het woordje "als". De voorwaarde is het stuk dat waar of niet waar kan zijn, hier het percentage van je accu.',
            leerdoel: DOEL.herhaalKeuze
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een algoritme is een ..., en de ... van de stappen bepaalt of het werkt.',
            antwoord: 'Een algoritme is een stappenplan, en de volgorde van de stappen bepaalt of het werkt.',
            uitleg: 'Deze twee woorden zijn de kern van de hele paragraaf. Stappenplan gaat over wat er moet gebeuren, volgorde over wanneer het aan de beurt is.',
            leerdoel: DOEL.algoritme
          },
          {
            groep: 'plus',
            vraag: 'Twee mensen voeren hetzelfde algoritme uit en krijgen toch een ander resultaat. Hoe kan dat, als de stappen gelijk zijn?',
            antwoord: 'Omdat er een stap in staat die niet precies genoeg is, of omdat een keuze bij hen op een andere voorwaarde uitkomt.',
            uitleg: 'Een stap als "doe er wat suiker in" laat ruimte voor eigen invulling; dat noem je niet uitvoerbaar genoeg. En een keuze als "als het regent" valt bij de een anders uit dan bij de ander, terwijl het algoritme hetzelfde blijft.',
            leerdoel: DOEL.herhaalKeuze
          }
        ]
      }),

    p('8.2', 'Zelf programmeren met blokken', ['22B', '22A'], 'werkend blokprogramma met een herhaling en een als-dan-keuze', 100, 'Blokkenbouwer',
      ['Van stappenplan naar blokken',
        'In een blokkentaal als Scratch klik je je programma in elkaar met gekleurde blokken in plaats van getypte regels. Elk blok is een instructie, en de vorm van een blok laat zien welke blokken er precies onder passen. Daardoor kun je nooit een combinatie bouwen die de computer straks helemaal niet kan uitvoeren. Je werkt met een sprite: het figuur op het speelveld dat jouw opdrachten uitvoert, bijvoorbeeld de kat van Scratch. De blokken die je onder elkaar klikt heten samen een script, en dat script is jouw programma. Dat script is precies het algoritme uit de vorige paragraaf, maar dan in een vorm die de computer uitvoert. Bouwen doe je op scratch.mit.edu, waar je zonder installatie meteen in je browser aan de slag kunt. Het grote voordeel van blokken is dat je er nooit een spelfout of een tikfout in kunt maken. Je aandacht gaat daardoor naar de logica van je programma en niet naar de precieze schrijfwijze. Een blokprogramma is bovendien makkelijk te laten zien, want een klasgenoot ziet in één oogopslag wat er staat. Wie in blokken kan denken heeft de moeilijkste stap van het programmeren dus eigenlijk al gezet.'],
      ['Gebeurtenis, herhaling en de als-dan-keuze',
        'Elk script begint met een gebeurtenis, en die gebeurtenis bepaalt wanneer jouw programma gaat lopen. Meestal is dat het gele blok "wanneer op de groene vlag wordt geklikt", helemaal bovenaan je script. Daaronder klik je de rest van je blokken, netjes in de volgorde waarin ze moeten gebeuren. Een herhaal-blok is de oranje lus waarin je andere blokken legt om ze vaker te laten werken. Alles wat erin ligt wordt net zo vaak uitgevoerd als jij opgeeft, of oneindig lang door. Het als-dan-blok is de keuze uit de vorige paragraaf, maar dan in de vorm van een blok. Je schuift er een voorwaarde in uit de categorie Waarnemen, bijvoorbeeld het ruitvormige blok "raak ik (rand)?". De blokken binnenin worden alleen uitgevoerd op de momenten dat die voorwaarde waar is. Met deze drie soorten blokken bouw je al een klein spel dat echt speelbaar is. Laat je sprite bewegen met "neem 10 stappen" en terugkaatsen met "keer om aan de rand". Die twee blokken uit de categorie Beweging zet je allebei binnen de herhaling. Let op: "keer om aan de rand" controleert de rand al helemaal zelf, dus daar hoeft geen als-dan omheen. Een als-dan gebruik je juist voor iets extra\'s, bijvoorbeeld: als "raak ik (rand)?", zeg dan "Boing!". Belangrijk is dat je je eigen programma daarna blok voor blok kunt navertellen aan iemand anders. Wie zijn script kan uitleggen, kan het namelijk ook zelf uitbreiden of repareren als er iets misgaat.'],
      media('https://www.youtube.com/embed/uY6smVKxjQA', 'Als...dan | Blokkenseries Scratch', 'Welke voorwaarde schuift de maker in het als-dan-blok, en wat gebeurt er als die voorwaarde niet waar is?'),
      [
        {
          vraag: 'Heb je eerder met gekleurde blokken geprogrammeerd? Wat denk jij dat er gebeurt als je drie blokken onder elkaar klikt?',
          antwoord: 'De computer voert ze van boven naar beneden uit, het bovenste blok het eerst en het onderste als laatste.',
          uitleg: 'Blokken werken als de genummerde stappen uit 8.1: de plek in de stapel bepaalt wanneer een instructie aan de beurt is.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'In 8.1 schreef je een herhaling en een keuze in gewone taal op. Hoe zou zo een herhaling er als klikbaar blok uitzien?',
          antwoord: 'Als een blok met een opening erin, waar je andere blokken in legt die dan steeds opnieuw worden uitgevoerd.',
          uitleg: 'De vorm doet hier het werk: aan de opening zie je meteen welke instructies binnen de herhaling vallen en welke erbuiten.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Denk aan een spel dat jij kent. Wat gebeurt er precies vanaf het moment dat je op start drukt? Noem drie dingen op volgorde.',
          antwoord: 'Bijvoorbeeld: het spel zet de score op nul, het figuur verschijnt links in beeld, en daarna begint hij te lopen.',
          uitleg: 'Dit navertellen op volgorde is precies wat je straks bij je eigen script doet, alleen dan blok voor blok.',
          leerdoel: DOEL.navertellen
        }
      ],
      {
        tekst: 'Bouw je eerste werkende programma in Scratch. Stap 1: ga naar scratch.mit.edu en klik op Maken, zodat de editor opent; inloggen hoeft niet, maar met een account bewaar je je werk. Stap 2: begin je script met het blok "wanneer op de groene vlag wordt geklikt". Stap 3: laat je sprite bewegen met een herhaal-blok, bijvoorbeeld: herhaal oneindig, neem 10 stappen, keer om aan de rand. Stap 4: bouw daarbinnen een als-dan-blok met de voorwaarde "raak ik (rand)?" uit Waarnemen, en laat de sprite dan iets zeggen of een geluid spelen. Stap 5: klik op de groene vlag en test of het doet wat jij bedacht had. Stap 6: maak een screenshot van je script en van het speelveld, en schrijf er in Word vijf tot acht regels bij waarin je stap voor stap uitlegt wat jouw programma doet en waarom je die blokken gekozen hebt. Lever het bestand in bij je docent.',
        label: 'Lever je screenshot met uitleg in en schrijf hier in twee zinnen wat jouw programma doet.',
        modelAnswer: 'Een voldoende inzending toont een screenshot waarop het startblok bovenaan zit, met daaronder "herhaal oneindig" en daarbinnen "neem 10 stappen", "keer om aan de rand" en een als-dan-blok met "raak ik (rand)?" waarin bijvoorbeeld "zeg Boing!" staat. De uitleg eronder luidt bijvoorbeeld: "Mijn programma start als je op de groene vlag klikt. De herhaling zorgt dat de kat blijft lopen en bij de rand omkeert. Het als-dan-blok kijkt elke ronde of hij de rand raakt; alleen dan roept hij Boing." De uitleg loopt van boven naar beneden mee met het script.',
        nakijkpunten: [
          'Het script bevat echt een gebeurtenisblok, een herhaling en een als-dan-keuze.',
          'Je programma doet op het speelveld zichtbaar wat jij in je uitleg beschrijft.',
          'De uitleg loopt van blok naar blok en benoemt wat binnen de herhaling of de keuze staat.'
        ]
      },
      ['Wat is een sprite?', 'Waarmee begint bijna elk Scratch-script?', 'Wat doet een herhaal-blok?', 'Wat schuif je in een als-dan-blok?', 'Waarom kun je met blokken geen spelfout maken?'],
      'Klik blokken aan elkaar tot de sprite de opdracht haalt; elk level vraagt een extra herhaling of keuze.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een klasgenoot heeft "neem 10 stappen" losjes op het werkveld gelegd, zonder startblok erboven. Waarom gebeurt er niets?',
            antwoord: 'Er is geen gebeurtenis die het script start, dus de computer weet niet wanneer dat blok aan de beurt is.',
            uitleg: 'Een script zonder gebeurtenisblok is als een recept zonder het moment waarop je begint. Zet er "wanneer op de groene vlag wordt geklikt" boven, dan loopt het wel.',
            leerdoel: DOEL.bouwen
          },
          {
            groep: 'zelf',
            vraag: 'Je wilt dat je sprite blijft lopen en "Boing!" roept zodra hij de rand raakt. Welke twee blokken heb je nodig en hoe liggen ze?',
            antwoord: 'Een herhaal-blok om het lopen heen, en daarbinnen een als-dan-blok met de voorwaarde "raak ik (rand)?".',
            uitleg: 'De volgorde binnenin telt: het als-dan-blok moet binnen de herhaling liggen, anders wordt de rand maar één keer gecontroleerd in plaats van elke ronde.',
            leerdoel: DOEL.gebruiken
          },
          {
            groep: 'zelf',
            vraag: 'Vertel je eigen script na in vier zinnen, alsof je klasgenoot het niet ziet. Begin bij het startblok.',
            antwoord: 'Bijvoorbeeld: het start bij de groene vlag, dan begint de herhaling, daarbinnen loopt de kat tien stappen en keert hij om aan de rand, en als hij de rand raakt roept hij Boing.',
            uitleg: 'Wie navertelt in de volgorde van de blokken, ontdekt zelf de gaten. Blijf je ergens hangen, dan zit daar meestal ook de fout in je programma.',
            leerdoel: DOEL.navertellen
          },
          {
            groep: 'steun',
            vraag: 'Welk blok hoort bij welk woord: het gele blok, het oranje blok en het als-dan-blok?',
            antwoord: 'Het gele blok is de gebeurtenis, het oranje blok is de herhaling en het als-dan-blok is de keuze.',
            uitleg: 'Deze drie woorden komen letterlijk terug uit paragraaf 8.1. Gebeurtenis zegt wanneer je begint, herhaling zegt hoe vaak, en keuze zegt onder welke voorwaarde.',
            leerdoel: DOEL.gebruiken
          },
          {
            groep: 'plus',
            vraag: 'Waarom kun je in blokken geen onmogelijke combinatie bouwen, terwijl dat in getypte code wel kan?',
            antwoord: 'Omdat de vorm van een blok bepaalt waar het past; een blok dat er niet hoort klikt gewoon niet vast.',
            uitleg: 'Dat heet dat de taal je fouten vooraf uitsluit. In tekstcode typ je alles zelf, dus daar merk je zo een fout pas als je het programma laat draaien.',
            leerdoel: DOEL.bouwen
          }
        ]
      }),

    p('8.3', 'Testen en verbeteren: fouten uit je programma halen', ['22B'], 'testverslag met drie gevonden fouten en de verbeteringen', 100, 'Bugjacht',
      ['Een bug en hoe je hem vindt',
        'Een bug is een fout in een programma waardoor het iets anders doet dan de bedoeling was. Het woord bestond in de techniek al lang: Thomas Edison schreef er in 1878 over. Beroemd werd het pas in 1947, toen er letterlijk een mot tussen de contacten van een computer bleek te zitten. Tegenwoordig bedoelen we er elke programmeerfout mee, van een verkeerd getal tot een vergeten blok. Fouten zijn geen teken dat je het niet kunt: elke programmeur ter wereld maakt ze dagelijks. Het echte werk zit dan ook niet in foutloos bouwen, maar in het opsporen van wat er misgaat. Dat begint met testen, en testen betekent hier iets preciezers dan even kijken of het werkt. Je probeert je programma bewust uit op de plekken waar het stuk kan gaan, niet alleen op de weg die jij bedacht had. Krijg je een foutmelding, lees hem dan echt, want er staat meestal in welk blok het misging. Verandert er niets zichtbaars, dan werk je met kleine stappen door je script heen. Voer je blokken een voor een uit en kijk na elke stap of het resultaat nog klopt.'],
      ['Debuggen doe je systematisch, en samen',
        'Het opsporen en herstellen van fouten heet debuggen, en dat doe je systematisch in plaats van op goed geluk. Verander steeds maar een ding tegelijk, zodat je na elke test weet wat die wijziging precies deed. Zet een stuk van je script tijdelijk uit om te zien of de fout dan verdwijnt of gewoon blijft. Laat je programma tussendoor iets zeggen, zodat je op het scherm ziet hoe ver hij komt. Een bekende truc is dat je je programma hardop uitlegt aan een badeendje of aan een klasgenoot. Halverwege je eigen uitleg zie je de fout meestal zelf, omdat uitleggen je dwingt elke stap echt te benoemen. Werk daarom met een testplan waarin je vooraf opschrijft wat er zou moeten gebeuren. Laat daarna een klasgenoot je programma uitproberen en noteer letterlijk wat er in werkelijkheid gebeurde. Verbeter vervolgens een fout tegelijk en test opnieuw, want twee wijzigingen samen maken onduidelijk welke van de twee hielp.'],
      media('https://www.youtube.com/embed/GlqkuktSmyE', 'In de ruimte: een Scratch-spel stap voor stap gebouwd', 'De maker bouwt in kleine stukjes en klikt er steeds tussendoor op de groene vlag. Noem één zo een tussentijdse test, en zeg wat hij pas veel later gemerkt zou hebben als hij alleen aan het eind had getest.'),
      [
        {
          vraag: 'Een app op je telefoon doet iets anders dan je verwacht. Hoe zoek jij dan uit waar het misgaat?',
          antwoord: 'Bijvoorbeeld door het nog een keer te proberen, stap voor stap terug te gaan en te kijken wanneer het wel goed ging.',
          uitleg: 'Dat terugstappen is precies wat testen is: je zoekt het laatste moment waarop alles nog klopte, want daarna zit de fout.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Het woord bug ken je misschien uit games. Wat betekent het volgens jou, en waar zou het vandaan komen?',
          antwoord: 'Een fout in een programma waardoor het iets anders doet dan bedoeld; het woord betekent letterlijk insect.',
          uitleg: 'Die letterlijke betekenis is geen toeval: in 1947 zat er echt een mot in een computer, en dat verhaal bleef hangen.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Iemand zegt dat jouw werkstuk iets mist wat jij zelf niet zag. Wat doe je met zo een opmerking, en waarom?',
          antwoord: 'Je vraagt precies wat hij zag, je controleert het zelf, en daarna beslis je of je het aanpast.',
          uitleg: 'Een ander ziet jouw werk zonder te weten wat je bedoelde. Juist daarom valt hem op wat jij eroverheen leest.',
          leerdoel: DOEL.feedback
        }
      ],
      {
        tekst: 'Maak een testverslag bij het programma uit paragraaf 8.2. Stap 1: schrijf in Word een testplan met drie dingen die zouden moeten werken, bijvoorbeeld: de sprite start bij de groene vlag, hij blijft bewegen, hij draait om bij de rand. Stap 2: bouw zelf bewust een fout in, bijvoorbeeld door de voorwaarde in je als-dan-blok te veranderen, en beschrijf wat er dan misgaat. Stap 3: ruil van plek met een klasgenoot en laat hem jouw programma testen; noteer letterlijk wat hij opmerkte. Stap 4: los de fouten een voor een op en schrijf per fout drie dingen op: wat er misging, wat je veranderd hebt en hoe je gecontroleerd hebt dat het nu klopt. Stap 5: sluit af met twee regels over de feedback van je klasgenoot: wat nam je over en wat niet, en waarom. Lever het testverslag in bij je docent.',
        label: 'Lever je testverslag in en schrijf hier welke fout je klasgenoot vond die jij zelf gemist had.',
        modelAnswer: 'Een voldoende testverslag bevat een tabel met drie rijen, bijvoorbeeld: "Verwacht: kat draait om bij de rand. Gebeurde: kat trilde tegen de rand. Veranderd: na het omkeren drie stappen laten lopen. Gecontroleerd: tien keer laten stuiteren, het trillen was weg." Daaronder staat een echte reactie op de feedback: "Sami zag dat mijn kat op zijn kop hing; dat heb ik overgenomen door de draaistijl aan te passen. Zijn tip om alles opnieuw te bouwen heb ik niet overgenomen, want de fout zat maar in één blok."',
        nakijkpunten: [
          'Het testplan staat er vooraf, met per punt wat er zou moeten gebeuren.',
          'Per fout staat wat er misging, wat er veranderd is en hoe dat gecontroleerd is.',
          'Je zegt van de feedback wat je overnam en wat niet, met een reden erbij.'
        ]
      },
      ['Wat is een bug?', 'Waarom test je ook de weg die je niet bedacht had?', 'Wat betekent debuggen?', 'Waarom verbeter je een fout tegelijk?', 'Hoe helpt hardop uitleggen bij het vinden van een fout?'],
      'Vind in vijf kapotte programma’s de bug, kies de juiste verbetering en test opnieuw.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een sprite beweegt helemaal niet. Welke drie dingen controleer je, en in welke volgorde?',
            antwoord: 'Eerst het startblok, dan de volgorde van de blokken, en daarna of het beweegblok wel binnen de herhaling ligt.',
            uitleg: 'Je werkt van buiten naar binnen: eerst of het script wel start, dan of de stappen kloppen, en pas daarna of ze op de goede plek staan.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'zelf',
            vraag: 'Leg in twee zinnen uit wat een bug is en waarom een foutmelding eerder hulp is dan straf.',
            antwoord: 'Een bug is een fout waardoor je programma iets anders doet dan bedoeld; een foutmelding zegt vaak precies waar het misging.',
            uitleg: 'Zonder melding moet je zelf zoeken waar het stukliep. Met melding heb je de plek al, en dat scheelt je het halve werk.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'zelf',
            vraag: 'Je verandert drie dingen tegelijk en het programma werkt. Waarom is dat toch een slecht idee?',
            antwoord: 'Omdat je nu niet weet welke van de drie wijzigingen de fout oploste, en de andere twee kunnen nieuwe fouten geven.',
            uitleg: 'Systematisch debuggen betekent één ding tegelijk veranderen en daarna testen. Zo koppel je elke wijziging aan een uitkomst.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: het opsporen en herstellen van fouten heet ..., en je verandert daarbij steeds ... ding tegelijk.',
            antwoord: 'Het heet debuggen, en je verandert steeds één ding tegelijk.',
            uitleg: 'Die twee woorden zijn de kern van deze paragraaf. Debuggen is het werk, en één ding tegelijk is de werkwijze die het betrouwbaar maakt.',
            leerdoel: DOEL.bug
          },
          {
            groep: 'plus',
            vraag: 'Waarom vind je een fout vaak zelf terwijl je hem hardop aan een badeendje uitlegt, dat niets terugzegt?',
            antwoord: 'Omdat je bij hardop uitleggen elke stap echt moet benoemen, en dan valt op welke stap je stilzwijgend oversloeg.',
            uitleg: 'In je hoofd sla je bekende stappen over. Uitleggen dwingt je die stappen alsnog uit te spreken, en precies daar zit meestal de fout.',
            leerdoel: DOEL.feedback
          }
        ]
      }),

    p('8.4', 'Zelf ontwerpen in Canva', ['22A'], 'zelfgemaakte A4-poster in Canva, ingeleverd als PNG of PDF', 100, 'Canva Ontwerpduel',
      ['Wat Canva is en hoe je een account maakt',
        'Canva is een online ontwerptool waarmee je simpel en snel afbeeldingen, posters, presentaties en meer maakt. Je kiest een template, een kant-en-klaar ontwerp, en past dat aan met eigen teksten, kleuren en plaatjes. Er bestaan een gratis en een betaalde versie, maar voor schoolgebruik is Canva Free ruim voldoende. Je maakt je account op www.canva.nl met je schoolmail en dus uitdrukkelijk niet met je privémail. Zo hoort je werk bij je schoolaccount en kun je er op elke schoolcomputer zonder gedoe weer bij. De zeven aanmeldstappen staan een voor een uitgeschreven in de praktijkopdracht, zodat je ze kunt afvinken. Lukt het aanmelden niet, kijk dan de video verderop in deze paragraaf, want die loopt dezelfde stappen langs. Na het inloggen kom je op de homepagina, en daar staan vier onderdelen die je moet kunnen aanwijzen:</p><ul><li>Bovenin staat een zoekbalk: daar typ je wat je wilt maken, bijvoorbeeld poster of flyer.</li><li>Links staat een grote plusknop, en daarmee begin je zonder zoeken een nieuw leeg ontwerp.</li><li>In het midden staat een overzicht van je eerdere ontwerpen, zodat je verder kunt waar je stopte.</li><li>Daarnaast vind je de toegang tot templates, tot uploads van je eigen foto’s en tot nog veel meer.</li></ul><p>' +
        'Herken je die vier onderdelen, dan vind je alles terug, ook op een schoolcomputer die je niet kent.'],
      ['Je eerste A4-poster en het downloaden',
        'Een nieuw ontwerp start je met de grote plus links; typ dan poster en kies "poster staand, A3". Canva noemt dit formaat A3, terwijl de opdracht het steeds een A4-poster noemt. Dat is geen fout: A3 is twee keer zo groot als A4, met dezelfde verhouding. Je krijgt een lege poster met links de menu’s Ontwerpen, tekst, elementen, uploads en nog meer. Onder elementen vind je afbeeldingen, iconen en vormen; met tekst, afbeeldingen en vormen samen experimenteer je tot je poster staat. Klik op een wit gedeelte, dan verschijnt bovenin een kleurwieltje voor de achtergrondkleur. Kies een kleur waarbij je tekst leesbaar blijft, of pas anders je tekstkleur aan. Canva slaat je werk automatisch op, dus zoeken naar een knop bewaren heeft geen zin. Met de rechtermuisknop op een element gooi je het via het prullenbakje weg. Met diezelfde rechtermuisknop kies je "laag", en daarmee zet je een element naar voren of juist naar achteren. Ben je klaar, klik dan rechtsboven op Delen en daarna op Downloaden, als PNG of als PDF. Lukt downloaden niet omdat je betaalde elementen gebruikt hebt, dan heb je drie mogelijkheden:</p><ul><li>De betaalde elementen vervangen door gratis elementen die er ongeveer hetzelfde uitzien.</li><li>Een screenshot maken en daaruit alleen je poster uitsnijden, zoals je in hoofdstuk 1 geleerd hebt.</li><li>Bij Delen een link delen in plaats van een gedownload bestand, zodat je docent je ontwerp online bekijkt.</li></ul><p>' +
        'Lever je poster daarna in en vraag je docent hoe dat inleveren op jouw school precies gaat.'],
      media('https://www.youtube.com/embed/oVH6Qu9HEZ4', 'Starten met Canva: account maken en downloaden', 'Welke stap uit de video ging bij jou anders dan in het stappenplan van de opdracht, en hoe loste je dat op?'),
      [
        {
          vraag: 'Deeltoets 8.1, 8.2 en 8.3. Maak eerst de negen vragen hieronder die met Deeltoets beginnen, zonder terug te lezen. Hoeveel van die negen had je goed, en welke gingen er mis?',
          antwoord: 'Reken een vraag pas goed als jouw antwoord alle onderdelen bevat die in het opengeklapte antwoord staan; een half antwoord telt als fout. Zeven of meer goed: je gaat gewoon door met deze paragraaf en doet verderop het plusspoor bij Extra plus. Zes of minder goed: doe verderop eerst het steunspoor bij Extra steun en lees de theorieblokken terug die bij je gemiste vragen horen. De vier vragen na de deeltoets zijn de gewone startvragen van deze paragraaf.',
          uitleg: 'Deze deeltoets levert geen cijfer op maar een route, en daarom staat hij hier: het programmeerdeel van dit hoofdstuk is af en in deze paragraaf stap je over op ontwerpen. Bij elke vraag staat in de uitleg wat je terugleest als hij misging. Wat hier blijft liggen komt pas weer terug in de eindtoets, en dan is het te laat om het rustig bij te werken.'
        },
        {
          vraag: 'Deeltoets vraag 1. Wat is een algoritme? Geef de omschrijving in één zin.',
          antwoord: 'Een stappenplan: een rij instructies die precies zegt hoe je van begin naar resultaat komt.',
          uitleg: 'Ging deze mis, lees dan theorieblok A van 8.1 terug. Let op het woord precies: een stap die ruimte laat voor eigen invulling is nog geen instructie.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Deeltoets vraag 2. Waarom moet je een dagelijkse handeling in kleinere stappen opschrijven dan je zelf nodig hebt?',
          antwoord: 'Omdat een computer niets zelf invult; elke handeling die jij overslaat, gebeurt bij hem gewoon niet.',
          uitleg: 'Ging deze mis, kijk dan naar je eigen algoritme uit de praktijkopdracht van 8.1 en naar de stap waarop je tester vastliep.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Deeltoets vraag 3. Wat is het verschil tussen een herhaling en een keuze in een stappenplan?',
          antwoord: 'Een herhaling voert dezelfde stappen meerdere keren uit; een keuze kijkt naar een voorwaarde en gaat daarna de ene of de andere kant op.',
          uitleg: 'Ging deze mis, lees dan theorieblok B van 8.1 terug. De herhaling gaat over hoe vaak, de keuze over of het gebeurt of niet.',
          leerdoel: DOEL.herhaalKeuze
        },
        {
          vraag: 'Deeltoets vraag 4. Wat is een sprite, en wat is een script in Scratch?',
          antwoord: 'Een sprite is het figuur op het speelveld dat jouw opdrachten uitvoert; een script is de stapel blokken die je onder elkaar klikt.',
          uitleg: 'Ging deze mis, lees dan theorieblok A van 8.2 terug. Het script is jouw programma, de sprite is degene die het uitvoert.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'Deeltoets vraag 5. Welk blok start je script, en wat schuif je in een als-dan-blok?',
          antwoord: 'Het gele blok "wanneer op de groene vlag wordt geklikt" start het script; in het als-dan-blok schuif je een voorwaarde.',
          uitleg: 'Ging deze mis, lees dan theorieblok B van 8.2 terug en kijk daarna naar het screenshot van je eigen script.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Deeltoets vraag 6. Vertel in drie zinnen na wat jouw eigen Scratch-programma doet, van boven naar beneden.',
          antwoord: 'Bijvoorbeeld: het start bij de groene vlag, de herhaling laat de kat doorlopen en aan de rand omkeren, en het als-dan-blok laat hem daarbij Boing roepen.',
          uitleg: 'Ging deze mis, pak dan je uitlegtekst uit de praktijkopdracht van 8.2 erbij. Navertellen betekent de volgorde van je blokken volgen, niet je bedoeling beschrijven.',
          leerdoel: DOEL.navertellen
        },
        {
          vraag: 'Deeltoets vraag 7. Je programma start wel maar beweegt niet. Welke drie dingen controleer je, en in welke volgorde?',
          antwoord: 'Eerst het startblok, dan de volgorde van de blokken, en daarna of het beweegblok wel binnen de herhaling ligt.',
          uitleg: 'Ging deze mis, lees dan theorieblok A van 8.3 terug. Testen is van buiten naar binnen werken: eerst of het start, dan pas waar het misgaat.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Deeltoets vraag 8. Wat is een bug, en wat betekent debuggen?',
          antwoord: 'Een bug is een fout waardoor je programma iets anders doet dan bedoeld; debuggen is het opsporen en herstellen van zo\'n fout.',
          uitleg: 'Ging deze mis, lees dan theorieblok B van 8.3 terug. Een bug is niet hetzelfde als een programma dat helemaal niet start; ook een programma dat wél draait kan een bug hebben.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Deeltoets vraag 9. Een klasgenoot geeft je drie tips tegelijk. Waarom voer je die niet in één keer allemaal door?',
          antwoord: 'Omdat je dan niet weet welke tip het probleem oploste, en de andere twee ondertussen nieuwe fouten kunnen geven.',
          uitleg: 'Ging deze mis, kijk dan naar je testverslag uit 8.3 en naar de regel dat je één ding tegelijk verandert en daartussen test.',
          leerdoel: DOEL.feedback
        },
        {
          vraag: 'Je opent een programma dat je nog nooit gebruikt hebt. Waar op het beginscherm kijk je als eerste, en waarom juist daar?',
          antwoord: 'Meestal naar de zoekbalk en naar een duidelijke knop om iets nieuws te beginnen, want daarmee kom je overal.',
          uitleg: 'Bijna elk ontwerpprogramma zet dezelfde vier dingen op het beginscherm: zoeken, iets nieuws starten, je eerdere werk en je voorraad sjablonen. Die homepagina is precies wat je ziet zodra je bent ingelogd.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Met welk mailadres meld jij je aan voor schoolwerk, en waarom niet met je privémail?',
          antwoord: 'Met je schoolmail, omdat je werk dan bij je schoolaccount hoort en je docent je erop kan bereiken.',
          uitleg: 'Je schoolmail ken je uit hoofdstuk 1. Alles wat je met dat adres maakt blijft aan school gekoppeld, ook als je van device wisselt.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Denk aan een poster die je in de gang hebt zien hangen. Welke onderdelen zag je erop, en wat maakte de titel goed leesbaar?',
          antwoord: 'Meestal een grote titel, een afbeelding en een korte tekst, met een achtergrondkleur die genoeg verschilt van de letterkleur.',
          uitleg: 'Tekst, beeld en kleur zijn precies de drie dingen die je straks zelf op je poster zet. Te weinig kleurverschil maakt een titel onleesbaar.',
          leerdoel: DOEL.starten
        },
        {
          vraag: 'Je hebt iets online gemaakt en moet het inleveren. Welke manieren ken je om zo een bestand bij je docent te krijgen?',
          antwoord: 'Bijvoorbeeld downloaden en uploaden in de leeromgeving, meesturen als bijlage in een mail, of een link delen.',
          uitleg: 'In hoofdstuk 1 leverde je een screenshot in; dat is dezelfde route. Onthoud dat een link een volwaardig alternatief is.',
          leerdoel: DOEL.delen
        }
      ],
      {
        tekst: 'Opdracht 1: maak je eerste A4-poster. Maak eerst je account in zeven stappen.</p><ol><li>Ga naar www.canva.nl.</li><li>Klik rechtsboven op Registreren.</li><li>Kies hoe je een account maakt: met e-mail, en dan gebruik je je schoolmail, dus niet je privémail.</li><li>Vul je voornaam, achternaam en wachtwoord in en klik op Doorgaan.</li><li>Controleer je e-mail en klik op de link om te bevestigen, of vul de code in.</li><li>Ga terug naar Canva, kies Inloggen en vul je gegevens in.</li><li>Je komt terecht op de homepagina van Canva.</li></ol><p>Niet gelukt? Kijk de video verderop in deze paragraaf. Bouw daarna je poster in negen stappen.</p><ol><li>Klik op de grote plus aan de linkerkant.</li><li>Er opent een nieuw scherm; typ bovenin de zoekbalk poster en klik op “poster staand, A3”. Je leest hier dus A3 en niet A4, en dat klopt: het is dezelfde staande poster, alleen twee keer zo groot.</li><li>Nu opent een lege poster; links zie je de menu’s Ontwerpen, tekst, elementen, uploads en meer.</li><li>Voeg een tekst toe: ga naar tekst, kies een stijl die je mooi vindt en zet die in het midden van je poster; je bepaalt zelf de titel, maximaal vijf woorden.</li><li>Ga naar elementen en kies iets dat bij jouw tekst past; hoeveel plaatjes, iconen of vormen je toevoegt mag je zelf weten.</li><li>Klik op een wit gedeelte voor het kleurwieltje en kies een achtergrondkleur waarbij je de tekst nog makkelijk kunt lezen, of pas anders je tekstkleur aan.</li><li>Canva slaat automatisch op.</li><li>Experimenteer verder met tekst, afbeeldingen en vormen: met de rechtermuisknop kun je een element via het prullenbakje verwijderen, en met de rechtermuisknop en dan “laag” naar voren of naar achteren brengen.</li><li>Klaar? Klik rechtsboven op Delen en daarna op Downloaden, als PNG of PDF. Lukt downloaden niet door betaalde elementen, vervang ze dan, maak een screenshot waaruit je alleen je poster uitsnijdt, of deel een link.</li></ol><p>Lever je poster in en vraag je docent hoe dat gaat. Opdracht 2: verder oefenen. Je hebt opdracht 1 ingeleverd en de basis van Canva geoefend. Goed gedaan! Ga met de knop Canva linksboven terug naar de homepagina, klik weer op de plus en kies nu zelf wat je maakt. Je mag alles gebruiken: templates, elementen en teksten. Je mag een video proberen te maken, een website, een poster, een flyer of iets anders; je bepaalt het helemaal zelf. Download ook dit project als PNG of PDF en lever het in bij de docent; ook hier gelden dezelfde drie uitwegen als downloaden niet lukt. Oefen daarna thuis nog even met inloggen, want volgende les moet je zonder hulp in Canva kunnen werken.',
        label: 'Lever je twee ontwerpen in en schrijf hier op welke stap je het langst bezig was.',
        modelAnswer: 'Een voldoende inzending bestaat uit twee bestanden. Het eerste is de A4-poster uit opdracht 1, bijvoorbeeld "poster-veiliginternet-Jayden-1C.png", met een staande poster, een titel van hooguit vijf woorden in het midden, minstens één element dat bij die titel past en een achtergrondkleur waarbij de titel goed leesbaar blijft. Het tweede is een zelfgekozen ontwerp uit opdracht 2, bijvoorbeeld een flyer of een korte video, ook als PNG of PDF. Lukte downloaden niet, dan is er een uitgesneden screenshot of een gedeelde link, met de reden erbij.',
        nakijkpunten: [
          'Je account is met je schoolmail gemaakt en je kunt zelfstandig inloggen.',
          'De poster is staand, heeft een titel van maximaal vijf woorden en minstens één passend element.',
          'De titel blijft leesbaar tegen de gekozen achtergrondkleur.',
          'Beide ontwerpen zijn ingeleverd als PNG of PDF, of via een van de drie uitwegen.'
        ]
      },
      ['Waarvoor gebruik je Canva?', 'Welke vier onderdelen staan op het beginscherm?', 'Welk mailadres gebruik je bij het registreren?', 'Hoe zet je een element naar de achtergrond?', 'In welke twee bestandsformaten download je je poster?'],
      'Ontwerp tegen de klok: kies template, tekst, element en kleur die het best bij de opdracht passen.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg aan iemand die Canva niet kent uit wat het is, en noem daarbij de vier onderdelen van de homepagina.',
            antwoord: 'Canva is een online ontwerptool voor posters, flyers en presentaties; op de homepagina staan de zoekbalk, de plusknop links, je eerdere ontwerpen en de toegang tot templates en uploads.',
            uitleg: 'Online betekent dat je niets installeert en er op elke computer bij kunt. Die vier onderdelen zijn je vaste kaart: zoeken, nieuw beginnen, verder werken en materiaal halen.',
            leerdoel: DOEL.account
          },
          {
            groep: 'samen',
            vraag: 'Een klasgenoot maakte zijn Canva-account met zijn eigen Gmail. Welke twee problemen kan hij daardoor krijgen?',
            antwoord: 'Zijn werk hangt niet aan zijn schoolaccount, en op een schoolcomputer kan hij er niet zomaar bij.',
            uitleg: 'De school ziet en beheert alleen wat aan het schoolaccount hangt. Met een privéadres raak je bovendien je werk kwijt zodra je dat adres niet meer gebruikt.',
            leerdoel: DOEL.account
          },
          {
            groep: 'zelf',
            vraag: 'Je titel valt weg in een donkere foto op de achtergrond. Noem twee manieren om dat op te lossen.',
            antwoord: 'De achtergrondkleur lichter maken met het kleurwieltje, of de tekstkleur veranderen naar wit.',
            uitleg: 'Leesbaarheid komt van verschil tussen letter en ondergrond. Je kunt dus aan twee kanten draaien: de ondergrond of de letter.',
            leerdoel: DOEL.starten
          },
          {
            groep: 'zelf',
            vraag: 'Een plaatje ligt over je titel heen. Welke stappen zet je om de titel weer bovenop te krijgen?',
            antwoord: 'Rechtermuisknop op het plaatje, dan "laag", en dan naar achteren; of rechtermuisknop op de titel en naar voren.',
            uitleg: 'Lagen bepalen wie voor wie staat. Het maakt niet uit welk van de twee je verschuift, zolang de titel maar bovenaan eindigt.',
            leerdoel: DOEL.starten
          },
          {
            groep: 'steun',
            vraag: 'Steunspoor na de deeltoets. Had je zes of minder van de negen goed? Begin hier: schrijf per gemiste vraag op welk leerdoel het was en bij welke paragraaf het hoort.',
            antwoord: 'Vraag 1, 2 en 3 horen bij 8.1; vraag 4, 5 en 6 bij 8.2; vraag 7, 8 en 9 bij 8.3. Lees precies die theorieblokken terug voordat je verdergaat met Canva.',
            uitleg: 'Terugbladeren op gevoel kost veel tijd en levert weinig op. Door eerst het gemiste doel op te schrijven weet je precies welk stuk tekst je nodig hebt. Programmeren is bovendien niet afgesloten: kerndoel 22B komt terug in de eindtoets en in de plusparagraaf 8.7.',
            leerdoel: DOEL.testen
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: je downloadt je ontwerp via de knop ... en daarna ..., en je kiest ... of PDF.',
            antwoord: 'Via de knop Delen en daarna Downloaden, en je kiest PNG of PDF.',
            uitleg: 'Delen staat rechtsboven en is dus de ingang voor alles wat het ontwerp verlaat: downloaden én een link delen zitten allebei daar.',
            leerdoel: DOEL.delen
          },
          {
            groep: 'plus',
            vraag: 'Plusspoor na de deeltoets. Had je zeven of meer van de negen goed? Leg dan in vijf zinnen uit waarom 8.1, 8.2 en 8.3 in precies deze volgorde staan.',
            antwoord: 'Eerst bedenk je de stappen in gewone taal, dan bouw je ze in blokken, en pas daarna kun je testen of ze doen wat je bedoelde.',
            uitleg: 'Zonder stappenplan weet je niet wat je moet bouwen, en zonder werkend programma weet je niet wat je moet testen. Dezelfde volgorde zie je in deze paragraaf bij het ontwerpen: eerst bedenken, dan maken, dan controleren of het bij een ander overkomt.',
            leerdoel: DOEL.navertellen
          },
          {
            groep: 'plus',
            vraag: 'Je hebt vijf betaalde elementen gebruikt en de les is bijna om. Welke uitweg kies je, en wat is het nadeel ervan?',
            antwoord: 'Een link delen gaat het snelst; het nadeel is dat je docent online moet kijken en jij geen bestand in handen hebt.',
            uitleg: 'Vervangen kost tijd maar levert een echt bestand op, een uitgesneden screenshot verliest kwaliteit, en een link is snel maar hangt af van je Canva-account.',
            leerdoel: DOEL.delen
          }
        ]
      }),

    p('8.5', 'Eindopdracht: poster met Canva en AI', ['22A', '21D', '23C'], 'staande A4-poster over een eigen onderwerp, gemaakt met AI-informatie in eigen woorden', 100, 'Posterlab',
      ['Informatie halen bij een chatbot en er zelf iets van maken',
        'In deze eindopdracht laat je zien wat je geleerd hebt over AI en hoe je een mooie poster maakt in Canva. Je gebruikt een chatbot, bijvoorbeeld TalkAI, om informatie en ideeën over jouw onderwerp te verzamelen. De opdracht heeft vier doelen die je docent straks nakijkt:</p><ul><li>Je laat zien dat je een chatbot kunt gebruiken om iets over je onderwerp te weten te komen.</li><li>Je laat zien dat je die chatbot een goede prompt kunt geven en niet zomaar een losse zoekterm.</li><li>Je zet de informatie van de chatbot om in gegevens die bruikbaar zijn voor je poster.</li><li>Je maakt in Canva een poster die er goed uitziet en die zijn boodschap overbrengt.</li></ul><p>' +
        'Een goede prompt bestaat uit vier onderdelen: de opdracht, het onderwerp, de doelgroep en de lengte. Dat zijn dezelfde vier die je in paragraaf 7.3 geleerd hebt, en ze werken hier precies zo. Uit hoofdstuk 7 komt er nog een losse tip bij die vaak helpt: geef de chatbot vooraf een rol. Die rol is geen vijfde onderdeel, maar een extra zinnetje dat de toon van het antwoord stuurt. Wat er terugkomt neem je nooit zomaar over: je controleert het, kort het in en schrijft het in eigen woorden op. Anders staat er tekst op je poster die niet van jou is en die je bovendien niet kunt uitleggen. Je kiest je onderwerp uit een lijst van negen, en die lijst staat volledig in de praktijkopdracht hieronder. Kies er een die je echt interesseert, want daar schrijf je merkbaar makkelijker een pakkende titel bij.'],
      ['Wat een goede poster is, en waarom die regels werken',
        'Een poster wordt in een paar seconden bekeken, dus alles wat hem druk maakt werkt tegen je. Aan een goede poster zie je vijf dingen:</p><ul><li>Hij is leesbaar, wat betekent dat de teksten niet wegvallen in foto’s of in de achtergrond.</li><li>Hij is niet te druk, dus er staan niet te veel plaatjes en niet te veel losse tekstjes op.</li><li>Hij is aantrekkelijk om naar te kijken door een mooie kleur, een duidelijke titel en een pakkend plaatje.</li><li>Hij maakt in een oogopslag duidelijk waar hij over gaat en zet de kijker aan tot actie. Voorbeelden van actie zijn een ticket kopen, naar een website gaan, een enquête in laten vullen of iets verkopen.</li><li>Hij gebruikt geen plaatjes of teksten van iemand anders zonder toestemming; alles wat in Canva zelf zit mag je wel gebruiken.</li></ul><p>' +
        'Die vijf kenmerken komen uit één gegeven: je lezer loopt door en kiest zelf of hij stopt. Daarom werken ook de vijf tips uit de opdracht. Grote letters winnen die paar seconden, want wat je van een meter afstand leest wordt gelezen. Korte tekst werkt om dezelfde reden: niemand blijft voor een poster staan lezen. Twee of drie kleuren houden het rustig, want elke extra kleur vraagt aandacht die je titel nodig heeft. Witruimte is geen verspilling maar de stilte waarin je boodschap opvalt. Een icoon dat bij je onderwerp past vertelt iets; een leuk plaatje kost alleen ruimte. De zes voorwaarden staan in de opdracht, en zonder die zes krijg je geen punten.'],
      [
        media('https://www.youtube.com/embed/qYys36TLtuA', '3 tips om je eigen poster te ontwerpen', 'Welke van de vijf posterkenmerken uit deze paragraaf zie je in de video terug, en welke tip uit de video staat er juist niet bij?'),
        media('https://talkai.info/', 'TalkAI: de chatbot uit de eindopdracht', 'Schrijf de prompt op waarmee jij begint, en beoordeel daarna of het antwoord bruikbaar is voor je poster.')
      ],
      [
        {
          vraag: 'In hoofdstuk 7 gaf je een chatbot een prompt. Welke vier onderdelen hoorden daarin te staan?',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte van het antwoord dat je terug wilt.',
          uitleg: 'Hoe preciezer die vier zijn, hoe bruikbaarder het antwoord. Een losse zoekterm levert een algemeen verhaal op.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Waarom mag je een tekst van internet niet letterlijk overnemen in je eigen werkstuk?',
          antwoord: 'Omdat de tekst niet van jou is en je hem meestal ook niet kunt uitleggen als iemand ernaar vraagt.',
          uitleg: 'Dit leerde je in paragraaf 1.4 over bronnen. Overnemen mag alleen met bronvermelding; op een poster schrijf je het liever zelf.',
          leerdoel: DOEL.eigenWoorden
        },
        {
          vraag: 'Noem een poster of een reclame die jou is bijgebleven. Wat zorgde ervoor dat jij hem echt gelezen hebt?',
          antwoord: 'Bijvoorbeeld een grote duidelijke titel, weinig tekst, rustige kleuren en één plaatje dat meteen opviel.',
          uitleg: 'Wat jou opviel is precies wat de vijf kenmerken van een goede poster beschrijven: leesbaar, rustig en aantrekkelijk.',
          leerdoel: DOEL.ontwerp
        }
      ],
      {
        tekst: 'Aan de slag met de eindopdracht. Werk deze acht stappen op volgorde af en vink ze af terwijl je bezig bent.</p><ol><li>Open Canva en log in met de gegevens die je vorige les hebt aangemaakt.</li><li>Klik op de plus, typ poster in en kies daarna een staande poster.</li><li>Kies een onderwerp uit deze negen: cyberpesten; online shoppen op Temu, Shein of AliExpress en de gevaren; achteraf betalen en de risico’s daarvan; de voordelen of nadelen van AI en chatbots; veilig internetten; privacy online; digitaal gezond blijven; nepnieuws herkennen; de invloed van social media op jongeren.</li><li>Verzamel met een chatbot informatie over dat onderwerp en bewaar je prompt en het antwoord, want die lever je mee in.</li><li>Schrijf de informatie om naar je eigen woorden en kort hem in tot korte, bondige zinnen.</li><li>Zorg dat je poster aan alle zes de voorwaarden voldoet: hij heeft een duidelijke titel; hij bevat minstens één afbeelding of symbool; hij bevat minstens twee tekstvakken met uitleg of tips in korte en bondige zinnen; hij gaat over één onderwerp uit de lijst; hij bevat informatie die je met AI hebt verzameld en naar je eigen woorden hebt aangepast; en hij is een staande poster. Voldoe je hier niet aan, dan kun je geen punten voor je poster krijgen.</li><li>Loop deze vijf tips na: gebruik grote letters voor de titel, zodat iemand hem van een meter afstand nog leest; houd de tekst kort en krachtig, want niemand blijft voor een poster staan lezen; gebruik maximaal twee of drie kleuren die goed bij elkaar passen; laat witruimte over, want een poster hoeft niet vol te staan om iets te zeggen; gebruik iconen of afbeeldingen die passen bij je onderwerp en dus niet zomaar een leuk plaatje.</li><li>Download je project als PNG of PDF en lever het in bij de docent; lukt dat niet door betaalde elementen, vervang ze dan, maak een uitgesneden screenshot of deel een link.</li></ol><p>Lever samen met je poster een half A4 in waarop je prompt staat, het antwoord van de chatbot, en jouw herschreven tekst, zodat je docent kan zien wat je zelf gedaan hebt.',
        label: 'Lever je staande poster en je half A4 in, en schrijf hier welke zin je het sterkst herschreven hebt.',
        modelAnswer: 'Een voldoende inzending is een staande poster met bijvoorbeeld de titel "Stop met scrollen, start met slapen", een icoon van een telefoon en twee tekstvakken met elk drie korte tips over digitaal gezond blijven. Op het bijgeleverde half A4 staat de prompt "Je geeft voorlichting op een school. Geef vijf korte tips om digitaal gezond te blijven voor leerlingen van twaalf jaar, elke tip maximaal vijftien woorden", daaronder het antwoord van de chatbot, en daaronder de eigen versie. Die eigen versie luidt bijvoorbeeld "Leg je telefoon een uur voor het slapen weg" in plaats van "Het wordt aanbevolen mobiele apparaten voorafgaand aan de nachtrust te vermijden".',
        nakijkpunten: [
          'De prompt bevat opdracht, onderwerp, doelgroep en lengte, en het chatbotantwoord is meegeleverd.',
          'Je postertekst is aantoonbaar herschreven in je eigen woorden en je kunt hem uitleggen.',
          'De poster voldoet aan alle zes de voorwaarden uit de opdracht.',
          'De poster volgt minstens vier van de vijf tips voor een rustige en leesbare poster.'
        ]
      },
      ['Waarvoor gebruik je de chatbot in deze opdracht?', 'Waarom herschrijf je het antwoord in eigen woorden?', 'Wanneer is een poster leesbaar?', 'Waarom laat je witruimte over?', 'Aan welke zes voorwaarden moet je poster voldoen?'],
      'Beoordeel andermans posters op leesbaarheid, drukte en actie, en repareer de zwakste in drie zetten.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Vergelijk twee prompts: "cyberpesten" en "Geef vier tips tegen cyberpesten voor brugklassers, elk maximaal twintig woorden". Welke werkt beter?',
            antwoord: 'De tweede, want die noemt de opdracht, het onderwerp, de doelgroep en de lengte van het antwoord.',
            uitleg: 'Bij de eerste prompt moet de chatbot alles zelf gokken en krijg je een algemeen verhaal terug. De tweede levert meteen tekst die op een poster past.',
            leerdoel: DOEL.chatbot
          },
          {
            groep: 'zelf',
            vraag: 'Herschrijf deze chatbotzin voor een poster: "Het is raadzaam om terughoudend te zijn met het delen van persoonsgegevens."',
            antwoord: 'Bijvoorbeeld: "Deel je adres en telefoonnummer nooit online."',
            uitleg: 'Kort, in gewone woorden en met een concreet voorbeeld erbij. Zo kun je hem ook echt uitleggen als je docent ernaar vraagt.',
            leerdoel: DOEL.eigenWoorden
          },
          {
            groep: 'zelf',
            vraag: 'Een poster heeft zeven plaatjes, vijf kleuren en een titel van twaalf woorden. Noem drie dingen die je zou veranderen.',
            antwoord: 'Terug naar één of twee plaatjes, naar hooguit drie kleuren, en de titel inkorten tot een paar woorden.',
            uitleg: 'Alle drie de wijzigingen dienen hetzelfde doel: rust. Een poster wordt in seconden bekeken, dus alles wat afleidt kost je lezers.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een goede poster is leesbaar, niet te ..., en laat genoeg ... over.',
            antwoord: 'Een goede poster is leesbaar, niet te druk, en laat genoeg witruimte over.',
            uitleg: 'Deze drie woorden dekken samen de vijf kenmerken. Leesbaar gaat over de letters, druk over de hoeveelheid, witruimte over de rust ertussen.',
            leerdoel: DOEL.ontwerp
          },
          {
            groep: 'plus',
            vraag: 'Je poster mag informatie van AI bevatten, maar geen plaatjes van iemand anders zonder toestemming. Waarom is dat geen tegenspraak?',
            antwoord: 'Omdat je de AI-informatie zelf herschrijft en de plaatjes uit Canva komen, waarvoor de toestemming al geregeld is.',
            uitleg: 'Het gaat om wie het werk gemaakt heeft en of je het mag gebruiken. Herschreven tekst is van jou, en Canva-elementen zijn met licentie geleverd.',
            leerdoel: DOEL.eigenWoorden
          }
        ]
      }),

    checkpoint('8.6', 'Checkpoint: terugblik en jouw digitale creatie', ['22A', '23C', '21D'], 'eindcreatie in Canva, Word of PowerPoint met een geschreven terugblik', 150, 'Terugblik Challenge',
      ['Terugblikken op een heel leerjaar',
        'Je bent aan het einde gekomen van de lessen over digitale geletterdheid, en dat is een prestatie. Deze afsluiting is veel groter dan een gewone paragraaf, dus je docent verdeelt hem over ongeveer drie lesuren. Voordat je je eindcreatie maakt kijk je eerst terug, want reflecteren maakt kennis pas echt van jou. Beantwoord daarom deze vier vragen in het tekstvak van de praktijkopdracht verderop in deze paragraaf:</p><ol><li>Wat is je het meest bijgebleven van de lessen over digitale geletterdheid?</li><li>Wat heb je geleerd dat je nog niet wist en waarmee je nu blij bent dat je het weet?</li><li>Van welk onderwerp zou je meer willen weten, maar werd er in de lessen niet genoeg over gesproken?</li><li>Heb je nu genoeg tips gekregen om jezelf veilig te houden op internet, en waarom wel of niet?</li></ol><p>' +
        'Vergelijk je antwoorden daarna met die van je buurman, buurvrouw of een klasgenoot. Schrijf op welke verschillen je opvallen tussen jouw antwoorden en die van de ander. Juist die verschillen zijn interessant, want ze laten zien dat iedereen dit leerjaar iets anders uit dezelfde lessen haalde. Het helpt om er een naam bij te noemen: wat wist jouw buurman al wat voor jou nieuw was?'],
      ['Jouw digitale creatie: drie routes naar hetzelfde bewijs',
        'Voor je eindcreatie krijg je vijfentwintig minuten en kies je een van drie opties, die allemaal even zwaar tellen. Optie A is een Canva-poster over een onderwerp dat jij interessant vond, zoals veilig internet, AI of nepnieuws. Optie B is een Word-verslag van één A4 waarin je terugblikt op deze lessen. Daarin gebruik je de opmaak uit hoofdstuk 4: koppen, vetgedrukte woorden en paginanummering onderaan de bladzijde. Optie C is een korte PowerPoint van drie dia’s over jouw favoriete onderwerp uit deze lessen. Wil je die presentatie ook echt voor de klas geven, dan mag dat van je docent. Welke eisen bij welke optie horen staat per optie uitgeschreven in de praktijkopdracht hieronder. Daarna volgt het inleveren, waar vijf minuten voor staat: lever de opdracht in zoals de docent je heeft uitgelegd. Het lesmateriaal waaruit dit hoofdstuk komt is van DaCapo College, gemaakt door Jennifer Leijen, Sander Theunissen, Gerdien Dohmen en Mirko Ensinck. Het is gedeeld onder de Creative Commons-licentie CC BY 4.0, te vinden op creativecommons.org/licenses/by/4.0/. Die versie is voor het laatst gewijzigd op 28 oktober 2025 om 19.14 uur. Die licentie zegt dat je het werk mag kopiëren, verspreiden en bewerken, mits je de maker noemt. Dat je die bron noemt is precies wat je in paragraaf 1.4 geleerd hebt.'],
      [
        media('https://www.youtube.com/embed/pdVvcAav_Jk', 'Wat is digitale geletterdheid?', 'De video verdeelt digitale geletterdheid in een paar onderdelen. Zoek bij elk onderdeel een hoofdstuk uit dit jaar dat erover ging, en noem het onderdeel waar jij het minst over weet.'),
        media('https://www.youtube.com/embed/z9z7RLIc4u8', 'Een poster ontwerpen met Canva', 'Kies je optie A? Noem dan één handeling uit de video die niet in het stappenplan van 8.4 stond en die jij gaat gebruiken.')
      ],
      [
        {
          vraag: 'Zelftest over het hele hoofdstuk. Hieronder staan zeventien Diagnose-vragen: een zelftest die laat zien welke leerdoelen al zitten. Maak ze eerst zelf, zonder terug te lezen. Hoeveel had je er goed, en welke leerdoelen bleken nog niet te zitten?',
          antwoord: 'Reken een vraag pas goed als jouw antwoord alle onderdelen bevat die in het opengeklapte antwoord staan; een half antwoord telt als fout. Bij elke vraag staat in de uitleg welk theorieblok, welk gameblok of welk eigen product je terugpakt als hij misging. Werk die eerst weg en maak daarna pas de eindtoets.',
          uitleg: 'Deze ronde staat bewust voor de herhaling en niet erna, want zo weet je wat je moet herhalen. Hij levert geen cijfer en geen tokens op: het is een zeef en geen prestatie. Elk doel krijgt hier een eigen vraag, omdat een steekproef juist de doelen ongemoeid laat die je nog niet beheerst. Diagnose 16 en 17 zijn tegelijk de gewone startvragen van deze paragraaf zelf. De vijftien vragen ervoor kijken terug naar 8.1 tot en met 8.5. De knip ligt bij twaalf. Had je twaalf of minder goed, ga dan naar het herstelspoor bij Extra steun. Had je er dertien of meer goed, kies daar dan het verdiepingsspoor bij Extra plus. Iedereen komt zo in precies een van de twee sporen terecht.'
        },
        {
          vraag: 'Diagnose 1. Wat is een algoritme, en waarom weegt de volgorde van de stappen net zo zwaar als de stappen zelf?',
          antwoord: 'Een algoritme is een stappenplan; dezelfde handelingen in een andere volgorde geven een ander resultaat, zoals eerst beleggen en dan smeren.',
          uitleg: 'Gemist? Lees theorieblok A van 8.1 terug en speel het gameblok Stappen Sorteren van die paragraaf.',
          leerdoel: DOEL.algoritme
        },
        {
          vraag: 'Diagnose 2. Noem twee stappen die mensen bijna altijd vergeten als ze een dagelijkse handeling opschrijven.',
          antwoord: 'Bijvoorbeeld het pakken van het gereedschap vooraf, en het controleren achteraf of het gelukt is.',
          uitleg: 'Gemist? Pak je eigen algoritme uit de praktijkopdracht van 8.1 erbij en kijk waar je tester vastliep.',
          leerdoel: DOEL.stappen
        },
        {
          vraag: 'Diagnose 3. Schrijf één herhaling en één keuze met een voorwaarde op in gewone taal.',
          antwoord: 'Bijvoorbeeld: herhaal twintig keer, doe een stap. En: als het regent, dan pak je een jas, anders pak je een pet.',
          uitleg: 'Gemist? Lees theorieblok B van 8.1 terug; let vooral op wat de voorwaarde is en waarom die waar of niet waar moet kunnen zijn.',
          leerdoel: DOEL.herhaalKeuze
        },
        {
          vraag: 'Diagnose 4. Wat is het voordeel van blokken boven getypte code als je net begint?',
          antwoord: 'Je kunt geen tikfout maken en de vorm van een blok laat zien wat eronder past, dus je aandacht gaat naar de logica.',
          uitleg: 'Gemist? Lees theorieblok A van 8.2 terug en bekijk het screenshot van je eigen script.',
          leerdoel: DOEL.bouwen
        },
        {
          vraag: 'Diagnose 5. Welke voorwaarde schoof jij in je als-dan-blok, en wat gebeurde er als die niet waar was?',
          antwoord: 'Bijvoorbeeld "raak ik (rand)?"; was die niet waar, dan werd het blok binnenin die ronde gewoon overgeslagen.',
          uitleg: 'Gemist? Lees theorieblok B van 8.2 terug en kijk de video "Als...dan | Blokkenseries Scratch" nog eens bij die paragraaf.',
          leerdoel: DOEL.gebruiken
        },
        {
          vraag: 'Diagnose 6. Vertel je eigen programma na in drie zinnen, van het bovenste blok naar het onderste.',
          antwoord: 'Bijvoorbeeld: het start bij de groene vlag, de herhaling laat de kat lopen en aan de rand omkeren, en het als-dan-blok laat hem daarbij Boing roepen.',
          uitleg: 'Gemist? Lees je eigen uitlegtekst uit de praktijkopdracht van 8.2 terug en vergelijk hem met de volgorde van je blokken.',
          leerdoel: DOEL.navertellen
        },
        {
          vraag: 'Diagnose 7. Hoe test je een programma zo dat je ook de fout vindt die je zelf niet verwachtte?',
          antwoord: 'Door vooraf op te schrijven wat er zou moeten gebeuren en daarna ook de wegen te proberen die je niet bedacht had.',
          uitleg: 'Gemist? Lees theorieblok A van 8.3 terug en pak je testplan uit het testverslag erbij.',
          leerdoel: DOEL.testen
        },
        {
          vraag: 'Diagnose 8. Wat is een bug, en waarom is een foutmelding eerder hulp dan straf?',
          antwoord: 'Een bug is een fout waardoor je programma iets anders doet dan bedoeld; een melding zegt vaak precies waar het misging.',
          uitleg: 'Gemist? Lees theorieblok B van 8.3 terug en speel het gameblok Bugjacht van die paragraaf.',
          leerdoel: DOEL.bug
        },
        {
          vraag: 'Diagnose 9. Je klasgenoot geeft vier tips. Hoe verwerk je die zonder het overzicht kwijt te raken?',
          antwoord: 'Eén tip tegelijk doorvoeren en daartussen testen, zodat je per verandering weet welk effect ze had.',
          uitleg: 'Gemist? Lees de twee slotregels van je testverslag uit 8.3 terug, waarin staat wat je overnam en wat niet.',
          leerdoel: DOEL.feedback
        },
        {
          vraag: 'Diagnose 10. Met welk mailadres maak je je Canva-account, en welke stap komt na het registreren?',
          antwoord: 'Met je schoolmail. Daarna bevestig je via de link of de code in je mail, en pas dan kun je inloggen.',
          uitleg: 'Gemist? Lees theorieblok A van 8.4 terug en loop de zeven aanmeldstappen uit de praktijkopdracht na.',
          leerdoel: DOEL.account
        },
        {
          vraag: 'Diagnose 11. Hoe kom je van de homepagina bij een lege staande poster met een leesbare titel erop?',
          antwoord: 'Klik op de plus, typ poster, kies "poster staand, A3", zet er tekst op en kies een achtergrondkleur die genoeg verschilt.',
          uitleg: 'Gemist? Lees theorieblok B van 8.4 terug; let op dat Canva dit formaat A3 noemt terwijl de opdracht A4-poster zegt.',
          leerdoel: DOEL.starten
        },
        {
          vraag: 'Diagnose 12. Noem de knoppen waarmee je je ontwerp downloadt, en de twee bestandsformaten.',
          antwoord: 'Rechtsboven Delen, daarna Downloaden, en je kiest PNG of PDF.',
          uitleg: 'Gemist? Lees het slot van theorieblok B van 8.4 terug, inclusief de drie uitwegen bij betaalde elementen.',
          leerdoel: DOEL.delen
        },
        {
          vraag: 'Diagnose 13. Uit welke vier onderdelen bestaat een bruikbare prompt voor je poster?',
          antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte van het antwoord dat je terug wilt krijgen.',
          uitleg: 'Gemist? Lees theorieblok A van 8.5 terug en kijk naar de prompt op het half A4 dat je bij je poster inleverde.',
          leerdoel: DOEL.chatbot
        },
        {
          vraag: 'Diagnose 14. Waarom zet je een chatbotantwoord in je eigen woorden op je poster?',
          antwoord: 'Omdat de tekst anders niet van jou is, je hem niet kunt uitleggen, en je hem niet gecontroleerd hebt op fouten.',
          uitleg: 'Gemist? Lees theorieblok A van 8.5 terug en vergelijk je eigen herschreven zin met het antwoord van de chatbot.',
          leerdoel: DOEL.eigenWoorden
        },
        {
          vraag: 'Diagnose 15. Noem drie van de vijf kenmerken van een goede poster.',
          antwoord: 'Bijvoorbeeld: hij is leesbaar, hij is niet te druk, en hij zet de kijker aan tot een actie.',
          uitleg: 'Gemist? Lees theorieblok B van 8.5 terug en loop de vijf tips na op je eigen ingeleverde poster.',
          leerdoel: DOEL.ontwerp
        },
        {
          vraag: 'Diagnose 16. Noem twee dingen uit hoofdstuk 1 tot en met 7 die jij nu anders doet op internet dan vorig jaar, en zeg waar je dat merkt.',
          antwoord: 'Bijvoorbeeld: je gebruikt nu langere wachtwoorden, en je controleert eerst de URL omdat een slotje geen bewijs is dat een webshop klopt.',
          uitleg: 'Gemist? Lees hieronder theorieblok A van deze paragraaf en beantwoord de vier terugblikvragen alsnog in het tekstvak van de praktijkopdracht. Gedrag is het beste bewijs van leren: wat je alleen weet maar nooit doet, is vaak toch niet echt geland.',
          leerdoel: DOEL.terugblik
        },
        {
          vraag: 'Diagnose 17. Je laat je kennis van dit jaar zien in een eigen product. Welke drie programma\'s uit dit jaar kun je daarvoor gebruiken, en waarin is elk sterk?',
          antwoord: 'Canva voor een poster, Word voor een verslag en PowerPoint voor een presentatie; een poster is sterk in een boodschap, een verslag in uitleg en een presentatie in stappen.',
          uitleg: 'Gemist? Lees hieronder theorieblok B van deze paragraaf, waar de drie opties met hun eisen staan, en kijk terug naar hoofdstuk 4 voor Word en PowerPoint en naar 8.4 voor Canva.',
          leerdoel: DOEL.creatie
        }
      ],
      {
        tekst: 'Maak je eindcreatie en lever hem in met je terugblik. Deel 1, de terugblik: beantwoord in een tekstvak of Word-bestand de vier terugblikvragen uit de theorie, vergelijk je antwoorden met die van een klasgenoot en schrijf in twee zinnen op welke verschillen je opvielen. Deel 2, de creatie: kies optie A, B of C. Optie A is een Canva-poster over een onderwerp dat jij interessant vond, bijvoorbeeld veilig internet, AI of nepnieuws; gebruik minstens drie afbeeldingen, voeg een tekstkader met uitleg toe en bedenk een pakkende titel. Optie B is een Word-verslag van één A4 waarin je terugblikt: beschrijf wat je geleerd hebt, wat je leuk vond en waar je meer over wilt leren, voeg minstens één afbeelding toe en gebruik opmaak met koppen, vetgedrukte woorden en paginanummering. Optie C is een PowerPoint van drie dia’s over jouw favoriete onderwerp: geef elke dia een titel, voeg afbeeldingen toe en zet bij elke dia een korte uitleg; wil je presenteren, dan mag dat. Deel 3, het inleveren: lever je terugblik en je creatie samen in zoals je docent heeft uitgelegd, en noem onderaan de bron van het lesmateriaal waarop je hebt gewerkt.',
        label: 'Lever je terugblik en je eindcreatie in, en schrijf hier welke optie je koos en waarom.',
        modelAnswer: 'Een voldoende inzending bevat een terugblik met concrete antwoorden op alle vier de vragen, bijvoorbeeld: "Het meest is me bijgebleven dat een deepfake met gewone software gemaakt wordt, want daardoor vertrouw ik filmpjes niet meer blind. Mijn buurvrouw noemde phishing, dat wist ik al wel, maar zij wist niet dat een slotje geen garantie is." Daarbij hoort een creatie die aan alle eisen van de gekozen optie voldoet, bijvoorbeeld een PowerPoint van drie dia’s over nepnieuws, elk met een titel, een passende afbeelding en drie regels uitleg, en onderaan de laatste dia de bronvermelding van DaCapo College met de CC BY 4.0-licentie.',
        nakijkpunten: [
          'Alle vier de terugblikvragen zijn concreet beantwoord, en de vergelijking met een klasgenoot staat erbij.',
          'De gekozen optie voldoet aan alle eisen die bij die optie horen.',
          'Je creatie laat inhoudelijk zien wat jij dit jaar geleerd hebt.',
          'Onderaan staat de bron van het lesmateriaal vermeld.'
        ]
      },
      ['Wat is een algoritme?', 'Waar gebruik je een herhaling voor?', 'Wat schuif je in een als-dan-blok?', 'Wat is een bug?', 'Wat betekent debuggen?', 'Met welk mailadres maak je je Canva-account?', 'Hoe download je een Canva-ontwerp?', 'Wanneer is een poster leesbaar?', 'Waarom schrijf je AI-informatie in eigen woorden over?', 'Welke drie opties heb je voor je eindcreatie?', 'Waaraan herken je een phishingbericht?', 'Waarom is een lang wachtwoord sterker dan een kort ingewikkeld wachtwoord?'],
      'Loop in vijf kamers je hele jaar langs: een algoritme, een bug, een ontwerp, een prompt en je eigen terugblik.',
      true,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Een klasgenoot schrijft bij de terugblik alleen "ik heb veel geleerd". Waarom telt dat niet, en hoe maak je het bruikbaar?',
            antwoord: 'Het noemt niets concreets; het wordt bruikbaar zodra hij zegt wat hij precies leerde en waar hij dat merkt.',
            uitleg: 'Reflecteren betekent het verschil tussen toen en nu benoemen. "Ik controleer nu de afzender van een mail" is bewijs, "ik heb veel geleerd" niet.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'zelf',
            vraag: 'Jij kiest optie B, het Word-verslag. Welke drie opmaakeisen moet je verslag hebben, en waar leerde je die?',
            antwoord: 'Koppen, vetgedrukte woorden en paginanummering; die opmaak leerde je in hoofdstuk 4 bij Word.',
            uitleg: 'Deze eisen zijn geen versiering: koppen geven structuur, vet legt nadruk en paginanummers houden een verslag in volgorde.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'zelf',
            vraag: 'Je wilt in je eindcreatie laten zien dat je nepnieuws kunt herkennen. Welke optie past daar het best bij en waarom?',
            antwoord: 'Bijvoorbeeld optie C, omdat je op drie dia’s een voorbeeld, de kenmerken en de controle netjes uit elkaar kunt halen.',
            uitleg: 'De optie moet passen bij wat je wilt bewijzen. Een poster is sterk in één boodschap, een verslag in uitleg, en een presentatie in stappen.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'steun',
            vraag: 'Herstelspoor. Had je twaalf of minder van de zeventien diagnosevragen goed? Zet je gemiste vragen op een rij en werk ze weg voordat je de eindtoets maakt.',
            antwoord: 'Diagnose 1 tot en met 3 horen bij 8.1, 4 tot en met 6 bij 8.2, 7 tot en met 9 bij 8.3, 10 tot en met 12 bij 8.4, 13 tot en met 15 bij 8.5, en 16 en 17 bij deze paragraaf zelf.',
            uitleg: 'Herhalen werkt alleen als het gericht is. Lees per gemiste vraag alleen het theorieblok dat in de uitleg genoemd staat, maak daarna de bijbehorende oefening uit die paragraaf opnieuw, en controleer jezelf met de diagnosevraag.',
            leerdoel: DOEL.terugblik
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: je maakt een ..., je vergelijkt je antwoorden met een klasgenoot, en daarna volgt het ...',
            antwoord: 'Je maakt een eindcreatie, je vergelijkt je antwoorden met een klasgenoot, en daarna volgt het inleveren.',
            uitleg: 'Dit zijn de drie delen van deze les op volgorde: terugblikken en vergelijken, dan maken, en dan inleveren zoals je docent uitlegt.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'plus',
            vraag: 'Verdiepingsspoor. Had je dertien of meer van de zeventien diagnosevragen goed? Leg dan in zes zinnen uit wat programmeren uit 8.1 tot 8.3 en ontwerpen uit 8.4 en 8.5 met elkaar gemeen hebben.',
            antwoord: 'Allebei bedenk je eerst wat er moet gebeuren, maak je het daarna, en test je vervolgens of het bij een ander overkomt zoals jij bedoelde.',
            uitleg: 'Een programma test je door het uit te voeren, een poster door hem aan iemand te laten zien die je onderwerp niet kent. In beide gevallen is de maker de slechtste beoordelaar, omdat hij zijn eigen bedoeling al kent. Dat is precies waarom feedback van een klasgenoot in dit hele hoofdstuk terugkomt.',
            leerdoel: DOEL.creatie
          },
          {
            groep: 'plus',
            vraag: 'Waarom moet je onder je eindcreatie de bron van het lesmateriaal noemen, ook als je alles zelf hebt geschreven?',
            antwoord: 'Omdat het materiaal onder CC BY 4.0 is gedeeld, en die licentie vraagt dat je de maker noemt.',
            uitleg: 'Bij CC BY mag je kopiëren, verspreiden en bewerken, maar altijd met naamsvermelding. Dat is dezelfde regel als bij bronnen in paragraaf 1.4.',
            leerdoel: DOEL.terugblik
          }
        ]
      }),

    p('8.7', 'Plus: van blokken naar echte code', ['22B'], 'vergelijking van hetzelfde programma in blokken en in tekstcode', 100, 'Van Blok naar Code',
      ['Een variabele is een doosje met een naam',
        'Zodra een programma iets moet onthouden tijdens het spelen, heb je een variabele nodig. Een variabele is een plek in het geheugen met een naam, waarin je een waarde bewaart die kan veranderen. Denk aan een schoolbord met het woord score erop: het bord blijft staan, maar het getal wis je steeds. In een spel gebruik je bijvoorbeeld een variabele die score heet en die bij elke gevangen bal met een omhooggaat. Zo een variabele noem je ook wel een teller, omdat hij precies bijhoudt hoe vaak iets gebeurde. Je herkent er meteen twee dingen aan die je uit de vorige paragrafen al kent. De teller hoort bijna altijd binnen een herhaling, want elke ronde telt hij er iets bij op. En de waarde wordt vaak gebruikt in een keuze: als de score groter is dan tien, dan win je. Geef een variabele altijd een naam die zegt wat erin zit, dus score of aantalLevens en niet x of ding. Over een week weet jij zelf namelijk ook niet meer waar die x precies voor stond.'],
      ['Dezelfde logica, andere schrijfwijze',
        'Wie in Scratch een herhaling en een keuze kan bouwen, kan hetzelfde in getypte tekstcode. In Python, de taal waar de meeste scholen na Scratch naartoe gaan, staat in plaats van een oranje lus gewoon "for i in range(10):". Een als-dan-blok wordt daar "if score > 10:", met de blokken die erbinnen hoorden eronder ingesprongen. De logica is dus precies dezelfde, en alleen de schrijfwijze verandert. Die schrijfwijze heet de syntaxis: de regels waaraan je tekst moet voldoen voordat de computer hem begrijpt. Daar zit ook meteen de moeilijkheid, want een vergeten dubbele punt levert al een foutmelding op. Blokken kunnen daarentegen nooit verkeerd passen, omdat hun vorm de onmogelijke combinaties uitsluit. Toch werken programmeurs bijna allemaal met tekstcode, en daar zijn goede redenen voor. Tekst typ je sneller dan dat je blokken sleept, en je kunt erin zoeken en vervangen over duizenden regels tegelijk. Je kunt bovendien twee versies naast elkaar leggen om te zien wat er precies veranderd is. En een programma van miljoenen regels zou in blokvorm domweg nooit op je scherm passen.'],
      [
        media('https://www.youtube.com/embed/6qef6zKyaSA', 'Scratch les 3: variabelen', 'De maker geeft zijn variabele een naam en een startwaarde. Welke naam kiest hij, en waarom zou een naam als "ding" hem later in de weg zitten?'),
        media('https://www.youtube.com/embed/P9uSfaqJX60', 'Leren programmeren in Python: variabelen', 'Je ziet dezelfde variabele nu als getypte tekst in plaats van als blok. Schrijf op welk Scratch-blok uit de vorige video hetzelfde doet, en welk teken in de Python-regel je in Scratch nergens tegenkomt.')
      ],
      [
        {
          vraag: 'Hoe zou een spel kunnen onthouden hoeveel punten jij al verzameld hebt, en waar bewaart de computer dat?',
          antwoord: 'In een plek in het geheugen met een naam, bijvoorbeeld score, waarin een getal staat dat steeds verandert.',
          uitleg: 'Een programma vergeet alles wat het niet ergens neerzet. Die genoemde bewaarplek is precies wat een variabele is.',
          leerdoel: DOEL.variabele
        },
        {
          vraag: 'Heb je ooit echte programmacode gezien, bijvoorbeeld in een film of op een website? Waarin verschilde die van Scratch-blokken?',
          antwoord: 'Het was getypte tekst met haakjes, dubbele punten en inspringingen in plaats van gekleurde blokken die vastklikken.',
          uitleg: 'Het verschil zit in de vorm, niet in wat het doet. Dezelfde herhaling en dezelfde keuze staan er, alleen als tekst.',
          leerdoel: DOEL.vergelijken
        },
        {
          vraag: 'Wat gaat sneller: een regel typen of vijf blokjes slepen? Wat betekent jouw antwoord voor een programma van duizend regels?',
          antwoord: 'Typen gaat sneller, en bij duizend regels wordt slepen onwerkbaar traag en past het niet meer op je scherm.',
          uitleg: 'Deze rekensom is precies de reden waarom beroepsprogrammeurs met tekst werken, ook al leren ze vaak met blokken.',
          leerdoel: DOEL.waaromTekst
        }
      ],
      {
        tekst: 'Vergelijk je eigen programma in twee schrijfwijzen. Stap 1: breid het Scratch-programma uit paragraaf 8.2 uit met een variabele, bijvoorbeeld een score die bij elke botsing met een omhooggaat. Stap 2: bouw er een keuze bij die de variabele gebruikt, bijvoorbeeld: als de score groter is dan tien, zeg dan "gewonnen". Stap 3: maak een screenshot van je blokken. Stap 4: schrijf ernaast in Word dezelfde drie regels in Python-achtige tekstcode, bijvoorbeeld score = 0, score = score + 1 en if score > 10: print("gewonnen"). Stap 5: zet in een tabel van twee kolommen elk blok naast zijn regel tekst. Stap 6: schrijf er acht tot tien regels bij waarin je uitlegt wat er hetzelfde blijft, wat er verandert door de syntaxis, en waarom programmeurs ondanks die extra regels toch met tekst werken. Wil je meer voorbeelden van hetzelfde blok naast dezelfde regel Python, kijk dan op de overzichtspagina "Van Scratch naar Python" op https://roc.ovh/books/software-development-20252627/page/van-scratch-naar-python. Dit is een vrijwillige plusopdracht: hij telt niet mee voor de hoofdstuktoets, maar hij levert wel tokens op.',
        label: 'Lever je tabel met uitleg in en schrijf hier in twee zinnen wat er hetzelfde blijft tussen blok en code.',
        modelAnswer: 'Een voldoende inzending bevat een tabel met links "maak score 0" en rechts "score = 0", links "verander score met 1" en rechts "score = score + 1", en links "als score > 10 dan zeg gewonnen" en rechts "if score > 10: print(\'gewonnen\')". De uitleg eronder zegt bijvoorbeeld: "De volgorde en de logica blijven hetzelfde; alleen moet ik in Python zelf de dubbele punt en de inspringing typen, en in Scratch doet de vorm van het blok dat voor mij. Programmeurs kiezen toch tekst, omdat ze erin kunnen zoeken en met heel grote programma\'s kunnen werken."',
        nakijkpunten: [
          'De variabele wordt buiten de herhaling ingesteld en binnen de herhaling opgehoogd.',
          'Elk blok staat in de tabel naast de bijbehorende regel tekstcode.',
          'De uitleg benoemt zowel wat hetzelfde blijft als wat de syntaxis toevoegt.'
        ]
      },
      ['Wat is een variabele?', 'Waarvoor gebruik je een teller?', 'Wat is syntaxis?', 'Wat blijft hetzelfde tussen blokken en tekstcode?', 'Waarom werken programmeurs met tekst?'],
      'Leg blok en coderegel naast elkaar en koppel elk Scratch-blok aan de juiste regel Python.',
      {
        optioneel: true,
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Waarom zet je "maak score 0" buiten de herhaling en "verander score met 1" erbinnen?',
            antwoord: 'Omdat de score maar één keer op nul hoeft, terwijl het ophogen elke ronde opnieuw moet gebeuren.',
            uitleg: 'Zet je het nulzetten binnen de lus, dan begint de teller elke ronde weer bij nul en telt hij dus nooit verder dan één.',
            leerdoel: DOEL.variabele
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf het blok "herhaal 10 keer" op als regel Python, en zeg erbij welk teken je niet mag vergeten.',
            antwoord: 'for i in range(10): en je mag de dubbele punt aan het eind niet vergeten.',
            uitleg: 'Die dubbele punt hoort bij de syntaxis: hij zegt dat wat eronder ingesprongen staat binnen de herhaling valt.',
            leerdoel: DOEL.vergelijken
          },
          {
            groep: 'zelf',
            vraag: 'Noem twee redenen waarom een professionele programmeur liever tekstcode dan blokken gebruikt.',
            antwoord: 'Je kunt in tekst zoeken en vervangen over duizenden regels, en grote programma’s passen in blokvorm niet op je scherm.',
            uitleg: 'Beide redenen gaan over schaal. Bij twintig blokken merk je het verschil niet; bij twintigduizend regels is het beslissend.',
            leerdoel: DOEL.waaromTekst
          },
          {
            groep: 'steun',
            vraag: 'Vul aan: een ... bewaart een waarde die kan veranderen, en de schrijfregels van een taal heten de ...',
            antwoord: 'Een variabele bewaart een waarde die kan veranderen, en de schrijfregels heten de syntaxis.',
            uitleg: 'Variabele gaat over wat je bewaart, syntaxis over hoe je het opschrijft. Die twee woorden dekken deze hele plusparagraaf.',
            leerdoel: DOEL.variabele
          },
          {
            groep: 'plus',
            vraag: 'Een leerling zegt: "Python is moeilijker dan Scratch, dus je leert er andere dingen." Klopt dat, en waarom wel of niet?',
            antwoord: 'Nee. Je leert dezelfde logica; alleen de schrijfwijze is strenger, want je typt de structuur nu zelf.',
            uitleg: 'Herhaling, keuze en variabele blijven precies hetzelfde. Wat erbij komt is de syntaxis, en dat is een extra eis en geen nieuw denkbeeld.',
            leerdoel: DOEL.waaromTekst
          }
        ]
      })
  ]
};
