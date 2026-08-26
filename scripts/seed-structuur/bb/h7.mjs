// Hoofdstuk 7 - Kunstmatige intelligentie en chatbots.
// Basisberoepsgerichte leerweg (bb).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   7.1 en 7.2  <- les 16 "Kunstmatige Intelligentie (AI)"
//   7.3         <- les 17 "Een chatbot gebruiken"
//   7.5         <- toegevoegd checkpoint, geen Wikiwijs-bron
//
// 7.4 en 7.6 staan hier NIET in. 7.4 valt volgens het jaarplan weg voor basis en
// 7.6 is de vrijwillige plusparagraaf van de theoretische leerweg. Bb telt in
// dit hoofdstuk dus VIER paragrafen: 7.1, 7.2, 7.3 en 7.5.
//
// WAAR DE STOF VAN 7.4 GEBLEVEN IS
// --------------------------------
// 7.4 heet in tl en kb "Kritisch met chatbots: hallucinatie en veilig gebruik".
// Die paragraaf schrijven we hier niet, maar de bron mag niet verdwijnen en het
// tweede leerdoel van het checkpoint ("een prompt schrijven en het antwoord
// kritisch beoordelen") kan er niet zonder. Daarom:
//   - het woord hallucinatie en de regel "controleer het altijd zelf" staan in
//     7.3 theorieblok B, kort en met een voorbeeld;
//   - opdracht 3 van les 17 (dolfijn en haai, met de drie controlevragen) staat
//     als stap 3 in de praktijkopdracht van 7.3, op de plek waar de bron hem
//     ook zet: tussen opdracht 2 en opdracht 4;
//   - opdracht 5 van les 17 (zelf denken, de zeven prompttips, maximaal 300
//     woorden en de drie slotvragen) en de slotcontrole van het Word-document
//     staan in de praktijkopdracht van 7.5;
//   - het drieluik "Klopt dit helemaal? Hoe weet je dat? Kun je dit controleren
//     op een andere website?" staat in 7.5 theorieblok B als vast lijstje;
//   - de verdiepingsopdracht van les 16 (AI in het onderwijs, met de video
//     kwHKzSek8ws en de meningsvraag) staat als stap 4 in de praktijkopdracht
//     van 7.5 en als tweede mediablok daar.
// Er verdwijnt op die manier geen onderwerp, geen opdracht, geen stap en geen
// link; alleen het aparte lesuur 7.4 vervalt.
//
// VORM: DIT IS DE HARDE EIS VAN DEZE LEERWEG
// ------------------------------------------
// Voor bb geldt: vorm gaat voor inhoud. Concreet in dit bestand:
//   - zinnen van hooguit tien tot twaalf woorden, een idee per zin. Waar de bron
//     een rijtje geeft (de gevaren van AI, de kenmerken van AI-beeld, de bekende
//     chatbots, de vier promptonderdelen, de Word-opmaak, de zeven prompttips)
//     staat dat als <ul>, want een lijstje lees je met je ogen;
//   - theorieblokken zijn in alinea's van vier of vijf zinnen geknipt;
//   - er staan NEGEN mediablokken in: 7.1 heeft er twee, 7.2 drie, 7.3 twee en
//     7.5 twee. Elk mediablok heeft een korte kijkvraag. Waar uitleg in beeld
//     kan, staat hij niet in tekst;
//   - de praktijkopdrachten zijn opgeknipt in genummerde doe-taakjes van twee
//     tot tien minuten, met per taakje wat je precies inlevert;
//   - het oefenblok heeft per paragraaf acht korte opgaven, verdeeld over samen,
//     zelf, steun en plus; het checkpoint heeft er zestien, waarvan elf de
//     diagnostische ronde vormen;
//   - elk begrip krijgt een voorbeeld uit hun eigen wereld: TikTok, Snapchat,
//     een game, een puppy, een verslag over gezond eten.
//
// WAAR DE BRON GEBLEVEN IS (er is niets weggelaten)
// -------------------------------------------------
// Les 16:
//   - de omschrijving van AI, gezichtsherkenning en het TikTok-algoritme
//     -> theorieblok 1 van 7.1;
//   - de robotafbeelding bij "Daarom denken mensen bij AI al snel aan dit soort
//     robots" -> de foto ASIMO in theorieblok 1 van 7.1, met bijschrift;
//   - "in werkelijkheid is het gewoon een computerprogramma"
//     -> slot van theorieblok 1 van 7.1;
//   - leren van ervaringen, de zelfrijdende auto en het leren van data
//     -> theorieblok 2 van 7.1;
//   - de gescoorde bronvraag "Kan AI zelf denken als het zelf kan leren?"
//     -> quizvraag in 7.1 (zie scripts/seed-verrijking/bb/h7.mjs);
//   - de video QJE_ycgR8E8 met de bronvraag "Wie kan uit zichzelf leren?"
//     -> eerste mediablok van 7.1, met die vraag als kijkvraag, en als quizvraag;
//   - de voordelen van AI (snel patronen zoeken, de arts en de scan, de
//     muziek-app, zoekmachines, filters op Instagram of Snapchat)
//     -> theorieblok 1 van 7.2;
//   - de gevaren (privacyprobleem, deepfakes, verdwijnende beroepen)
//     -> theorieblok 1 van 7.2, als lijstje;
//   - de bronvraag "Noem een situatie waarin AI een positief effect heeft op ons
//     dagelijks leven" -> eerste samen-opgave van 7.2 en stap 1 van de
//     praktijkopdracht van 7.2;
//   - AI-afbeeldingen, de draak op het skateboard en de zes vingers
//     -> theorieblok 2 van 7.2;
//   - de vier punten over hoe AI-beeld gemaakt wordt, inclusief de discussie of
//     het wel mag -> theorieblok 2 van 7.2 en de plus-opgave van 7.2;
//   - de bronvraag "Waarom dragen betere plaatjes bij aan meer verspreiding van
//     Fake News?" -> open quizvraag in 7.2;
//   - de bronvraag "Is het verstandig om al jouw persoonlijke gegevens te delen
//     met AI?" -> quizvraag in 7.2;
//   - Siri, Google Home, Alexa, ChatGPT en de zoekbalk van Google
//     -> lijstje in theorieblok 2 van 7.1;
//   - de video rd-iIfbd07I met de bronvraag "Kunnen deze fouten gevaarlijk
//     zijn?" -> eerste mediablok van 7.2 en een open quizvraag daar;
//   - de opdracht met This Person Does Not Exist en de twee kenmerken
//     -> tweede mediablok van 7.2 en stap 2 van de praktijkopdracht van 7.2;
//   - de alinea "Chatbots" (teksten schrijven, vragen beantwoorden, helpen met
//     ideeen) -> theorieblok 1 van 7.3;
//   - "Docenten kunnen controleren of je AI hebt gebruikt ... AI schrijft
//     minder menselijk ... systemen om dit te kunnen controleren"
//     -> slot van theorieblok 2 van 7.3, en als waar-niet-waar in de quiz van
//     7.3 (zie scripts/seed-verrijking/bb/h7.mjs);
//   - "je mag ChatGPT wel om hulp vragen en het in je eigen woorden overnemen"
//     -> theorieblok 2 van 7.3 en stap 5 van de praktijkopdracht van 7.3;
//   - de bronvraag "Wat vind jij het grootste voordeel van AI?" -> stap 3 van de
//     praktijkopdracht van 7.2;
//   - de bronvraag "Gebruik jij zelf AI, denk je?" -> stap 2 van de
//     praktijkopdracht van 7.1;
//   - de bronvraag "Waarom moet je voorzichtig zijn met het gebruik van AI?"
//     -> quizvraag in 7.2;
//   - de afsluitzin "Je hebt geleerd wat AI betekent..." -> theorieblok 1 van 7.5;
//   - de verdieping "Invloed van AI op het onderwijs" met video kwHKzSek8ws en de
//     meningsvraag -> tweede mediablok en stap 4 van de praktijkopdracht van 7.5.
// Les 17:
//   - wat een chatbot is en de twee soorten -> theorieblok 1 van 7.3;
//   - de bekende chatbots met GPT-3.5, GPT-4, Gemini (voorheen Bard), Copilot,
//     Meta AI en TalkAI -> lijstje in theorieblok 1 van 7.3;
//   - de video z1O3PPhi9Zc -> eerste mediablok van 7.3;
//   - "deel nooit je persoonlijke informatie" en het uploaden van foto's
//     -> theorieblok 1 van 7.2 en de startcheck van 7.3;
//   - de vier onderdelen van een goede prompt en het voorbeeld over hart en
//     longen -> theorieblok 2 van 7.3;
//   - de bronvraag "Hoe noemen we de opdracht die je geeft aan een chatbot?"
//     -> quizvraag in 7.3;
//   - de bronvraag "Waarom mag je je persoonlijke gegevens niet delen met de
//     chatbot?" -> de open startvraag in de startcheck van 7.2 ("Een chatbot
//     vraagt naar je adres. Geef je dat?"), met twee gesloten quizvragen
//     daarachter in dezelfde paragraaf;
//   - opdracht 1 en 2 (TalkAI, Chatbot_JouwVoornaam.docx) -> stap 1 en 2 van de
//     praktijkopdracht van 7.3;
//   - opdracht 3 (dolfijn en haai, hallucinatie, de drie controlevragen)
//     -> stap 3 van de praktijkopdracht van 7.3;
//   - "Hoe kan een chatbot zoveel weten?" -> slot van theorieblok 1 van 7.3;
//   - de bronvraag "Maken chatbots fouten?" -> toetsvraag in 7.5;
//   - opdracht 4 (verslag gezond eten, eigen woorden, Word-opmaak)
//     -> stap 4 van de praktijkopdracht van 7.3;
//   - opdracht 5 (zelf denken, zeven prompttips, maximaal 300 woorden, de drie
//     slotvragen) en de slotcontrole -> stap 2 en 3 van de praktijkopdracht
//     van 7.5;
//   - de samenvatting van les 17 -> samenvatting van 7.3 en theorieblok 1 van 7.5;
//   - de link https://talkai.info/ -> tweede mediablok van 7.3.
//
// EEN BRONZIN DIE HIER GECORRIGEERD WORDT
// ---------------------------------------
// Les 16 schrijft over AI-beeld: "De foto's/afbeeldingen die AI gebruikt, voegt
// hij samen tot een nieuw beeld." Zo werkt een beeldmodel niet: er wordt niets
// aan elkaar geplakt. Theorieblok 2 van 7.2 zegt daarom in vier korte zinnen wat
// er wel gebeurt: het model heeft geleerd hoe een hand eruitziet en bouwt zelf
// een nieuw beeld op, zonder ooit te controleren of het klopt. Dat is precies de
// verklaring voor de zes vingers, dus de leerling heeft er iets aan.
//
// PARAGRAAF 7.5 IS TOEGEVOEGD
// ---------------------------
// 7.5 heeft geen Wikiwijs-bron. De inhoud is in eigen woorden geschreven en
// leunt naast les 16 en 17 op de publieke lespagina van Kennisnet over
// schoolafspraken rond generatieve AI:
// https://www.kennisnet.nl/artificial-intelligence/schoolafspraken-over-het-gebruik-van-generatieve-ai/
// (gecontroleerd op 26 augustus 2026) en op de Klokhuis-afleveringen over AI van
// Schooltv, die als mediablokken in 7.1, 7.2 en 7.5 staan.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/bb/h7.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

