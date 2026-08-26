// Verrijkingslaag hoofdstuk 7 - Kunstmatige intelligentie en chatbots.
// Basisberoepsgerichte leerweg (bb).
//
// Zie scripts/seed-verrijking/PATROON.md voor het formaat van een vraag, de
// regels over afleiders en de eisen aan feedback.
//
// Dit hoofdstuk heeft in bb VIER paragrafen: 7.1, 7.2, 7.3 en 7.5. 7.4 valt
// volgens het jaarplan weg voor basis en 7.6 is de vrijwillige plusparagraaf
// van de theoretische leerweg. Waar de stof van 7.4 gebleven is, staat in de kop
// van scripts/seed-structuur/bb/h7.mjs.
//
// 7.1 is de eerste paragraaf van het hoofdstuk en kijkt nergens op terug. 7.2 en
// 7.3 hebben allebei een terugkeervraag naar een eerdere paragraaf van dit
// hoofdstuk: 7.2 vraag 1 hangt aan een leerdoel van 7.1 en 7.3 vraag 1 aan een
// leerdoel van 7.2.
//
// Opzet per paragraaf, volgens de blauwdruk en het bb-profiel:
//   - elk leerdoel heeft zijn EIGEN startvraag. Die staan als `checks` in
//     scripts/seed-structuur/bb/h7.mjs, met antwoord en uitleg erbij. 7.1 opent
//     daarnaast met een voorkennisvraag over hoofdstuk 6 (de deepfake uit 6.6),
//     want die term komt in 7.2 meteen terug;
//   - elk theorieblok heeft een uitgewerkt voorbeeld in vraag-en-antwoordvorm.
//     Dat voorbeeld staat VOOR het oefenblok en dus voor het zelfstandig
//     oefenen. In bb is het voorbeeld altijd een situatie uit hun eigen wereld:
//     een tijdlijn op TikTok, een chatbot die je troost, een nepfoto van een
//     hond, een klantenservice en een lijstje over een puppy;
//   - de hoofdstuktoets van 7.5 bevraagt alle ELF leerdoelen van 7.1, 7.2, 7.3
//     en 7.5. Tien van de elf komen er twee keer in terug.
//
// TOETSMATRIJS VAN 7.5 (22 vragen op 11 leerdoelen)
// -------------------------------------------------
//   7.1 wat AI is .............. T1  (meerkeuze), T2  (waar-niet-waar)
//   7.1 leert van data ......... T3  (meerkeuze), T4  (waar-niet-waar)
//   7.1 dagelijkse AI .......... T5  (meerkeuze), T6  (waar-niet-waar)
//   7.2 voordeel en gevaar ..... T7  (meerkeuze), T8  (waar-niet-waar)
//   7.2 AI-beeld herkennen ..... T9  (meerkeuze), T10 (waar-niet-waar)
//   7.2 persoonlijke gegevens .. T11 (meerkeuze), T12 (waar-niet-waar)
//   7.3 wat een chatbot is ..... T13 (meerkeuze), T14 (waar-niet-waar)
//   7.3 een prompt schrijven ... T15 (meerkeuze), T16 (open)
//   7.3 verwerken in Word ...... T17 (meerkeuze), T22 (waar-niet-waar)
//   7.5 hoe AI werkt ........... T18 (open),      T21 (waar-niet-waar)
//   7.5 kritisch beoordelen .... T19 (meerkeuze), T20 (open)
// De leerdoelen van de plusparagraaf 7.6 komen er niet in voor; die paragraaf
// bestaat in bb helemaal niet.
//
// BB-VORM: VEEL KLEINE MOMENTEN
// -----------------------------
// Het bb-profiel zegt: vorm gaat voor inhoud, en een leerling moet elke minuut
// iets kunnen aanklikken. Daarom staan er in dit hoofdstuk veel korte vragen in
// plaats van een paar grote. Geteld over heel hoofdstuk 7 in bb: 25 meerkeuze,
// 20 waar-niet-waar en 7 open vragen, samen 52. Bijna de helft is dus een korte
// goed-of-fout-knop. Elke afsluitquiz telt tien vragen en de hoofdstuktoets
// tweeentwintig, zodat de tokens over veel kleine momenten verdeeld worden in
// plaats van over een paar dikke vragen aan het eind.
//
// De reden waarom een antwoord goed is staat in `explanation`, niet in de
// antwoordtekst zelf. Feedback is kort, positief en benoemt wat er goed ging.
//
// RAADBAARHEID OP VORM
// --------------------
// In geen enkele meerkeuzevraag van dit hoofdstuk is het goede antwoord de
// langste knop: blind de langste knop klikken levert 0 van de 25 goed. De
// afleiders zijn met opzet even lang of langer geschreven. Het goede antwoord
// staat gespreid over positie 1, 2 en 3.
//
// De bb-vragen zijn opnieuw geschreven en niet overgenomen uit kb/h7.mjs of
// tl/h7.mjs: kortere zinnen, een idee per vraag en scenario's uit de leefwereld
// van een brugklasser.

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
  '7.1': {
    learningGoals: LD_7_1,
    theorie: [
      {
        keyTerms: ['kunstmatige intelligentie', 'computerprogramma'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara opent TikTok. Haar tijdlijn staat vol paardenfilmpjes. Hoe weet de app dat?</p>',
          '<p><strong>Antwoord.</strong> Er zit een algoritme achter. Yara keek vorige week drie paardenfilmpjes uit. Dat werd bijgehouden. De app laat haar nu meer van die filmpjes zien. Kijkt zij morgen alleen voetbal? Dan verandert haar tijdlijn weer. De app kent haar niet echt. Hij telt alleen wat zij aanklikt en bekijkt.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['machine learning', 'data', 'simuleert'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem typt tegen een chatbot: ik ben verdrietig. De bot schrijft: wat naar voor je. Voelt de bot iets?</p>',
          '<p><strong>Antwoord.</strong> Nee, de bot voelt niets. Hij heeft in heel veel teksten gezien wat mensen dan schrijven. Daarom kiest hij die zin. Dat noemen we simuleren: hij doet het na. Sem leest een lieve zin, maar er zit geen gevoel achter. Een mens die dit zegt, meent het wel.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>AI is een computerprogramma dat taken van mensen doet. Er zit een algoritme achter: een vaste volgorde van stappen. AI leert van data, dus van heel veel voorbeelden. Denken zoals jij doet AI niet. AI zit in Siri, in de zoekbalk van Google en in je filters.</p>',
      keyTerms: ['computerprogramma', 'Siri']
    },
    vragen: [
      {
        prompt: 'Waar staan de letters AI voor?',
        leerdoel: LD_7_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Automatische installatie van een programma op je laptop.', correct: false, misconception: 'Gokt op een afkorting die met computers te maken heeft.' },
          { text: 'Alle informatie die een school over jou bewaart.', correct: false, misconception: 'Verwart AI met een leerlingdossier of gegevens.' },
          { text: 'Kunstmatige intelligentie.', correct: true, explanation: 'In het Engels heet dat Artificial Intelligence, en daar komt AI vandaan.' },
          { text: "Een app waarmee je foto's bewerkt en filters toevoegt.", correct: false, misconception: 'Denkt dat AI de naam van een fotoapp is.' }
        ],
        feedback: 'Goed. AI staat voor kunstmatige intelligentie, en dat onthoud je nu.'
      },
      {
        prompt: 'Een robot en kunstmatige intelligentie zijn precies hetzelfde.',
        waar: false,
        leerdoel: LD_7_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Sterk. Jij ziet dat de robot de verpakking is en de AI het programma.'
      },
      {
        prompt: 'Wat is een algoritme?',
        leerdoel: LD_7_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een computer die zelf gevoelens en gedachten heeft gekregen.', correct: false, misconception: 'Denkt dat een algoritme een denkende machine is.' },
          { text: 'Een lijst met alle wachtwoorden die jij ooit gebruikt hebt.', correct: false, misconception: 'Verwart een algoritme met opgeslagen gegevens.' },
          { text: 'Een vaste volgorde van stappen die de computer volgt.', correct: true, explanation: 'De computer loopt die stappen af om een keuze te maken.' }
        ],
        feedback: 'Prima. Je weet nu dat een algoritme gewoon een stappenplan is.'
      },
      {
        prompt: 'Kan AI zelf denken, nu het ook kan leren?',
        leerdoel: LD_7_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Ja, want om te kunnen leren moet je denken als een mens.', correct: false, misconception: 'Denkt dat leren en denken altijd bij elkaar horen.' },
          { text: 'Ja, want AI heeft gevoelens en kan boos of blij worden.', correct: false, misconception: 'Denkt dat een vriendelijke chatbot ook echt iets voelt.' },
          { text: 'Nee, AI begrijpt niets en doet alleen maar na.', correct: true, explanation: 'Mensen hebben gevoelens en bewustzijn; een programma heeft dat niet.' }
        ],
        feedback: 'Knap gezien. Leren en denken zijn dus niet hetzelfde.'
      },
      {
        prompt: 'Een AI leert van heel veel data.',
        waar: true,
        leerdoel: LD_7_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Data is gewoon een ander woord voor gegevens of voorbeelden.'
      },
      {
        prompt: 'Wie of wat kan uit zichzelf leren?',
        leerdoel: LD_7_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een systeem dat aan machine learning doet.', correct: true, explanation: 'Zo een systeem leert van voorbeelden en wordt daar beter van.' },
          { text: 'Elke computer, elke tv en elke telefoon in huis.', correct: false, misconception: 'Denkt dat elk apparaat met een scherm vanzelf leert.' },
          { text: 'Alleen mensen kunnen dat, machines nooit.', correct: false, misconception: 'Denkt dat leren iets is wat alleen mensen kunnen.' }
        ],
        feedback: 'Goed opgelet. Een gewone tv leert niets van wat jij kijkt.'
      },
      {
        prompt: 'Een chatbot leert meteen bij tijdens jouw gesprek.',
        waar: false,
        leerdoel: LD_7_1[1],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Scherp. Het bedrijf traint de AI pas later opnieuw, niet tijdens jouw chat.'
      },
      {
        prompt: 'In welk rijtje zit overal AI?',
        leerdoel: LD_7_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Een rekenmachine, een schaar en een fietspomp.', correct: false, misconception: 'Denkt dat elk hulpmiddel met techniek te maken heeft.' },
          { text: 'Siri, ChatGPT en de zoekbalk van Google.', correct: true, explanation: 'Alle drie leren bij van wat mensen invoeren en aanklikken.' },
          { text: 'Een schoolagenda op papier, een pen en een gum.', correct: false, misconception: 'Denkt dat schoolspullen ook onder AI vallen.' }
        ],
        feedback: 'Mooi. Vraag je steeds af: leert dit ding bij van wat ik doe?'
      },
      {
        prompt: 'In de filters van Snapchat en Instagram zit AI.',
        waar: true,
        leerdoel: LD_7_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Precies. Het filter zoekt jouw ogen en mond en volgt die.'
      },
      {
        prompt: 'Noem twee dingen die jij vandaag gebruikte waar AI in zit. Zet er per ding bij waaraan je dat merkt.',
        type: 'open',
        leerdoel: LD_7_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik keek TikTok. Mijn tijdlijn stond vol voetbal, want dat kijk ik het meest. Daar merk ik AI aan. Ik gebruikte ook een filter op Snapchat. Dat filter bleef precies op mijn ogen zitten toen ik mijn hoofd draaide.',
        nakijkpunten: [
          'Er staan twee voorbeelden in waar echt AI in zit.',
          'Bij elk voorbeeld staat waaraan de leerling dat merkt.'
        ],
        feedback: 'Netjes. Je noemt niet alleen de app maar ook waaraan je het ziet.'
      }
    ]
  },

  '7.2': {
    learningGoals: LD_7_2,
    theorie: [
      {
        keyTerms: ['patronen', 'privacyprobleem', 'persoonlijke gegevens'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan vraagt een chatbot om hulp bij zijn werkstuk. Hij typt erbij: ik zit in 1B2 op het Dacapo in Sittard. Wat is daar mis mee?</p>',
          '<p><strong>Antwoord.</strong> Milan geeft nu persoonlijke gegevens weg. Zijn klas en zijn school staan in de chat. Achter die chatbot zit een bedrijf met mensen. Milan weet niet wie dat later leest. Voor zijn werkstuk was die informatie ook helemaal niet nodig. Hij had gewoon om uitleg kunnen vragen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['AI-afbeelding', 'gegenereerd'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima ziet een foto van een hond die op twee poten voetbalt. Hoe checkt zij of die foto echt is?</p>',
          '<p><strong>Antwoord.</strong> Zij zoomt in op de details. De poten van de hond hebben zes tenen. Op het shirt staan letters die geen woord vormen. Het gras loopt over in de schoen. Dat zijn drie kenmerken van een AI-afbeelding. Fatima weet nu genoeg: deze foto is door een computer gemaakt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>AI is snel en vindt patronen, en dat helpt bijvoorbeeld een arts. Maar er is ook een privacyprobleem, want AI verzamelt gegevens over jou. Aan zes vingers of rare ogen zie je een plaatje van AI. Deel daarom nooit persoonlijke gegevens met een chatbot.</p>',
      keyTerms: ['privacyprobleem', 'persoonlijke gegevens']
    },
    vragen: [
      {
        prompt: 'Ook in de zoekbalk van Google zit kunstmatige intelligentie.',
        waar: true,
        leerdoel: LD_7_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        feedback: 'Goed onthouden uit 7.1. Google raadt al wat jij wil typen.'
      },
      {
        prompt: 'Waarom kan AI een arts helpen bij een scan?',
        leerdoel: LD_7_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Omdat AI de patient zelf kan opereren zonder hulp van mensen.', correct: false, misconception: 'Denkt dat AI het werk van de arts helemaal overneemt.' },
          { text: 'Omdat AI heel snel patronen vindt in beelden.', correct: true, explanation: 'Een computer bekijkt duizenden scans sneller dan een mens dat kan.' },
          { text: 'Omdat AI medelijden heeft met zieke mensen en wil helpen.', correct: false, misconception: 'Denkt dat AI gevoelens heeft en daarom helpt.' }
        ],
        feedback: 'Prima. Snel patronen zien is precies waar AI goed in is.'
      },
      {
        prompt: 'Door AI kunnen sommige beroepen verdwijnen.',
        waar: true,
        leerdoel: LD_7_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. Werk dat een machine kan doen, hoeft niet meer door mensen.'
      },
      {
        prompt: 'Waarom moet je voorzichtig zijn met het gebruik van AI?',
        leerdoel: LD_7_2[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Omdat mijn klasgenoten mij dan kunnen opzoeken via een chatbot.', correct: false, misconception: 'Denkt dat het risico bij klasgenoten ligt in plaats van bij het bedrijf.' },
          { text: 'Omdat AI dan weet waar je woont en je fiets komt stelen.', correct: false, misconception: 'Denkt dat de AI zelf iets komt doen in het echte leven.' },
          { text: 'Omdat je nooit weet waar jouw informatie terechtkomt.', correct: true, explanation: 'Achter het systeem zitten mensen die je niet kunt controleren.' }
        ],
        feedback: 'Sterk. Het gaat om de mensen achter het systeem, niet om de computer zelf.'
      },
      {
        prompt: 'Op een foto heeft een jongen zes vingers aan een hand. Wat is er aan de hand?',
        leerdoel: LD_7_2[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'De foto is waarschijnlijk door AI gemaakt.', correct: true, explanation: 'Handen en vingers gaan het vaakst mis in een AI-beeld.' },
          { text: 'De fotograaf heeft de foto verkeerd afgedrukt op papier.', correct: false, misconception: 'Denkt dat het aan het afdrukken of de printer ligt.' },
          { text: 'De jongen heeft zijn hand snel bewogen tijdens de foto.', correct: false, misconception: 'Denkt dat beweging een extra vinger kan maken.' }
        ],
        feedback: 'Knap. De vingers zijn de bekendste verklikker van AI-beeld.'
      },
      {
        prompt: "AI knipt bestaande foto's aan elkaar tot een nieuw plaatje.",
        waar: false,
        leerdoel: LD_7_2[1],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Goed geredeneerd. Het model bouwt zelf een nieuw beeld op, zonder knippen.'
      },
      {
        prompt: 'Waarom dragen betere AI-plaatjes bij aan meer verspreiding van nepnieuws? Leg je antwoord uit.',
        type: 'open',
        leerdoel: LD_7_2[1],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Hoe echter een plaatje eruitziet, hoe minder mensen twijfelen. Ze zien geen fout meer aan de vingers of de ogen. Daardoor geloven ze het bericht en sturen ze het door. Zo gaat een nepbericht heel snel rond, want er lijkt bewijs bij te zitten.',
        nakijkpunten: [
          'Er staat in dat mensen een echter plaatje eerder geloven.',
          'Er staat in dat ze het daardoor doorsturen of delen.'
        ],
        feedback: 'Netjes uitgelegd. Een foto voelt als bewijs, ook als hij nep is.'
      },
      {
        prompt: 'Is het verstandig om al jouw persoonlijke gegevens te delen met AI?',
        leerdoel: LD_7_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ja hoor, het praat makkelijker als de chatbot weet hoe ik heet.', correct: false, misconception: 'Denkt dat een persoonlijk gesprek belangrijker is dan zijn gegevens.' },
          { text: 'Nee, die gegevens kunnen in verkeerde handen komen.', correct: true, explanation: 'Ze worden opgeslagen, en jij bepaalt niet wie ze daarna leest.' },
          { text: 'Ja, want alleen mijn eigen telefoon leest die gegevens.', correct: false, misconception: 'Denkt dat wat je typt op je eigen apparaat blijft staan.' }
        ],
        feedback: 'Goed. Wat je eenmaal getypt hebt, haal je er niet meer uit.'
      },
      {
        prompt: "Foto's van je vrienden mag je gewoon in een chatbot zetten.",
        waar: false,
        leerdoel: LD_7_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Sterk. Ook de gegevens van een ander geef je niet zomaar weg.'
      },
      {
        prompt: 'AI maakt wel eens fouten, zoals in de video. Kunnen die fouten gevaarlijk zijn? Leg uit met een voorbeeld.',
        type: 'open',
        leerdoel: LD_7_2[0],
        denkniveau: 'uitleggen',
        niveau: 'plus',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ja, dat kan. In de video zegt AI dat je lijm op je pizza moet doen. Dat is raar, maar iemand kan het wel geloven. Gevaarlijker is het bij eten of medicijnen. Als AI een verkeerde hoeveelheid noemt, kan iemand ziek worden. Daarom check je het altijd op een andere website.',
        nakijkpunten: [
          'Er staat een concreet voorbeeld van een fout in.',
          'Er staat bij waarom die fout gevaarlijk kan worden.'
        ],
        feedback: 'Goed nagedacht. Je noemt niet alleen de fout maar ook het gevolg.'
      }
    ]
  },

  '7.3': {
    learningGoals: LD_7_3,
    theorie: [
      {
        keyTerms: ['chatbot', 'ChatGPT', 'getraind'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jayden appt met de klantenservice van een webshop. Hij vraagt iets ingewikkelds. Hij krijgt steeds hetzelfde antwoord terug. Waarom gebeurt dat?</p>',
          '<p><strong>Antwoord.</strong> Dit is de simpele soort chatbot. Die kent alleen vaste antwoorden. Past jouw vraag daar niet bij, dan blijft hij herhalen. Een AI-chatbot zoals ChatGPT werkt anders. Die denkt wel mee en maakt zelf een nieuwe zin. Jayden kan beter om een echte medewerker vragen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['doelgroep', 'hallucinatie', 'dikgedrukt'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Nova typt: vertel wat over honden. Het antwoord is een lang verhaal dat zij niet snapt. Hoe maakt zij haar prompt beter?</p>',
          '<p><strong>Antwoord.</strong> Nova zet er de vier onderdelen in. De opdracht: maak een lijstje. Het onderwerp: hoe je voor een puppy zorgt. De doelgroep: een leerling van 12 jaar. De lengte: 5 punten. Haar nieuwe prompt wordt: maak een lijstje van 5 punten over de zorg voor een puppy, voor een leerling van 12 jaar. Nu krijgt zij wel wat zij zoekt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een chatbot is een programma waarmee je via tekst praat. Bekende chatbots zijn ChatGPT, TalkAI en Google Gemini. Je geeft hem een prompt: een duidelijke opdracht. Zet daarin de opdracht, het onderwerp, de doelgroep en de lengte. Het antwoord zet je netjes en in eigen woorden in Word.</p>',
      keyTerms: ['TalkAI', 'lengte']
    },
    vragen: [
      {
        prompt: 'Je begint een gesprek met een chatbot. Wat typ je er nooit in?',
        leerdoel: LD_7_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een vraag over hoe de VAR bij voetbal precies werkt.', correct: false, misconception: 'Denkt dat elke vraag aan een chatbot gevaarlijk is.' },
          { text: 'Je adres en je telefoonnummer.', correct: true, explanation: 'Dat zijn persoonlijke gegevens; die heeft een chatbot nooit nodig.' },
          { text: 'De opdracht om een lijstje met leertips te maken.', correct: false, misconception: 'Denkt dat je een chatbot beter helemaal geen opdracht geeft.' }
        ],
        feedback: 'Goed onthouden uit 7.2. Vragen stellen mag, gegevens geven niet.'
      },
      {
        prompt: 'Wat is een chatbot?',
        leerdoel: LD_7_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'ik_doe_voor',
        options: [
          { text: 'Een programma waarmee je via tekst kunt praten.', correct: true, explanation: 'Jij typt een vraag en het programma typt een antwoord terug.' },
          { text: 'Een mens die achter een scherm jouw vragen beantwoordt.', correct: false, misconception: 'Denkt dat er een echte medewerker meetypt.' },
          { text: 'Een zoekmachine die alle websites van internet doorleest.', correct: false, misconception: 'Verwart een chatbot met Google.' }
        ],
        feedback: 'Prima. Het lijkt op praten, maar het is een programma.'
      },
      {
        prompt: 'Google Gemini heette vroeger Bard.',
        waar: true,
        leerdoel: LD_7_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        feedback: 'Klopt. Namen en versies veranderen bijna elk jaar.'
      },
      {
        prompt: 'In welk rijtje staan alleen chatbots?',
        leerdoel: LD_7_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'ChatGPT, Google Gemini en TalkAI.', correct: true, explanation: 'Met alle drie voer je een gesprek via tekst.' },
          { text: 'Word, Excel en PowerPoint van Microsoft.', correct: false, misconception: 'Verwart een chatbot met een programma van Office.' },
          { text: 'Instagram, Snapchat en BeReal op je telefoon.', correct: false, misconception: 'Verwart een chatbot met social media.' }
        ],
        feedback: 'Mooi. Microsoft Copilot en Meta AI horen ook in dat rijtje.'
      },
      {
        prompt: 'Hoe noemen we de opdracht die je geeft aan een chatbot?',
        leerdoel: LD_7_3[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'samen_oefenen',
        options: [
          { text: 'Een taak die je in je agenda zet.', correct: false, misconception: 'Denkt aan een schooltaak in plaats van aan een opdracht voor de bot.' },
          { text: 'Een zoekopdracht in de balk van Google.', correct: false, misconception: 'Verwart chatten met zoeken op internet.' },
          { text: 'Een prompt.', correct: true, explanation: 'Dat is het woord voor de vraag of opdracht die jij intypt.' }
        ],
        feedback: 'Goed. Dat woord ga je zo bij TalkAI meteen gebruiken.'
      },
      {
        prompt: 'Welk onderdeel ontbreekt in deze prompt: leg uit hoe een vulkaan werkt, voor een leerling van 12 jaar?',
        leerdoel: LD_7_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Het onderwerp, want er staat nergens waar het precies over moet gaan.', correct: false, misconception: 'Ziet niet dat de vulkaan al het onderwerp is.' },
          { text: 'De lengte, want er staat niet hoe lang het moet zijn.', correct: true, explanation: 'De opdracht, het onderwerp en de doelgroep staan er wel al in.' },
          { text: 'De doelgroep, want er staat niet voor wie het is.', correct: false, misconception: 'Leest over de leerling van 12 jaar heen.' }
        ],
        feedback: 'Scherp gelezen. Drie onderdelen stonden er al, eentje niet.'
      },
      {
        prompt: 'Een duidelijke prompt levert een beter antwoord op.',
        waar: true,
        leerdoel: LD_7_3[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Vage woorden zoals doe maar iets geven een vaag antwoord.'
      },
      {
        prompt: 'Wat doe je met de moeilijke begrippen in je Word-tekst?',
        leerdoel: LD_7_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik zet ze in een andere kleur en helemaal in hoofdletters.', correct: false, misconception: 'Denkt dat elke opvallende opmaak hetzelfde werkt.' },
          { text: 'Ik haal ze weg, want dan leest de tekst een stuk makkelijker.', correct: false, misconception: 'Denkt dat moeilijke woorden beter kunnen verdwijnen.' },
          { text: 'Ik maak ze dikgedrukt.', correct: true, explanation: 'Dikgedrukt laat zien welke woorden bij het onderwerp horen.' }
        ],
        feedback: 'Prima. Zo ziet je lezer meteen welke woorden belangrijk zijn.'
      },
      {
        prompt: 'Je mag de tekst van een chatbot letterlijk in je werkstuk kopieren.',
        waar: false,
        leerdoel: LD_7_3[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Hulp vragen mag wel; overschrijven in eigen woorden hoort erbij.'
      },
      {
        prompt: 'Je hebt een antwoord van de chatbot in Word geplakt. Noem drie dingen die je aan de opmaak doet.',
        type: 'open',
        leerdoel: LD_7_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Ik zet een titel bovenaan, zodat je meteen ziet waar het over gaat. Ik kies lettertype Calibri en tekstgrootte 12, want dat leest rustig. En ik maak de moeilijke begrippen dikgedrukt. Daarna schrijf ik de tekst nog in mijn eigen woorden over.',
        nakijkpunten: [
          'Er staan drie opmaakdingen in uit het rijtje van de theorie.',
          'Bij minstens een ervan staat waarom je dat doet.'
        ],
        feedback: 'Netjes. Je noemt de opmaak en je weet ook waarom hij helpt.'
      }
    ]
  },

  '7.5': {
    learningGoals: LD_7_5,
    theorie: [
      {
        keyTerms: ['kunstmatige intelligentie', 'AI-afbeelding'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Wat heb je in dit hoofdstuk geleerd? Noem per paragraaf een ding.</p>',
          '<p><strong>Antwoord.</strong> Uit 7.1: wat AI is en dat het leert van data. Uit 7.2: een voordeel, een gevaar en hoe je een nepplaatje herkent. Uit 7.3: wat een chatbot is en hoe je een prompt schrijft. Kun je dit hardop opzeggen zonder terug te kijken? Dan zit het erin.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['checkpoint', 'herstelspoor'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi vraagt een chatbot: wanneer werd de eerste iPhone verkocht? Hij krijgt een jaartal. Wat doet Ravi nu?</p>',
          '<p><strong>Antwoord.</strong> Ravi loopt de drie vragen langs. Klopt dit helemaal? Dat weet hij niet. Hoe weet hij dat? Hij weet het eigenlijk niet zeker. Kan hij het controleren op een andere website? Ja. Hij zoekt het na op een nieuwssite. Daar staat 2007, en dat komt overeen. Pas nu gebruikt Ravi dat jaartal in zijn werkstuk.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>AI leert van data en denkt niet zoals jij. Een chatbot verzint soms iets, en dat heet hallucinatie. Controleer daarom elk antwoord op een andere website. Ging er een vraag mis in de toets? Volg dan het herstelspoor van die paragraaf.</p>',
      keyTerms: ['hallucinatie', 'herstelspoor']
    },
    vragen: [
      {
        prompt: 'Welke zin klopt over kunstmatige intelligentie?',
        leerdoel: LD_7_1[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'AI is een machine die altijd een lichaam en armen heeft.', correct: false, misconception: 'Denkt dat AI hetzelfde is als een robot.' },
          { text: 'AI is een computerprogramma dat taken van mensen doet.', correct: true, explanation: 'Denk aan leren, plannen en kiezen; dat deden vroeger alleen mensen.' },
          { text: 'AI is een website waarop je alle antwoorden kunt opzoeken.', correct: false, misconception: 'Verwart AI met een zoekmachine of een encyclopedie.' }
        ],
        feedback: 'Goed. Het lichaam hoort er niet bij, het programma wel.'
      },
      {
        prompt: 'Een algoritme is een vaste volgorde van stappen.',
        waar: true,
        leerdoel: LD_7_1[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt helemaal. De computer loopt die stappen af om te kiezen.'
      },
      {
        prompt: 'Waarvan wordt een AI beter?',
        leerdoel: LD_7_1[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Van heel veel data.', correct: true, explanation: 'Hoe meer voorbeelden het systeem krijgt, hoe beter het wordt.' },
          { text: 'Van een goed gevoel voor wat mensen willen horen.', correct: false, misconception: 'Denkt dat AI aanvoelt wat mensen bedoelen.' },
          { text: 'Van een snelle internetverbinding thuis en op school.', correct: false, misconception: 'Verwart snelheid van internet met slimmer worden.' }
        ],
        feedback: 'Prima. Data is gewoon een ander woord voor voorbeelden.'
      },
      {
        prompt: 'AI heeft gevoelens en weet dat het bestaat.',
        waar: false,
        leerdoel: LD_7_1[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Sterk. AI simuleert alleen; er zit geen bewustzijn achter.'
      },
      {
        prompt: 'Bij welk voorbeeld werkt AI voor jou?',
        leerdoel: LD_7_1[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je fiets die piept als je remt bij het stoplicht.', correct: false, misconception: 'Denkt dat elk apparaat dat reageert met AI werkt.' },
          { text: 'Een blocnote waarop jij zelf je huiswerk opschrijft.', correct: false, misconception: 'Denkt dat alles wat met school te maken heeft meetelt.' },
          { text: 'Je muziek-app die weet wat jij leuk vindt.', correct: true, explanation: 'Die app leert van elk nummer dat jij afspeelt of overslaat.' }
        ],
        feedback: 'Goed gezien. Leren van jouw gedrag is het kenmerk.'
      },
      {
        prompt: 'Alexa en Google Home werken zonder kunstmatige intelligentie.',
        waar: false,
        leerdoel: LD_7_1[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Knap. Ze moeten jouw stem herkennen, en daar is AI voor nodig.'
      },
      {
        prompt: 'Wat is een voordeel van AI?',
        leerdoel: LD_7_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'AI zoekt heel snel patronen in veel gegevens.', correct: true, explanation: 'Daarom vindt een arts met AI sneller iets terug op een scan.' },
          { text: 'AI zorgt dat er nooit meer fouten gemaakt worden.', correct: false, misconception: 'Denkt dat AI altijd gelijk heeft.' },
          { text: 'AI bewaart al jouw persoonlijke gegevens veilig thuis.', correct: false, misconception: 'Denkt dat AI juist goed is voor je privacy.' }
        ],
        feedback: 'Precies. Snelheid en patronen zijn de kracht van AI.'
      },
      {
        prompt: 'AI kan een privacyprobleem geven.',
        waar: true,
        leerdoel: LD_7_2[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Er worden gegevens verzameld zonder dat jij het merkt.'
      },
      {
        prompt: 'Waaraan zie je vaak dat een foto door AI gemaakt is?',
        leerdoel: LD_7_2[1],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De foto is altijd zwart-wit in plaats van in kleur.', correct: false, misconception: 'Denkt dat AI-beeld aan de kleuren te zien is.' },
          { text: 'Er staat een klein watermerk in de rechterbovenhoek.', correct: false, misconception: 'Denkt dat elk AI-plaatje netjes gemarkeerd wordt.' },
          { text: 'Aan een hand met zes vingers.', correct: true, explanation: 'Kleine details zoals vingers en oren gaan het vaakst mis.' }
        ],
        feedback: 'Goed. Zoom altijd in op de handen, de ogen en de randen.'
      },
      {
        prompt: 'AI controleert zelf of een plaatje echt kan bestaan.',
        waar: false,
        leerdoel: LD_7_2[1],
        denkniveau: 'begrijpen',
        niveau: 'plus',
        rol: 'zelf_proberen',
        feedback: 'Scherp. Het model kijkt nooit na of het klopt; daarom die zesde vinger.'
      },
      {
        prompt: 'Welke van deze dingen typ je nooit in bij een chatbot?',
        leerdoel: LD_7_2[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Je huisadres.', correct: true, explanation: 'Daarmee weet iemand precies waar jij woont.' },
          { text: 'Een vraag over de regels van basketbal.', correct: false, misconception: 'Denkt dat een gewone schoolvraag ook risico geeft.' },
          { text: 'De opdracht om een verhaal van 100 woorden te maken.', correct: false, misconception: 'Denkt dat een schrijfopdracht persoonlijk is.' }
        ],
        feedback: 'Goed. Vragen stellen is veilig, gegevens weggeven niet.'
      },
      {
        prompt: 'Achter een chatbot zit een bedrijf met mensen.',
        waar: true,
        leerdoel: LD_7_2[2],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Daarom weet je nooit wie jouw tekst later leest.'
      },
      {
        prompt: 'Welke chatbot zit in Word en in de browser Edge?',
        leerdoel: LD_7_3[0],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Meta AI, de chatbot van Facebook en Instagram.', correct: false, misconception: 'Verwart de chatbot van Meta met die van Microsoft.' },
          { text: 'TalkAI, de gratis chatbot voor leerlingen.', correct: false, misconception: 'Denkt dat de chatbot uit de les overal ingebouwd zit.' },
          { text: 'Microsoft Copilot.', correct: true, explanation: 'Copilot is van Microsoft, en Word en Edge zijn dat ook.' }
        ],
        feedback: 'Mooi. De naam Microsoft staat er bij allebei voor.'
      },
      {
        prompt: 'Een chatbot bij de klantenservice geeft vaak vaste antwoorden.',
        waar: true,
        leerdoel: LD_7_3[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Goed. Dat is de simpele soort; die denkt niet met je mee.'
      },
      {
        prompt: 'In deze prompt ontbreekt een onderdeel: maak een lijstje met tips over gamen, in 5 punten. Wat mist er?',
        leerdoel: LD_7_3[1],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'De doelgroep, dus voor wie het bedoeld is.', correct: true, explanation: 'Er staat nergens dat het voor een leerling van 12 jaar is.' },
          { text: 'De lengte, dus hoeveel punten het moeten worden.', correct: false, misconception: 'Leest over de 5 punten heen.' },
          { text: 'Het onderwerp, dus waar het lijstje over moet gaan.', correct: false, misconception: 'Ziet niet dat gamen al het onderwerp is.' }
        ],
        feedback: 'Scherp. Drie onderdelen stonden er al netjes in.'
      },
      {
        prompt: 'Schrijf een prompt over jouw lievelingssport. Zet er de opdracht, het onderwerp, de doelgroep en de lengte in.',
        type: 'open',
        leerdoel: LD_7_3[1],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Leg in 6 zinnen uit hoe je een goede sprint maakt bij atletiek, voor een leerling van 12 jaar. De opdracht is uitleggen. Het onderwerp is een goede sprint bij atletiek. De doelgroep is een leerling van 12 jaar. De lengte is 6 zinnen.',
        nakijkpunten: [
          'De prompt bevat een opdracht, een onderwerp, een doelgroep en een lengte.',
          'De leerling kan de vier onderdelen in zijn eigen zin aanwijzen.'
        ],
        feedback: 'Netjes gebouwd. Je prompt zegt precies wat je wil hebben.'
      },
      {
        prompt: 'Je zet een antwoord van de chatbot in je werkstuk. Wat doe je eerst?',
        leerdoel: LD_7_3[2],
        denkniveau: 'toepassen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Ik schrijf de tekst in mijn eigen woorden over.', correct: true, explanation: 'Een werkstuk schrijf je zelf; van overschrijven leer je ook meer.' },
          { text: 'Ik plak de tekst er precies zo in als de chatbot hem gaf.', correct: false, misconception: 'Denkt dat kopieren mag zolang de tekst maar goed is.' },
          { text: 'Ik zet er de naam van de chatbot als schrijver boven.', correct: false, misconception: 'Denkt dat een bronvermelding het kopieren goedmaakt.' }
        ],
        feedback: 'Goed. Hulp vragen mag, je werkstuk laten maken niet.'
      },
      {
        prompt: 'Leg in drie zinnen uit hoe AI werkt en waar je op moet letten.',
        type: 'open',
        leerdoel: LD_7_5[0],
        denkniveau: 'uitleggen',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'AI is een computerprogramma dat leert van heel veel data, dus van voorbeelden. Het denkt niet zoals een mens; het doet alleen na wat het geleerd heeft. Daarom kan het fouten maken, en deel je er nooit persoonlijke gegevens mee.',
        nakijkpunten: [
          'Er staat in dat AI leert van data of voorbeelden.',
          'Er staat in dat AI niet denkt zoals een mens.',
          'Er staat een punt in waar je op moet letten, zoals fouten of gegevens.'
        ],
        feedback: 'Sterk. Je uitleg zit in drie zinnen en er staat geen fout in.'
      },
      {
        prompt: 'Maken chatbots fouten?',
        leerdoel: LD_7_5[1],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        options: [
          { text: 'Nee, ze weten precies hoe alles zit en hebben altijd gelijk.', correct: false, misconception: 'Denkt dat een chatbot alles kan opzoeken en dus nooit misgaat.' },
          { text: 'Ja, soms verzinnen ze iets. Dat heet hallucinatie.', correct: true, explanation: 'De bot vult iets in als hij het antwoord niet zeker weet.' },
          { text: 'Het kan wel, maar het gebeurt eigenlijk bijna nooit.', correct: false, misconception: 'Onderschat hoe vaak een chatbot iets verzint.' }
        ],
        feedback: 'Precies. Zeker klinken en gelijk hebben zijn twee verschillende dingen.'
      },
      {
        prompt: 'Een chatbot schrijft dat een dolfijn een vis is. Hoe controleer je of dat klopt? Noem twee stappen.',
        type: 'open',
        leerdoel: LD_7_5[1],
        denkniveau: 'maken_controleren',
        niveau: 'basis',
        rol: 'bewijs_leveren',
        modelAnswer: 'Stap 1: ik vraag me af of dit helemaal klopt en hoe ik dat weet. Ik twijfel, want een dolfijn ademt lucht. Stap 2: ik zoek het na op een website die ik vertrouw, bijvoorbeeld die van een dierentuin. Daar staat dat een dolfijn een zoogdier is. De chatbot had dus ongelijk.',
        nakijkpunten: [
          'Er staan twee stappen in, waarvan er een het controleren op een andere site is.',
          'Er staat bij welke bron de leerling zou gebruiken.'
        ],
        feedback: 'Goed. Je twijfelt niet alleen, je zoekt het ook echt na.'
      },
      {
        prompt: 'AI denkt precies zoals een mens denkt.',
        waar: false,
        leerdoel: LD_7_5[0],
        denkniveau: 'begrijpen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Knap. Jij weet dat AI alleen nadoet wat het geleerd heeft.'
      },
      {
        prompt: 'In Word gebruik je tekstgrootte 11 of 12.',
        waar: true,
        leerdoel: LD_7_3[2],
        denkniveau: 'herkennen',
        niveau: 'basis',
        rol: 'zelf_proberen',
        feedback: 'Klopt. Samen met Arial of Calibri leest je tekst dan rustig.'
      }
    ]
  }
};