const FOTO_ROBOT =
  '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/ASIMO_4.28.11.jpg/960px-ASIMO_4.28.11.jpg" alt="De looprobot ASIMO van Honda: een wit, metalen wezen ter grootte van een kind, met een helmvormig hoofd, twee armen en twee benen.">';

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
      'AI-logboek met een robotplaatje, drie voorbeelden van AI en jouw eigen uitleg', 100, 'Mens of Machine',
      ['AI: een computer die taken van mensen doet',
        'AI betekent kunstmatige intelligentie. In het Engels heet dat Artificial Intelligence. Het is techniek waarmee computers taken doen. Taken die normaal alleen mensen kunnen. Denk aan leren, plannen of iets kiezen.' +
        '</p><p>' +
        'Je telefoon herkent jouw gezicht. TikTok weet welke filmpjes jij leuk vindt. Daar zit een algoritme achter. Een algoritme is een slimme volgorde van stappen. De computer volgt die stappen om te kiezen. Hoe vaker jij iets bekijkt, hoe beter het jou snapt.' +
        '</p><p>' +
        'Veel mensen zien bij het woord AI meteen een robot voor zich.' +
        '</p>' + FOTO_ROBOT + '<p>' +
        '<em>Op deze foto staat ASIMO, een looprobot van Honda uit 2011. Dit beeld zien veel mensen voor zich bij AI. ASIMO kon lopen en traplopen. Zelf bedenken wat hij moest doen kon hij niet. Foto: Wikimedia Commons, gemaakt door Vanillase, licentie CC BY-SA 3.0.</em>' +
        '</p><p>' +
        'Maar AI is gewoon een computerprogramma. Je kunt dat programma in een robot stoppen. De robot is dan de verpakking. De AI zit erin, net als een app op je telefoon.'],
      ['AI leert van data en denkt niet zoals jij',
        'AI kan leren van ervaring. Jij leert ook van je fouten. Een zelfrijdende auto remt een keer te laat. Die fout wordt opgeslagen. De volgende keer gaat het beter. Dat leren van voorbeelden heet machine learning.' +
        '</p><p>' +
        'AI leert van data. Data is een ander woord voor gegevens. Typ jij iets naar een chatbot? Dan gebruikt het bedrijf dat om te leren. Zo maakt een chatbot steeds minder fouten. Let op: dat gebeurt niet tijdens jouw gesprek. Het bedrijf traint de AI pas later opnieuw.' +
        '</p><p>' +
        'Denkt AI dan zoals jij? Nee. Mensen hebben gevoelens. Mensen hebben bewustzijn: je weet dat je bestaat. Mensen hebben intuitie: een gevoel dat iets klopt. AI heeft dat allemaal niet. AI begrijpt niets. AI simuleert, en dat betekent: nadoen.' +
        '</p><p>' +
        'AI zit in heel veel dingen die jij elke dag gebruikt.' +
        '</p><ul>' +
        '<li>Siri op je telefoon, of Google Home en Alexa thuis.</li>' +
        '<li>De zoekbalk van Google.</li>' +
        '<li>Chatbots zoals ChatGPT.</li>' +
        '<li>Filters op Instagram en Snapchat.</li>' +
        '<li>Je muziek-app die weet wat jij leuk vindt.</li>' +
        '</ul><p>' +
        'Ze gebruiken allemaal AI. En ze maken dus ook fouten.'],
      [
        media('https://www.youtube.com/embed/QJE_ycgR8E8', 'Kunstmatige intelligentie voor dummies in 2 minuten (RTL Z)', 'Kijk de video. Wie kan uit zichzelf leren? Kies: een systeem dat aan machine learning doet, elke computer en tv en telefoon, of alleen mensen.'),
        media('https://schooltv.nl/video-item/het-klokhuis-het-klokhuis-over-ai-wat-is-artificiele-intelligentie', 'Het Klokhuis: wat is artificiele intelligentie? (opent in een nieuw tabblad)', 'Noem twee dingen uit het filmpje waar AI in zit. Kom daarna terug naar deze pagina.')
      ],
      [
        {
          vraag: 'Voorkennis hoofdstuk 6. Wat is een deepfake? Een zin is genoeg.',
          antwoord: 'Een deepfake is een nepfilmpje of nepfoto die door een computer is gemaakt.',
          uitleg: 'Kwam je er niet uit? Lees 6.6 even terug. Je hebt dit woord in 7.2 weer nodig.'
        },
        {
          leerdoel: LD_7_1[0],
          vraag: 'Waar staan de letters AI voor? Zeg er in een zin bij wat het is.',
          antwoord: 'AI staat voor kunstmatige intelligentie. Een computer doet dan taken van mensen.',
          uitleg: 'Denk aan leren, plannen of kiezen. Dat zijn taken die vroeger alleen mensen deden.'
        },
        {
          leerdoel: LD_7_1[1],
          vraag: 'Waarvan leert een AI? Kies: van boeken lezen, van heel veel voorbeelden, of van slapen.',
          antwoord: 'Van heel veel voorbeelden. Die voorbeelden heten samen data.',
          uitleg: 'Hoe meer voorbeelden, hoe beter het gaat. Een mens leert net zo van oefenen.'
        },
        {
          leerdoel: LD_7_1[2],
          vraag: 'Noem twee apps of apparaten waar volgens jou AI in zit.',
          antwoord: 'Bijvoorbeeld TikTok en Siri. Ook de zoekbalk van Google gebruikt AI.',
          uitleg: 'Je gebruikt vaak meer AI dan je denkt. In deze paragraaf zie je een rijtje van vijf.'
        }
      ],
      {
        tekst: '<strong>Maak je AI-logboek.</strong> Open Word en maak een nieuw document. Sla het meteen op als AI_logboek_jouwvoornaam. Elke stap is een klein taakje.</p>\n' +
          '<p><strong>Stap 1. Robot of programma? (3 minuten)</strong> Kijk naar de foto van ASIMO in het eerste theorieblok. Zoek daarna zelf een plaatje van een robot. Zet dat plaatje in je document. Schrijf er een zin onder: is een robot hetzelfde als AI? Leg in die zin uit waarom wel of niet.</p>\n' +
          '<p><strong>Stap 2. Jouw AI van vandaag. (5 minuten)</strong> Gebruik jij zelf AI, denk je? Waar merk je dat aan? Noem drie dingen van vandaag waar AI in zat. Zet er per ding een zin bij waaraan je dat merkt.</p>\n' +
          '<p><strong>Stap 3. Leg het uit in twee zinnen. (3 minuten)</strong> Schrijf op wat kunstmatige intelligentie is. Gebruik in je uitleg het woord algoritme. Zet er ook bij waarvan een AI leert.</p>\n' +
          '<p><strong>Stap 4. Opslaan. (1 minuut)</strong> Sla je document op. In 7.2 werk je er verder in. Lever het dus nog niet in.',
        label: 'Beschrijf per stap kort wat je gedaan hebt. Noem bij stap 2 alle drie de voorbeelden.',
        modelAnswer: 'Stap 1. Ik heb een plaatje van een robotstofzuiger in mijn document gezet. Een robot is niet hetzelfde als AI. De robot is de verpakking. De AI is het programma dat erin zit. Een robot zonder dat programma doet niets slims. Stap 2. Ja, ik gebruik AI. 1 TikTok: mijn tijdlijn staat vol voetbal, want ik kijk dat het meest. 2 Siri: ik vraag hem hoe laat het is en hij snapt mijn stem. 3 Snapchat: ik gebruikte een filter dat mijn gezicht volgt. Stap 3. Kunstmatige intelligentie is een computerprogramma dat taken van mensen doet, zoals kiezen en leren. Er zit een algoritme achter, dus een vaste volgorde van stappen. Zo een programma leert van data, en dat zijn heel veel voorbeelden. Stap 4. Mijn bestand heet AI_logboek_Sem en staat in mijn OneDrive.',
        nakijkpunten: [
          'Er staat een robotplaatje in het document, met een zin over het verschil tussen een robot en AI.',
          'Bij stap 2 staan drie voorbeelden, elk met waaraan de leerling merkt dat het AI is.',
          'De uitleg bij stap 3 gebruikt het woord algoritme en noemt data of voorbeelden.',
          'Het bestand heet AI_logboek_voornaam en is terug te vinden.'
        ]
      },
      ['Wat betekent AI?', 'Wat is een algoritme?', 'Waarvan leert een AI?', 'Wat betekent simuleren?', 'Noem drie plekken waar AI in zit.', 'Is een robot hetzelfde als AI?'],
      'Er verschijnt steeds iets op je scherm. Kies snel: zit hier AI in, ja of nee?',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Pak samen jullie telefoon erbij. Zoek drie plekken waar AI zit. Zeg per plek waaraan je dat merkt.',
            antwoord: 'Bijvoorbeeld de tijdlijn van TikTok, het filter op Snapchat en de spraakknop van Google.',
            uitleg: 'Merk je dat het apparaat jou steeds beter kent? Dan zit er bijna altijd AI achter.',
            leerdoel: LD_7_1[2]
          },
          {
            groep: 'samen',
            vraag: 'Leg elkaar om de beurt uit wat een algoritme is. Gebruik allebei het woord stappen.',
            antwoord: 'Een algoritme is een vaste volgorde van stappen die de computer volgt om te kiezen.',
            uitleg: 'Een recept is ook een volgorde van stappen. Het verschil: de computer leert erbij.',
            leerdoel: LD_7_1[0]
          },
          {
            groep: 'samen',
            vraag: 'Een zelfrijdende auto remt te laat. Wat gebeurt er daarna met die fout? Bedenk het samen.',
            antwoord: 'De fout wordt opgeslagen. Het systeem leert ervan. De volgende keer gaat het beter.',
            uitleg: 'Zo leert AI van ervaring. Dat leren van voorbeelden heet machine learning.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Vul aan. Een AI leert van ... . Kies uit: gevoel, data, geluk.',
            antwoord: 'Een AI leert van data. Data is een ander woord voor gegevens.',
            uitleg: 'Gevoel heeft AI niet. Geluk ook niet. Alleen heel veel voorbeelden.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Noem twee dingen die een mens wel heeft en een AI niet.',
            antwoord: 'Bijvoorbeeld gevoelens en bewustzijn. Ook intuitie hoort daarbij.',
            uitleg: 'AI doet alleen na. Daarom zeggen we: AI simuleert. Het begrijpt niets.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf in twee zinnen op wat kunstmatige intelligentie is. Doe het uit je hoofd.',
            antwoord: 'Het is een computerprogramma dat taken van mensen doet, zoals kiezen en leren.',
            uitleg: 'Ophalen uit je hoofd werkt beter dan nog een keer lezen. Ook als het niet meteen lukt.',
            leerdoel: LD_7_1[0]
          },
          {
            groep: 'steun',
            vraag: 'Welke horen bij AI? Kies: Siri, een schaar, ChatGPT, een fiets, de zoekbalk van Google.',
            antwoord: 'Siri, ChatGPT en de zoekbalk van Google horen bij AI. Een schaar en een fiets niet.',
            uitleg: 'Vraag je steeds af: leert dit ding bij van wat ik doe? Een schaar doet dat nooit.',
            leerdoel: LD_7_1[2]
          },
          {
            groep: 'plus',
            vraag: 'AI simuleert. Leg met een eigen voorbeeld uit wat dat woord betekent.',
            antwoord: 'Bijvoorbeeld: een chatbot schrijft aardig, maar hij voelt niets. Hij doet aardig na.',
            uitleg: 'Nadoen kan heel echt lijken. Toch zit er geen gevoel of bedoeling achter.',
            leerdoel: LD_7_1[1]
          }
        ]
      }),

    p('7.2', 'Voordelen, gevaren en AI-beeld', ['21D', '23A', '23C'],
      'AI-check met een voordeel, een gevaar, een screenshot van een nepgezicht en twee kenmerken', 100, 'Echt of Gegenereerd',
      ['Wat AI goed kan en waar het misgaat',
        'AI kan heel handig zijn. Een computer met AI werkt sneller dan een mens. Daardoor is AI goed in het zoeken naar patronen. Artsen gebruiken AI om een ziekte te vinden op een scan. Dat kan levens redden.' +
        '</p><p>' +
        'Ook in je eigen dag helpt AI. Je muziek-app leert wat jij leuk vindt. Zoekmachines geven je snel het juiste antwoord. Ook bij het maken van filmpjes of foto\'s zie je AI terug. Denk aan de filters op Instagram of Snapchat. Steeds meer bedrijven gebruiken AI, want het werk gaat sneller.' +
        '</p><p>' +
        'Maar dat roept ook vragen op. Er zijn namelijk ook gevaren.' +
        '</p><ul>' +
        '<li>AI verzamelt persoonlijke gegevens. Dat heet een privacyprobleem.</li>' +
        '<li>Met AI maak je een deepfake: een filmpje of foto die echt lijkt maar nep is.</li>' +
        '<li>Sommige beroepen verdwijnen, want een machine doet het werk.</li>' +
        '</ul><p>' +
        'Deel daarom nooit persoonlijke gegevens met AI. Dus niet je echte naam, je adres of je nummer. Ook de gegevens van iemand anders geef je niet door. Zet geen foto\'s van jezelf of van anderen in de chat. Achter een chatbot zit een bedrijf met mensen. Je weet nooit waar jouw gegevens terechtkomen.'],
      ['Zo herken je een AI-afbeelding',
        'Je kunt met een paar woorden een plaatje laten maken. Je typt bijvoorbeeld: maak een foto van een draak op een skateboard in New York. Een paar seconden later staat het plaatje er. Het lijkt alsof iemand het echt gefotografeerd heeft. Maar die draak heeft nooit bestaan. Zo een plaatje heet een AI-afbeelding.' +
        '</p><p>' +
        'AI-beeld is moeilijk van echt te onderscheiden. Toch zie je soms dat er iets niet klopt.' +
        '</p><ul>' +
        '<li>Een hand met zes vingers.</li>' +
        '<li>Rare of scheve ogen.</li>' +
        '<li>Kleding die vreemd overloopt in de achtergrond.</li>' +
        '<li>Letters op een bordje die geen woord vormen.</li>' +
        '</ul><p>' +
        'Hoe maakt AI zo een plaatje? Het gebruikt foto\'s die het gekregen heeft. Ook zoekt het op internet naar afbeeldingen. Maar het plakt die foto\'s niet aan elkaar. Het heeft geleerd hoe een hand eruitziet. Daarna bouwt het zelf een nieuw beeld op. Het kijkt nooit na of dat klopt. Daarom gaan kleine dingen mis, zoals vingers.' +
        '</p><p>' +
        'Zo een beeld is dus gegenereerd door de computer. Toch is het gemaakt met het werk van echte makers. Daarom is er veel discussie over of dit wel mag. AI leert steeds bij. De plaatjes zien er daardoor steeds echter uit. Dat helpt nepnieuws verder de wereld in.'],
      [
        media('https://www.youtube.com/embed/rd-iIfbd07I', 'Waarom zegt AI dat je lijm op je pizza moet doen?', 'AI maakt wel eens fouten. Welke fout zie je hier? Kunnen zulke fouten gevaarlijk zijn? Antwoord in een zin.'),
        media('https://www.thispersondoesnotexist.com/', 'This Person Does Not Exist: elke keer een nieuw gezicht dat niet bestaat', 'Ververs de pagina vijf keer. Bij welk gezicht zag jij als eerste iets wat niet klopte? Je hebt deze site zo nodig bij stap 2.'),
        media('https://schooltv.nl/video-item/mag-ai-mijn-gezicht-gebruiken-het-klokhuis-over-ai-2', 'Het Klokhuis: mag AI mijn gezicht gebruiken? (opent in een nieuw tabblad)', 'Welk bezwaar tegen AI-beeld noemt deze aflevering? Kom daarna terug naar deze pagina.')
      ],
      [
        {
          vraag: 'Terugblik 7.1. Waarvan leert een AI? En denkt een AI zoals jij?',
          antwoord: 'Een AI leert van data, dus van heel veel voorbeelden. Nee, AI denkt niet zoals jij.',
          uitleg: 'AI heeft geen gevoel en geen bewustzijn. AI simuleert alleen. Zie 7.1, theorieblok 2.',
          leerdoel: LD_7_1[1]
        },
        {
          leerdoel: LD_7_2[0],
          vraag: 'Noem een ding waar AI goed voor is. Noem daarna een gevaar van AI.',
          antwoord: 'Bijvoorbeeld: een arts vindt een ziekte op een scan. Gevaar: er verdwijnen beroepen.',
          uitleg: 'AI is snel en ziet patronen. Maar het verzamelt ook gegevens over jou.'
        },
        {
          leerdoel: LD_7_2[1],
          vraag: 'Je ziet een foto van een meisje met zes vingers aan een hand. Wat denk jij dan?',
          antwoord: 'Dat de foto niet echt is. Zo een fout in de vingers hoort bij een AI-afbeelding.',
          uitleg: 'Kijk ook naar de ogen, naar de oren en naar letters op een bordje.'
        },
        {
          leerdoel: LD_7_2[2],
          vraag: 'Een chatbot vraagt naar je adres. Geef je dat? Zeg er kort bij waarom.',
          antwoord: 'Nee. Achter de chatbot zit een bedrijf. Je weet niet wie jouw adres later leest.',
          uitleg: 'Je gegevens kunnen onbedoeld in verkeerde handen komen. Dat kun je niet terugdraaien.'
        }
      ],
      {
        tekst: '<strong>Doe de AI-check.</strong> Open je bestand AI_logboek_jouwvoornaam van 7.1. Zet elke stap onder een eigen kopje.</p>\n' +
          '<p><strong>Stap 1. Een voordeel en een gevaar. (3 minuten)</strong> Noem een situatie waarin AI een positief effect heeft op ons dagelijks leven. Schrijf er een zin uitleg bij. Noem daarna een gevaar van AI. Ook daar zet je een zin uitleg bij.</p>\n' +
          '<p><strong>Stap 2. Zoek de fout in een gezicht. (7 minuten)</strong> Ga naar de website This Person Does Not Exist. Elke keer dat je de pagina ververst, zie je een nieuwe foto. Toch bestaat geen enkele persoon op die foto\'s echt. Ze zijn door AI gemaakt. Kijk goed naar de gezichten. Je mag zo vaak verversen als je wil. Zoek een foto waarop iets niet klopt. Maak er een schermafbeelding van en zet die in je document. Schrijf twee kenmerken op waaraan je kunt zien dat het beeld niet echt is.</p>\n' +
          '<p><strong>Stap 3. Jouw grootste voordeel. (3 minuten)</strong> Wat vind jij het grootste voordeel van AI? Leg in twee zinnen uit waarom je dat vindt.</p>\n' +
          '<p><strong>Stap 4. Waarom voorzichtig? (2 minuten)</strong> Schrijf in twee zinnen op waarom je geen persoonlijke gegevens deelt met AI. Noem in je antwoord minstens een gegeven dat je nooit intypt. Lever je document daarna in bij je docent.',
        label: 'Lever in: je voordeel en gevaar, je schermafbeelding met twee kenmerken, jouw grootste voordeel en je uitleg over persoonlijke gegevens.',
        modelAnswer: 'Stap 1. Voordeel: een arts vindt met AI sneller een ziekte op een scan. AI ziet patronen die een mens over het hoofd ziet, en dat kan levens redden. Gevaar: er verdwijnen beroepen, want een machine doet het werk goedkoper. Dat geeft onrust bij mensen die dat werk doen. Stap 2. Ik heb een schermafbeelding gemaakt van een man met een bril. Kenmerk 1: de linkerkant van zijn bril loopt gewoon door in zijn haar. Kenmerk 2: zijn ene oor zit veel hoger dan zijn andere oor. Ook zijn tanden zijn allemaal even breed, en dat klopt niet. Stap 3. Ik vind het grootste voordeel dat AI heel snel antwoord geeft. Als ik iets niet snap bij wiskunde, krijg ik meteen uitleg in makkelijke woorden. Daar hoef ik niet tot de volgende les op te wachten. Stap 4. Ik deel geen persoonlijke gegevens met AI, want achter de chatbot zit een bedrijf met mensen. Mijn adres, mijn telefoonnummer en foto\'s van mijzelf typ ik er dus nooit in.',
        nakijkpunten: [
          'Er staat een voordeel en een gevaar in, allebei met een zin uitleg.',
          'De schermafbeelding van een AI-gezicht staat in het document.',
          'Er staan twee kenmerken bij waaraan je ziet dat het beeld niet echt is.',
          'De uitleg over persoonlijke gegevens noemt minstens een gegeven dat je nooit intypt.'
        ]
      },
      ['Noem een voordeel van AI.', 'Noem een gevaar van AI.', 'Wat is een privacyprobleem?', 'Waaraan herken je een AI-afbeelding?', 'Waarom zien AI-plaatjes er steeds echter uit?', 'Welke gegevens deel je nooit met AI?'],
      'Twee foto\'s naast elkaar. Klik snel de AI-afbeelding aan. Je krijgt de kenmerken als hint.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Noem samen een situatie waarin AI een positief effect heeft op ons dagelijks leven.',
            antwoord: 'Bijvoorbeeld: de arts vindt een ziekte op een scan. Of je muziek-app kent jouw smaak.',
            uitleg: 'Let op wat AI beter kan dan een mens: heel snel werken en patronen zien.',
            leerdoel: LD_7_2[0]
          },
          {
            groep: 'samen',
            vraag: 'Bekijk samen een gezicht op This Person Does Not Exist. Wat valt jullie op aan de oren en het haar?',
            antwoord: 'Vaak zijn de oren niet gelijk. Haar loopt soms zomaar over in de achtergrond.',
            uitleg: 'Kijk altijd naar de randen van een beeld. Daar gaat het het vaakst mis.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'samen',
            vraag: 'Iemand zegt: een AI-plaatje is gewoon een collage van foto\'s. Wat klopt daar niet aan?',
            antwoord: 'AI plakt geen foto\'s aan elkaar. Het heeft geleerd hoe iets eruitziet en bouwt zelf een beeld.',
            uitleg: 'Daarom zit de fout in kleine dingen, zoals vingers. Bij een collage zie je knipranden.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Noem twee kenmerken waaraan je een AI-afbeelding kunt herkennen.',
            antwoord: 'Bijvoorbeeld een hand met zes vingers en letters op een bordje die geen woord vormen.',
            uitleg: 'De andere twee zijn: rare of scheve ogen, en kleding die vreemd overloopt.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Waarom verdwijnen er beroepen door AI? Antwoord in een zin.',
            antwoord: 'Omdat een machine dat werk kan doen. Er zijn dan minder mensen voor nodig.',
            uitleg: 'Dat zorgt voor onrust. Er komen ook nieuwe beroepen bij, maar niet voor iedereen.',
            leerdoel: LD_7_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Je zit in een game. Iemand vraagt via de chat naar je school. Wat doe je?',
            antwoord: 'Ik geef mijn school niet. Ik reageer niet verder en ik meld het als het doorgaat.',
            uitleg: 'Met je school en je rooster weet iemand waar jij elke dag bent. Dat houd je privé.',
            leerdoel: LD_7_2[2]
          },
          {
            groep: 'steun',
            vraag: 'Wat is een privacyprobleem? Kies: A je wachtwoord is te kort. B een bedrijf verzamelt jouw gegevens.',
            antwoord: 'B. Er is een privacyprobleem als een bedrijf gegevens over jou verzamelt.',
            uitleg: 'Vaak weet je niet eens wat er verzameld wordt. Daarom typ je zo min mogelijk in.',
            leerdoel: LD_7_2[2]
          },
          {
            groep: 'plus',
            vraag: 'Waarom is er veel discussie over of het maken van AI-beeld wel mag? Leg het uit.',
            antwoord: 'Omdat AI leert van werk van echte makers. Die makers krijgen daar niets voor.',
            uitleg: 'Denk aan een tekenaar. Zijn stijl komt terug in beelden die hij nooit gemaakt heeft.',
            leerdoel: LD_7_2[1]
          }
        ]
      }),

    p('7.3', 'Een chatbot gebruiken: een goede prompt schrijven', ['21D', '22A'],
      'Word-document Chatbot_JouwVoornaam.docx met vier opdrachten en nette opmaak', 100, 'Prompt Bouwer',
      ['Wat is een chatbot?',
        'Een chatbot is een programma waarmee je praat via tekst. Jij stelt een vraag of geeft een opdracht. De chatbot antwoordt of voert iets uit. Het lijkt alsof je met een mens praat. Maar het is een slim programma dat het beste antwoord voorspelt.' +
        '</p><p>' +
        'Een chatbot kan teksten schrijven. Hij kan vragen beantwoorden. En hij kan je helpen met ideeen. Dat laatste mag op school gewoon. Je vraagt dan om hulp en niet om je werk.' +
        '</p><p>' +
        'Er zijn twee soorten. De eerste soort is simpel en geeft vaste antwoorden. Die zie je bij de klantenservice van een webwinkel. De tweede soort denkt echt met je mee. Dat zijn de AI-chatbots hieronder.' +
        '</p><ul>' +
        '<li>ChatGPT, van het bedrijf OpenAI. GPT-3.5 is gratis, GPT-4 is slimmer maar meestal betaald.</li>' +
        '<li>Google Gemini, dat eerst Bard heette.</li>' +
        '<li>Microsoft Copilot, in Word en in de browser Edge.</li>' +
        '<li>Meta AI, in Facebook en Instagram.</li>' +
        '<li>TalkAI, een gratis chatbot voor leerlingen.</li>' +
        '</ul><p>' +
        'Versienummers en prijzen veranderen bijna elk jaar. Kijk dus zelf welke versie jij voor je hebt. De een is goed in uitleg. De ander maakt plaatjes of vat een website samen.' +
        '</p><p>' +
        'Hoe kan een chatbot zoveel weten? Hij leest geen websites op het moment dat jij vraagt. Hij is getraind op heel veel tekst uit boeken en websites. Daarmee leert hij wat waarschijnlijk een goed antwoord is. Hij kan dus ook oude of foute info geven.'],
      ['Een goede prompt schrijven en het antwoord in Word zetten',
        'De opdracht die je aan een chatbot geeft heet een prompt. Hoe duidelijker je prompt, hoe beter het antwoord. In de les staan vier punten. Wat je wil. Waar het over gaat. Voor wie het is. En eventueel in welke taal of stijl. Wij vullen altijd deze vier vaste onderdelen in.' +
        '</p><ul>' +
        '<li>De opdracht: leg uit, maak een lijstje, of vat samen.</li>' +
        '<li>Het onderwerp: waar moet het precies over gaan?</li>' +
        '<li>De doelgroep: voor wie is het? Bijvoorbeeld een kind van 12.</li>' +
        '<li>De lengte: 5 zinnen, kort, of 100 woorden.</li>' +
        '</ul><p>' +
        'Taal en stijl zijn een vijfde keuze. Zo ziet een goede prompt eruit: leg in makkelijke taal uit wat het verschil is tussen een hart en longen, in 5 zinnen, voor een leerling van 12 jaar.' +
        '</p><p>' +
        'Soms verzint een chatbot iets. Dat gebeurt als hij het niet zeker weet. Dat verzinnen heet hallucinatie. Controleer een antwoord dus altijd zelf. Zoek het na op een website die je vertrouwt.' +
        '</p><p>' +
        'Het antwoord zet je netjes in Word. Gebruik de opmaak die je eerder geleerd hebt.' +
        '</p><ul>' +
        '<li>Een titel bovenaan.</li>' +
        '<li>Lettertype Arial of Calibri.</li>' +
        '<li>Tekstgrootte 11 of 12.</li>' +
        '<li>Moeilijke begrippen dikgedrukt.</li>' +
        '</ul><p>' +
        'Schrijf een tekst voor school altijd in je eigen woorden over. Kopieren mag niet, hulp vragen mag wel. Van zelf overschrijven leer je bovendien meer.'],
      [
        media('https://www.youtube.com/embed/z1O3PPhi9Zc', 'Weer een nieuwe versie van ChatGPT, leerkrachten zien meer fraude (Hart van Nederland)', 'Dit nieuwsitem is uit maart 2023. Welk probleem op school noemt de docent in het filmpje?'),
        media('https://talkai.info/', 'TalkAI: de gratis chatbot die je bij de opdracht gebruikt', 'Kies de Nederlandstalige chatbot. Een account maken hoeft niet. Waar typ je je prompt, en waar komt het antwoord?')
      ],
      [
        {
          vraag: 'Terugblik 7.2. Je gaat zo met een chatbot werken. Welke gegevens typ je er nooit in?',
          antwoord: 'Mijn echte naam, mijn adres en mijn telefoonnummer. Gegevens van anderen ook niet.',
          uitleg: 'Zet er ook geen foto\'s van jezelf of van anderen in. Zie 7.2, theorieblok 1.',
          leerdoel: LD_7_2[2]
        },
        {
          leerdoel: LD_7_3[0],
          vraag: 'Noem twee chatbots die jij kent. Zeg er per chatbot bij waar je hem tegenkomt.',
          antwoord: 'Bijvoorbeeld ChatGPT op internet en Meta AI in Instagram. Copilot zit in Word.',
          uitleg: 'In deze paragraaf staat een rijtje van vijf. TalkAI gebruik je zo bij de opdracht.'
        },
        {
          leerdoel: LD_7_3[1],
          vraag: 'Je wil uitleg over de VAR bij voetbal. Schrijf op wat jij aan de chatbot vraagt.',
          antwoord: 'Bijvoorbeeld: leg uit hoe de VAR werkt bij voetbal, in 5 zinnen, voor iemand van 12.',
          uitleg: 'Zo een opdracht heet een prompt. Straks leer je welke vier onderdelen erin horen.'
        },
        {
          leerdoel: LD_7_3[2],
          vraag: 'Je plakt een antwoord van een chatbot in Word. Noem twee dingen die je aan de opmaak doet.',
          antwoord: 'Bijvoorbeeld: ik zet er een titel boven en ik kies lettertype Arial of Calibri.',
          uitleg: 'Denk ook aan tekstgrootte 11 of 12. Moeilijke begrippen maak je dikgedrukt.'
        }
      ],
      {
        tekst: '<strong>Werk met TalkAI en maak je Word-document.</strong> Ga naar https://talkai.info en kies de Nederlandstalige chatbot. Een account maken hoeft niet. Open daarnaast een leeg Word-document.</p>\n' +
          '<p><strong>Stap 1. Opdracht 1 - Wat is een chatbot? (5 minuten)</strong> Typ deze prompt: Leg kort uit wat een chatbot is en noem 3 voorbeelden. Lees het antwoord goed door. Kopieer het antwoord en plak het in je Word-document. Zet erboven: Opdracht 1 - Wat is een chatbot? Sla het document op als Chatbot_JouwVoornaam.docx.</p>\n' +
          '<p><strong>Stap 2. Opdracht 2 - Mijn eigen prompt. (5 minuten)</strong> Bedenk een onderwerp dat jij interessant vindt. Bijvoorbeeld voetbal, gamen, muziek, gezondheid, eten of dieren. Typ een duidelijke prompt in TalkAI. Vraag om een korte uitleg over dat onderwerp, voor iemand van 12 jaar. Voorbeeld: Leg uit hoe de VAR werkt bij voetbal, in begrijpelijke taal. Kopieer dit antwoord ook naar Word, onder je eerste opdracht. Zet erboven: Opdracht 2 - Mijn eigen prompt.</p>\n' +
          '<p><strong>Stap 3. Opdracht 3 - Fout zoeken en verbeteren. (5 minuten)</strong> Vraag TalkAI nu: Wat is het verschil tussen een dolfijn en een haai? Let goed op of het antwoord klopt. Zie je een fout? Soms zegt AI iets wat niet helemaal waar is. Dat komt doordat de chatbot informatie verzint als hij het niet zeker weet. Dat heet hallucinatie. Zet het antwoord in Word met de kop Opdracht 3 - Fout zoeken. Schrijf er deze drie vragen onder en beantwoord ze. 1 Klopt dit helemaal? 2 Hoe weet je dat? 3 Kun je dit controleren op een andere website?</p>\n' +
          '<p><strong>Stap 4. Opdracht 4 - Verslag gezond eten. (10 minuten)</strong> Stel je moet een werkstuk maken over gezond eten. Je mag de tekst van de chatbot niet letterlijk overnemen. Een werkstuk schrijf je altijd zelf. De chatbot mag je wel helpen. Geef deze prompt: Maak een kort verslag over gezond eten voor een leerling van de eerste klas vmbo, in maximaal 8 zinnen. Gebruik makkelijke woorden. Zet de tekst nu in je eigen woorden in Word, ook in ongeveer 8 zinnen. Zet erboven: Opdracht 4 - Verslag gezond eten. Gebruik deze opmaak: een titel bovenaan, lettertype Arial of Calibri, tekstgrootte 11 of 12, en moeilijke begrippen dikgedrukt. Weet je niet welke begrippen moeilijk zijn? Vraag de chatbot dan om ze uit de tekst te halen. Sla je document op. In 7.5 maak je opdracht 5 en lever je het in.',
        label: 'Lever in: je document met opdracht 1 tot en met 4, jouw eigen prompt van opdracht 2 en de drie antwoorden van opdracht 3.',
        modelAnswer: 'Opdracht 1 - Wat is een chatbot? Een chatbot is een programma waarmee je via tekst kunt praten. Voorbeelden zijn ChatGPT, Google Gemini en Microsoft Copilot. Opdracht 2 - Mijn eigen prompt. Mijn prompt was: leg uit hoe de VAR werkt bij voetbal, in 6 zinnen, voor een leerling van 12 jaar. Daarin zit de opdracht (uitleggen), het onderwerp (de VAR), de doelgroep (een leerling van 12) en de lengte (6 zinnen). Het antwoord ging over de videoscheidsrechter die meekijkt en de scheidsrechter waarschuwt. Opdracht 3 - Fout zoeken. De chatbot schreef dat een dolfijn een vis is. Dat klopt niet. 1 Nee, dit klopt niet helemaal. 2 Ik weet dat een dolfijn een zoogdier is, want hij ademt lucht en krijgt jongen. 3 Ja, ik heb het gecheckt op de site van Wereld Natuur Fonds en daar staat zoogdier. Opdracht 4 - Verslag gezond eten. Gezond eten betekent dat je genoeg groente en fruit eet. Bruin brood is beter dan wit brood, want er zitten meer vezels in. Vezels zorgen dat je darmen goed werken. Water drinken is beter dan frisdrank, want in frisdrank zit veel suiker. Van veel suiker krijg je gaatjes in je tanden. Vis en bonen leveren eiwitten, en daar groeien je spieren van. Snoep en chips mogen af en toe, maar niet elke dag. Als je goed eet, heb je meer energie op school. De begrippen vezels, eiwitten en suiker heb ik dikgedrukt gemaakt. Mijn titel staat bovenaan, ik gebruik Calibri en tekstgrootte 12.',
        nakijkpunten: [
          'Alle vier de opdrachten staan in het document, elk onder de goede kop.',
          'De eigen prompt van opdracht 2 noemt een onderwerp, een doelgroep en een lengte.',
          'Bij opdracht 3 staan de drie controlevragen beantwoord, met een echte controle erbij.',
          'Het verslag van opdracht 4 is in eigen woorden en heeft titel, lettertype, tekstgrootte en dikgedrukte begrippen.'
        ]
      },
      ['Wat is een chatbot?', 'Noem drie bekende chatbots.', 'Hoe heet de opdracht die je een chatbot geeft?', 'Welke vier onderdelen horen in een prompt?', 'Wat is hallucinatie?', 'Wat doe je met de opmaak in Word?'],
      'Sleep de vier onderdelen in je prompt. Hoe completer je prompt, hoe meer punten.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Noem samen drie chatbots. Zeg er per chatbot bij waar je hem tegenkomt.',
            antwoord: 'Bijvoorbeeld ChatGPT op internet, Copilot in Word en Meta AI in Instagram.',
            uitleg: 'Google Gemini heette eerst Bard. TalkAI is gratis en gemaakt voor leerlingen.',
            leerdoel: LD_7_3[0]
          },
          {
            groep: 'samen',
            vraag: 'Verbeter samen deze prompt: vertel wat over honden. Wat ontbreekt eraan?',
            antwoord: 'De opdracht, de doelgroep en de lengte. Bijvoorbeeld: maak een lijstje van 5 tips over honden, voor iemand van 12.',
            uitleg: 'Vage woorden zoals vertel wat of doe maar iets geven een vaag antwoord terug.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'samen',
            vraag: 'Lees deze prompt: maak een lijstje van 5 leertips, voor een leerling van 12. Wijs samen de onderdelen aan.',
            antwoord: 'Opdracht: maak een lijstje. Onderwerp: leertips. Doelgroep: een leerling van 12. Lengte: 5 tips.',
            uitleg: 'Alle vier zitten erin. Daarom weet de chatbot precies wat hij moet doen.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf zelf een prompt over jouw favoriete game. Zet er alle vier de onderdelen in.',
            antwoord: 'Bijvoorbeeld: leg in 5 zinnen uit hoe je bouwt in Fortnite, voor iemand van 12 jaar.',
            uitleg: 'Lees je prompt terug. Kun je de opdracht, het onderwerp, de doelgroep en de lengte aanwijzen?',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Wat is het verschil tussen een simpele chatbot en een AI-chatbot?',
            antwoord: 'Een simpele chatbot geeft vaste antwoorden. Een AI-chatbot denkt echt met je mee.',
            uitleg: 'De simpele soort zie je bij een klantenservice. ChatGPT hoort bij de tweede soort.',
            leerdoel: LD_7_3[0]
          },
          {
            groep: 'zelf',
            vraag: 'Je hebt een antwoord in Word geplakt. Noem drie dingen die je aan de opmaak doet.',
            antwoord: 'Titel bovenaan, lettertype Arial of Calibri, en tekstgrootte 11 of 12.',
            uitleg: 'Vergeet het vierde niet: moeilijke begrippen maak je dikgedrukt.',
            leerdoel: LD_7_3[2]
          },
          {
            groep: 'steun',
            vraag: 'Vul de vier onderdelen aan: de ..., het ..., de ... en de ... . Kies uit: lengte, opdracht, doelgroep, onderwerp.',
            antwoord: 'De opdracht, het onderwerp, de doelgroep en de lengte.',
            uitleg: 'Ezelsbruggetje: wat moet er gebeuren, waarover, voor wie, en hoe lang?',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'plus',
            vraag: 'Een chatbot schrijft: de Eiffeltoren staat in Rome. Wat is hier gebeurd en wat doe jij?',
            antwoord: 'Dit is hallucinatie: de chatbot verzint iets. Ik check het op een site die ik vertrouw.',
            uitleg: 'Een chatbot klinkt altijd zeker van zichzelf. Dat zegt dus niets over of het klopt.',
            leerdoel: LD_7_3[2]
          }
        ]
      }),

    checkpoint('7.5', 'Checkpoint: slim en veilig met AI', ['21D', '23A', '23C'],
      'afgerond Word-document met vijf opdrachten, jouw eigen prompt en je terugblik', 120, 'AI Challenge',
      ['Wat je in dit hoofdstuk geleerd hebt',
        'In 7.1 leerde je wat kunstmatige intelligentie is. AI doet taken die vroeger alleen mensen deden. AI leert van data en denkt niet zoals jij. Je zag ook waar AI overal in zit.' +
        '</p><p>' +
        'In 7.2 leerde je de voordelen en de gevaren. Je leerde hoe je een AI-afbeelding herkent. En waarom je nooit persoonlijke gegevens met AI deelt.' +
        '</p><p>' +
        'In 7.3 leerde je werken met een chatbot. Je schreef een prompt met vier vaste onderdelen. Je zette het antwoord netjes in Word. En je controleerde of het antwoord wel klopte.'],
      ['Zo doe je deze checkpoint',
        'Deze checkpoint kost twee lessen. Les 1 is de startcheck, deze theorie en het oefenen. Les 2 is de praktijkopdracht, de samenvatting en de toets. De Digidocent helpt je bij de toets niet.' +
        '</p><p>' +
        'De toets gaat over 7.1, 7.2 en 7.3. Ook de twee doelen van deze paragraaf komen erin terug. Je hoeft dus niets nieuws te leren. Je laat zien wat je al kunt.' +
        '</p><p>' +
        'Een chatbot klinkt altijd zeker van zichzelf. Toch kan het antwoord fout zijn. Loop daarom bij elk antwoord deze drie vragen langs.' +
        '</p><ul>' +
        '<li>Klopt dit helemaal?</li>' +
        '<li>Hoe weet je dat?</li>' +
        '<li>Kun je dit controleren op een andere website?</li>' +
        '</ul><p>' +
        'Gaat er in de toets een vraag mis? Schrijf dan op bij welke paragraaf hij hoort. Die oefeningen doe je daarna opnieuw. Dat heet het herstelspoor. Ging alles goed, dan help je een klasgenoot.'],
      [
        media('https://www.youtube.com/embed/kwHKzSek8ws', 'Verdieping: zo verandert kunstmatige intelligentie het onderwijs', 'Welke verandering op school zie je in de video? Vind jij dat goed nieuws of juist niet? Je hebt dit nodig bij stap 4.'),
        media('https://schooltv.nl/video-item/het-klokhuis-over-ai-5-kun-je-ai-antwoorden-vertrouwen', 'Het Klokhuis: kun je AI-antwoorden vertrouwen? (opent in een nieuw tabblad)', 'Noem een manier uit het filmpje om te checken of een AI-antwoord klopt. Staat die manier ook in het lijstje van drie hierboven?')
      ],
      [
        {
          leerdoel: LD_7_5[0],
          vraag: 'Je legt thuis uit wat AI is. Wat vertel je als eerste? Schrijf die ene zin op.',
          antwoord: 'Bijvoorbeeld: AI is een computerprogramma dat taken doet die mensen ook doen.',
          uitleg: 'Begin bij wat het is. Daarna pas hoe het leert, en daarna waar je op moet letten.'
        },
        {
          leerdoel: LD_7_5[1],
          vraag: 'Een chatbot geeft je acht vlotte zinnen vol jaartallen. Wat doe je als eerste?',
          antwoord: 'Ik check een jaartal op een site die ik vertrouw. Pas daarna gebruik ik de tekst.',
          uitleg: 'Vlot geschreven is niet hetzelfde als waar. Juist getallen gaan vaak mis.'
        },
        {
          vraag: 'Kijk terug op 7.1 tot en met 7.3. Welk werkstuk heb jij al helemaal af?',
          antwoord: 'Het AI-logboek uit 7.1 en 7.2, en het document Chatbot_JouwVoornaam.docx uit 7.3.',
          uitleg: 'Ontbreekt er nog iets? Maak dat eerst af. Je hebt het straks bij stap 3 nodig.'
        }
      ],
      {
        tekst: '<strong>Laat zien dat je slim en veilig met AI omgaat.</strong> Reken op een lesuur. Werk in je bestand Chatbot_JouwVoornaam.docx van 7.3.</p>\n' +
          '<p><strong>Stap 1. Leer de begrippen. (5 minuten)</strong> Uit 7.1: kunstmatige intelligentie, algoritme, data, machine learning en simuleren. Uit 7.2: patroon, privacyprobleem, deepfake, AI-afbeelding en persoonlijke gegevens. Uit 7.3: chatbot, prompt, doelgroep en hallucinatie. Dek de uitleg af en zeg alles hardop.</p>\n' +
          '<p><strong>Stap 2. Opdracht 5 - Zelf denken. (12 minuten)</strong> Je bedenkt nu zelf een prompt. Je mag zelf kiezen wat je de chatbot laat schrijven. Houd rekening met deze tips.</p>\n' +
          '<ul><li>Wees duidelijk: zeg precies wat je wil.</li>' +
          '<li>Geef context: leg kort uit waar het over gaat.</li>' +
          '<li>Geef een vorm: vraag om een lijstje, uitleg, verslag of stappenplan.</li>' +
          '<li>Kies je doelgroep: zeg voor wie het bedoeld is, bijvoorbeeld een leerling van 12 jaar.</li>' +
          '<li>Geef een lengte: kort, 5 zinnen, 100 woorden.</li>' +
          '<li>Geef de bot een rol: schrijf bijvoorbeeld alsof je docent bent.</li>' +
          '<li>Vermijd vage woorden zoals doe maar iets of vertel wat.</li></ul>\n' +
          '<p>Zet in je prompt dat er maximaal 300 woorden geschreven worden. Ga naar je Word-document en schrijf op: Opdracht 5 - Zelf denken. Zet daaronder Prompt: met jouw eigen prompt. Zet daaronder Antwoord: met het antwoord van de chatbot. Lees het antwoord daarna door en beantwoord deze drie vragen. 1 Heeft de chatbot fouten gemaakt? Zo ja, welke? 2 Heeft de chatbot goed naar je prompt geluisterd? Waarom wel of niet? 3 Wil je nog iets laten aanpassen? Wat vraag je dan? Vraag dat, en plak het nieuwe antwoord eronder.</p>\n' +
          '<p><strong>Stap 3. De slotcontrole. (3 minuten)</strong> Controleer je Word-document. Staan alle vijf de opdrachten erin? Is het document makkelijk te lezen? Pas fouten aan. Lever het document daarna in bij je docent.</p>\n' +
          '<p><strong>Stap 4. Verdieping - AI in het onderwijs. (5 minuten)</strong> Dit is extra stof en geen zesde opdracht. Kijk de video hierboven. Hoe denk jij dat het onderwijs met AI om moet gaan? Moeten we het toelaten of verbieden? Leer je minder als je AI je huiswerk laat maken? Of kun je er juist meer mee leren? Schrijf in een paar zinnen wat jij vindt. Zet erboven: Verdieping - AI in het onderwijs.</p>\n' +
          '<p><strong>Stap 5. De hoofdstuktoets. (15 minuten)</strong> Maak de toets van dit hoofdstuk in HELIX. Lees eerst alle antwoorden helemaal door voordat je kiest.</p>\n' +
          '<p><strong>Stap 6. Je terugblik en je route. (5 minuten)</strong> Schrijf vijf regels. Welke twee vragen gingen mis? Bij welke paragraaf horen ze? Ging een leerdoel mis, dan doe je die oefeningen opnieuw. Ging alles goed, dan help je een klasgenoot.',
        label: 'Lever in: je afgemaakte document met de vijf opdrachten, je verdiepingsstukje en je terugblik van vijf regels.',
        modelAnswer: 'Opdracht 5 - Zelf denken. Prompt: schrijf alsof je mijn gymdocent bent. Maak een stappenplan van 6 stappen om beter te leren hardlopen, voor een leerling van 12 jaar, in maximaal 300 woorden en in makkelijke taal. Antwoord: de chatbot gaf zes stappen, van warmlopen tot afkoelen. 1 De chatbot maakte een fout: hij schreef dat je elke dag moet trainen. Op de site van de Hartstichting staat dat rustdagen juist nodig zijn. 2 Hij luisterde goed naar mijn prompt. Er staan zes stappen in, het is makkelijke taal en het zijn 240 woorden. Hij hield zich ook aan de rol van gymdocent. 3 Ik wilde er tips bij over schoenen. Ik vroeg: voeg twee tips over hardloopschoenen toe. Het nieuwe antwoord staat eronder geplakt. Slotcontrole. Mijn document heet Chatbot_Sem.docx. Alle vijf de opdrachten staan erin met een kop erboven. Ik gebruik Calibri, tekstgrootte 12, en de moeilijke begrippen zijn dikgedrukt. Verdieping - AI in het onderwijs. Ik vind dat school AI moet toelaten, maar met regels. Als je AI je werkstuk laat maken, leer je niets. Vraag je alleen uitleg als je iets niet snapt, dan leer je juist meer. De docent moet daarom zeggen wat wel en niet mag. Terugblik. Twee vragen gingen mis. De eerste ging over machine learning. Ik dacht dat elke computer uit zichzelf kan leren, maar dat kan alleen een systeem dat aan machine learning doet. Die vraag hoort bij 7.1. De tweede ging over de vier onderdelen van een prompt. Ik vergat de lengte. Die hoort bij 7.3. Ik doe het herstelspoor en maak de oefeningen van 7.1 en 7.3 opnieuw.',
        nakijkpunten: [
          'De eigen prompt van opdracht 5 heeft een opdracht, een onderwerp, een doelgroep, een lengte en een rol.',
          'De drie slotvragen zijn beantwoord, met een echte controle bij vraag 1.',
          'Alle vijf de opdrachten staan in het document en het verdiepingsstukje geeft een eigen mening met een reden.',
          'De terugblik noemt twee gemiste vragen met de paragraaf erbij en een vervolgactie.'
        ]
      },
      ['Wat is kunstmatige intelligentie?', 'Waarvan leert een AI?', 'Noem drie plekken waar AI in zit.', 'Noem een voordeel en een gevaar van AI.', 'Waaraan herken je een AI-afbeelding?', 'Welke gegevens deel je nooit met AI?', 'Wat is een chatbot?', 'Noem drie bekende chatbots.', 'Welke vier onderdelen horen in een prompt?', 'Wat is hallucinatie?', 'Hoe controleer je een AI-antwoord?', 'Wat doe je met de opmaak in Word?'],
      'Vier kamers: wat is AI, voordeel of gevaar, echt of gegenereerd, en prompt bouwen.',
      false,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Spreek af hoe jullie de diagnose gebruiken. Wat schrijf je op zodra een vraag misgaat?',
            antwoord: 'Je schrijft het leerdoel op met de paragraaf erbij. Bijvoorbeeld: hallucinatie, 7.3.',
            uitleg: 'De diagnose is geen cijfer maar een wegwijzer. Zonder notitie weet je niet wat je herhaalt.',
            leerdoel: LD_7_5[0]
          },
          {
            groep: 'samen',
            vraag: 'Leg elkaar uit hoe je een AI-antwoord controleert. Noem samen de drie vragen.',
            antwoord: 'Klopt dit helemaal? Hoe weet je dat? Kun je dit controleren op een andere website?',
            uitleg: 'Vraag drie is de belangrijkste. Zonder tweede bron blijft het bij een gevoel.',
            leerdoel: LD_7_5[1]
          },
          {
            groep: 'zelf',
            vraag: 'Nu volgt de diagnostische ronde. Dat is een oefenronde zonder cijfer. Er is een vraag per leerdoel van dit hoofdstuk. Maak ze eerst zelf. Klap de uitwerking pas daarna open. Bij elke uitwerking staat wat je terugleest als het misging.',
            antwoord: 'Ga na deze uitleg door naar diagnose 1 hieronder.',
            uitleg: 'Elf vragen, elf leerdoelen. Ging er een mis? Doe eerst dat stuk opnieuw en dan pas de toets.',
            leerdoel: LD_7_5[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 1. Leg in twee zinnen uit wat kunstmatige intelligentie is.',
            antwoord: 'Het is een computerprogramma dat taken van mensen doet, zoals leren, plannen en kiezen.',
            uitleg: 'Gaat dit mis? Lees 7.1, theorieblok 1 terug. Denk aan het woord algoritme.',
            leerdoel: LD_7_1[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 2. Waarvan leert een AI? En noem een ding dat een mens wel heeft en AI niet.',
            antwoord: 'Een AI leert van data. Een mens heeft gevoelens, bewustzijn en intuitie; AI niet.',
            uitleg: 'Gaat dit mis? Lees 7.1, theorieblok 2 terug. AI begrijpt niets, AI simuleert.',
            leerdoel: LD_7_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 3. Noem drie plekken uit jouw eigen dag waar AI in zit.',
            antwoord: 'Bijvoorbeeld Siri, de zoekbalk van Google en de filters op Snapchat.',
            uitleg: 'Gaat dit mis? Lees het lijstje in 7.1, theorieblok 2 terug. Ook je muziek-app telt mee.',
            leerdoel: LD_7_1[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 4. Noem een voordeel van AI en een gevaar van AI.',
            antwoord: 'Voordeel: een arts vindt een ziekte op een scan. Gevaar: er verdwijnen beroepen.',
            uitleg: 'Gaat dit mis? Lees 7.2, theorieblok 1 terug. Het privacyprobleem is ook een gevaar.',
            leerdoel: LD_7_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 5. Noem drie kenmerken waaraan je een AI-afbeelding herkent.',
            antwoord: 'Zes vingers aan een hand, rare of scheve ogen, en kleding die vreemd overloopt.',
            uitleg: 'Gaat dit mis? Lees 7.2, theorieblok 2 terug. Letters op een bordje zijn het vierde.',
            leerdoel: LD_7_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 6. Welke gegevens typ je nooit in bij een chatbot? Noem er drie.',
            antwoord: 'Mijn echte naam, mijn adres en mijn telefoonnummer. Foto\'s van mensen ook niet.',
            uitleg: 'Gaat dit mis? Lees het slot van 7.2, theorieblok 1 terug. Ook gegevens van anderen niet.',
            leerdoel: LD_7_2[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 7. Wat is een chatbot? Noem er daarna drie bij naam.',
            antwoord: 'Een programma waarmee je via tekst praat. Bijvoorbeeld ChatGPT, Gemini en TalkAI.',
            uitleg: 'Gaat dit mis? Lees 7.3, theorieblok 1 terug. Copilot en Meta AI horen er ook bij.',
            leerdoel: LD_7_3[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 8. Schrijf een prompt over jouw hobby met alle vier de onderdelen erin.',
            antwoord: 'Bijvoorbeeld: leg in 5 zinnen uit hoe je skateboardt, voor een leerling van 12 jaar.',
            uitleg: 'Gaat dit mis? Lees 7.3, theorieblok 2 terug. Wijs de vier onderdelen in je zin aan.',
            leerdoel: LD_7_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 9. Je plakt een antwoord in Word. Noem vier dingen die je aan de opmaak doet.',
            antwoord: 'Titel bovenaan, lettertype Arial of Calibri, tekstgrootte 11 of 12, begrippen dikgedrukt.',
            uitleg: 'Gaat dit mis? Lees het slot van 7.3, theorieblok 2 terug. Schrijf ook in je eigen woorden.',
            leerdoel: LD_7_3[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 10. Vertel in drie zinnen hoe AI werkt en waar je op moet letten.',
            antwoord: 'AI leert van heel veel data. Het denkt niet, het simuleert. Deel er geen gegevens mee.',
            uitleg: 'Gaat dit mis? Lees 7.5, theorieblok 1 terug. Noem ook een voorbeeld uit je eigen dag.',
            leerdoel: LD_7_5[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 11. Een chatbot noemt drie jaartallen. Hoe controleer je of dat klopt?',
            antwoord: 'Ik loop de drie vragen langs en zoek een jaartal na op een site die ik vertrouw.',
            uitleg: 'Gaat dit mis? Lees 7.5, theorieblok 2 terug. Verzinnen door een chatbot heet hallucinatie.',
            leerdoel: LD_7_5[1]
          },
          {
            groep: 'steun',
            vraag: 'Kies het goede woord. (a) Verzinnen door een chatbot heet ... . (b) Leren van voorbeelden heet ... .',
            antwoord: '(a) hallucinatie. (b) machine learning.',
            uitleg: 'Hallucinatie hoort bij 7.3. Machine learning hoort bij 7.1, bij het leren van data.',
            leerdoel: LD_7_5[1]
          },
          {
            groep: 'plus',
            vraag: 'Bedenk een strikvraag over AI waarvan jij denkt dat de halve klas hem fout heeft.',
            antwoord: 'Bijvoorbeeld: leert een chatbot iets terwijl jij met hem praat? Veel mensen zeggen ja.',
            uitleg: 'Wie de valkuil kan uitleggen, kent de stof. Deel je vraag met je buurman of buurvrouw.',
            leerdoel: LD_7_5[0]
          }
        ]
      })
  ]
};
