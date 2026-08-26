// Hoofdstuk 5 - Jouw digitale wereld: normen, waarden en online kopen.
// Kaderberoepsgerichte leerweg (kb).
//
// Bron: het Wikiwijs-arrangement "Digitale Geletterdheid" van DaCapo College.
//   5.1 en 5.2  <- les 9  "Jouw digitale wereld (normen en waarden)"
//   5.3 en 5.4  <- les 10 "Online shoppen en betalen"
//   5.5         <- toegevoegd checkpoint, geen Wikiwijs-bron
//
// De kb-versie heeft DEZELFDE onderwerpen, dezelfde volgorde en dezelfde
// leerdoelen als tl/h5.mjs, maar is opnieuw geschreven op kaderniveau:
//   - zinnen van ongeveer 12 tot 15 woorden, een idee per zin;
//   - elk begrip krijgt EERST een voorbeeld en wordt daarna pas gebruikt;
//   - meer hoe dan waarom: stappen, volgordes en concrete handelingen;
//   - theorie en doen wisselen elkaar af. Nergens staan meer dan zes zinnen
//     achter elkaar. Tussen de leesstukken staan opsommingen en korte
//     "Even doen"-taakjes van hooguit een halve minuut, zodat een kaderleerling
//     nooit een lange lap tekst uit moet zitten voor hij iets mag doen.
//
// GEMETEN (scripts/seed-structuur/kb/h5.mjs, tien theorieblokken)
// ---------------------------------------------------------------
// 66 prosezinnen in de <p>-alinea's, gemiddeld 12,9 woorden: midden in de
// kb-band van 12 tot 15. Langste zin 18 woorden, geen enkele boven de 22.
// Tel je de 78 opsommingsregels mee, dan zakt het gemiddelde naar 11,0: die
// regels zijn bewust kort. Ter vergelijking: tl/h5.mjs zit op 16,4 woorden.
// Langste run losse zinnen binnen een alinea: 6. Acht van de tien
// theorieblokken zitten in de blauwdrukband van 150 tot 250 woorden.
//
// De twee blokken van 5.4 zitten daarboven (366 en 327 woorden) en dat is een
// bewuste, gedwongen uitzondering. helpers.mjs geeft elke paragraaf precies
// twee theorieblokken, en les 10 stopt in deze ene paragraaf vier
// betaalmethodes (iDEAL, Klarna, creditcard met vier voordelen, Apple Pay en
// Google Pay met Zoek mijn iPhone) plus het hele douanestuk met de vijf
// risico's van Temu en Shein en het containerverhaal. Er mag niets uit de bron
// verdwijnen, en op kaderniveau kost elk begrip bovendien eerst een voorbeeld.
// In 500 woorden past dat niet. Wat er tegenover staat: 5.4 is opgeknipt in
// vijftien alinea's met drie opsommingen en twee "Even doen"-taakjes, de
// langste leesrun is vijf zinnen, en direct na de theorie volgen het oefenblok
// en drie mediablokken. De vorige ronde had hier runs van 10, 8 en 12 zinnen
// en 766 woorden op rij; dat is nu 693 woorden in korte brokken.
// Er is niets uit de bron weggelaten. Elke alinea, opdracht, stap, link en
// verwijzing naar beeld of video uit les 9 en les 10 komt terug:
//
//   les 9  -> 5.1: de zes voorbeelden van je digitale wereld, de zes apps uit
//             de apptabel, normen en waarden met beide voorbeelden, de vier
//             gedragsregels, en de opdrachten 1, 2 en 3 met de vier Google-
//             stappen naar een Creative Commons-afbeelding.
//   les 9  -> 5.2: de vijf gegevens die je privé houdt, de vier privacytips,
//             het rapporteren, opdracht 4, opdracht 5 met veiliginternetten.nl,
//             de inlevercontrolelijst van vijf punten, de Wikiwijs-afsluittoets
//             (8316631) met haar vijf vragen, en de afsluitlijst "Vandaag heb
//             je geleerd" met zes punten.
//   les 10 -> 5.3: wat online shoppen is, de vervoersbedrijven, iDEAL en
//             versleuteling, de vijf checks, de video over malafide webshops
//             (4DjnfsEIMcQ) en de twee casussen (goedkopegames.nl en
//             www.nike_sport.com) met hun antwoordopties.
//   les 10 -> 5.4: Klarna met het incassobureau, de creditcard met haar vier
//             voordelen, Temu/Shein/China met twee voordelen en vijf risico's,
//             betalen met telefoon of smartwatch, de koppeloefening met zes
//             paren, het douanestuk met het rekenvoorbeeld van 10 + 4 + 3 euro,
//             de twee video's (tkQ94YrCmVA en cWxyahVVIBo), de douanepagina
//             over extra kosten, de afsluitlijst "Je weet nu" met vier
//             punten en de reflectieopdracht over de gouden tip.
//
// DRIE PLEKKEN WAAR DE KB-VERSIE BEWUST AFWIJKT VAN DE BRON
// ---------------------------------------------------------
// 1. Het douanestuk staat in de bron onder het kopje "Extra stof/verdieping
//    VMBO-T". Het jaarplan geeft leerdoel "Je weet dat je bij kopen buiten de
//    EU invoerrechten en btw kunt moeten betalen" ook aan kb, dus het staat
//    hier gewoon in 5.4. Wel op kb-niveau: het mechanisme (wie rekent wat, en
//    wanneer krijg je die rekening) en niet het rekenwerk.
// 2. Het rekenvoorbeeld van de bron (hoesje van 10 euro, 4 euro invoerrechten
//    en 3 euro btw, samen 17 euro) staat er letterlijk in, maar met de
//    waarschuwing erbij dat bedragen en regels veranderen. De tekst wijst voor
//    het actuele bedrag naar de douane. De Belastingdienst-URL uit links.txt
//    geeft inmiddels een 404, dus daar staat nu de levende pagina van de
//    Douane voor in de plaats:
//    douane.nl/onderwerpen/online-shoppen-en-pakketpost/shoppen-bij-een-
//    buitenlandse-webwinkel/extra-kosten-bij-bestellen/ (laatst bijgewerkt
//    18-08-2026). Die pagina noemt btw, invoerrechten, accijns en
//    afhandelingskosten en legt de regel van 1 juli 2026 uit. Dezelfde pagina
//    staat als mediablok in 5.4. Een brugklasser onthoudt zo het mechanisme
//    en niet een bedrag dat volgend jaar niet meer klopt.
// 3. LEEFTIJDSGRENS TOEGEVOEGD. De bron behandelt Klarna en de creditcard
//    zonder te zeggen vanaf welke leeftijd dat mag. Voor een klas van twaalf-
//    en dertienjarigen kan dat niet: achteraf betalen en een creditcard zijn
//    kopen op krediet en mogen pas vanaf 18 jaar. Die grens staat nu in 5.4,
//    in 5.5 en in de hoofdstuktoets. De bron zelf behandelt Klarna al als
//    risico (boete, incassobureau, doorgifte aan instanties), dus dit scherpt
//    de bron aan en spreekt hem niet tegen.
//
// 5.5 IS TOEGEVOEGD EN HEEFT GEEN WIKIWIJS-BRON
// ---------------------------------------------
// De theorie van 5.5 is in eigen woorden geschreven, met de bron in de tekst
// zelf genoemd: ACM ConsuWijzer (consument.acm.nl), de toezichthouder die de
// checklist "Eerst checken, dan bestellen" uitbrengt en waar je een webshop
// meldt; de politie voor aangifte; en voor beeld dat weg moet eerst een
// volwassene, met Helpwanted.nl er apart naast voor het geval waar dat loket
// echt voor is: seksueel beeld van jezelf. De checklist van ACM staat als
// mediablok bij 5.5.
//
// De verrijking (leerdoelen, kernbegrippen, uitgewerkte voorbeelden,
// samenvattingen en alle toetsvragen) staat in
// scripts/seed-verrijking/kb/h5.mjs.

import { p, checkpoint, media } from '../helpers.mjs';

const LD_5_1 = [
  'Je kunt uitleggen wat jouw digitale wereld is.',
  'Je weet wat normen en waarden zijn en hoe ze online gelden.',
  'Je kunt drie gedragsregels noemen die online belangrijk zijn.'
];

const LD_5_2 = [
  'Je weet welke persoonlijke gegevens je beter privé houdt.',
  'Je kunt je account op privé zetten en je bio veilig invullen.',
  'Je weet hoe en waarom je een bericht rapporteert.'
];

const LD_5_3 = [
  'Je kunt vijf checks doen om te zien of een webshop betrouwbaar is.',
  'Je weet waar je op moet letten in de URL en bij het slotje.',
  'Je kunt uitleggen waarom een te lage prijs een waarschuwing is.'
];

const LD_5_4 = [
  'Je weet wat iDEAL, Klarna, een creditcard en Apple Pay of Google Pay zijn.',
  "Je kunt de risico's van achteraf betalen uitleggen.",
  'Je weet dat je bij kopen buiten de EU invoerrechten en btw kunt moeten betalen.'
];

const LD_5_5 = [
  'Je kunt een webshop en een betaalmethode beoordelen voordat je bestelt.',
  'Je kunt uitleggen welke gedragsregels jij online belangrijk vindt.'
];

export default {
  chapter: 5,
  chapterTitle: 'Jouw digitale wereld: normen, waarden en online kopen',
  badge: 'Bewust Online',
  paragraphs: [
    p('5.1', 'Jouw digitale wereld: normen, waarden en gedragsregels', ['23B', '23C'],
      "presentatiedia's over jouw digitale wereld, jouw normen en waarden en jouw socials", 100, 'Normen Navigator',
      ['Wat is jouw digitale wereld?',
        'Je zit vast vaak op je telefoon, je laptop, je console of op social media. ' +
        'Maar wat doe je daar eigenlijk, en welke regels gelden daar? ' +
        'Alles wat jij via een scherm doet en wat met internet te maken heeft, heet je digitale wereld. ' +
        'Hier zijn zes voorbeelden uit de les; ze horen er alle zes bij.' +
        '</p><ul>' +
        '<li>Op je telefoon scrollen.</li>' +
        '<li>Games spelen met anderen.</li>' +
        "<li>Foto's posten op social media.</li>" +
        '<li>Chatten met vrienden.</li>' +
        '<li>Dingen opzoeken op internet.</li>' +
        "<li>Video's kijken op YouTube of TikTok.</li>" +
        '</ul><p>' +
        'Iedereen heeft een andere digitale wereld: de een gamet veel, de ander post op TikTok. ' +
        'Denk even na wat jij het meest online doet, en op welk apparaat dat gebeurt. ' +
        'De apps hieronder ken je vast wel, en elke app heeft zijn eigen sfeer.' +
        '</p><ul>' +
        "<li>TikTok: korte video's maken en delen.</li>" +
        "<li>Instagram: foto's en video's posten.</li>" +
        "<li>Snapchat: foto's sturen die verdwijnen.</li>" +
        '<li>WhatsApp: berichten en media sturen in groepen.</li>' +
        "<li>BeReal: echte, onbewerkte foto's delen.</li>" +
        '<li>Discord: chatten, vooral over games.</li>' +
        '</ul><p>' +
        'Elke app heeft dus een eigen sfeer, maar overal gelden dezelfde regels voor goed gedrag. ' +
        'Je werkt in deze paragraaf in PowerPoint. ' +
        'Open PowerPoint, start een nieuwe presentatie en sla die meteen op. ' +
        'Geef hem de naam digitale_wereld_jouwvoornaam_jouwklas, precies zoals de les dat vraagt. ' +
        'Kies een plek die je makkelijk terugvindt, bijvoorbeeld je eigen map in OneDrive. ' +
        'Lees telkens de theorie tot je een opdracht ziet, voer die uit en lees dan verder.'],
      ['Normen, waarden en gedragsregels',
        'Eerst een voorbeeld: Sem vindt eerlijkheid belangrijk, dus hij spiekt niet bij een toets. ' +
        'Dat wat Sem belangrijk vindt heet een waarde, en wat hij dan doet heet een norm. ' +
        'Een waarde is dus iets wat jij vanbinnen belangrijk vindt, zoals eerlijkheid, respect of vrijheid. ' +
        'Een norm is de gedragsregel die daaruit volgt en die zegt wat wel of niet hoort. ' +
        'Hieronder staan de twee voorbeelden die de les van dat verband geeft.' +
        '</p><ul>' +
        '<li>Waarde: respect. Norm: je scheldt mensen niet uit.</li>' +
        '<li>Waarde: veiligheid. Norm: je deelt geen privégegevens.</li>' +
        '</ul><p>' +
        'Deze normen en waarden gelden ook online, net zo goed als in het echte leven. ' +
        'Dat je de ander niet ziet zitten, verandert die regel geen millimeter. ' +
        'Gedragsregels zijn afspraken over hoe je je hoort te gedragen tegenover anderen. ' +
        'Vier gedragsregels zijn online altijd goed, dus leer dit rijtje uit je hoofd.' +
        '</p><ul>' +
        '<li>Je scheldt of pest niemand.</li>' +
        '<li>Je vraagt toestemming voordat je iemand op een foto zet.</li>' +
        "<li>Je deelt geen dingen die niet van jou zijn. Dus geen foto's, kunst of muziek van anderen.</li>" +
        '<li>Je denkt na voordat je iets plaatst.</li>' +
        '</ul><p>' +
        'De laatste regel is de sterkste van de vier, en dat komt door het verschil in tijd. ' +
        'Een opmerking in de klas is na een uur vergeten en niemand denkt er nog aan. ' +
        'Een bericht of foto online wordt gekopieerd, gescreenshot en doorgestuurd naar anderen. ' +
        'Zoiets duikt jaren later zomaar weer op, en daarom denk je eerst na voor je plaatst.'],
      media('https://schooltv.nl/video-item/nettiquette-vriendschap', 'Schooltv: Nettiquette', 'Welke gedragsregel uit de video staat nog niet in het lijstje van vier hierboven? Schrijf hem in een zin op.'),
      [
        {
          vraag: 'Voorkennis. Welke vier stappen zet je in Google om een afbeelding te vinden die je mag gebruiken?',
          antwoord: 'Typ je zoekopdracht, klik op images, klik op tools en klik op usage rights. Kies daar Creative Commons.',
          uitleg: 'Een license is een licentie: toestemming om iets te gebruiken. Je hebt deze vier stappen zo weer nodig bij opdracht 1.'
        },
        {
          vraag: 'Voorkennis. Hoe zet je een titel en een afbeelding op een dia in PowerPoint?',
          antwoord: 'Typ in het titelvak of voeg via Invoegen een tekstvak toe. Zet er met Invoegen en dan Afbeeldingen je plaatje bij.',
          uitleg: 'Kies een tekstkleur die goed afsteekt tegen de achtergrond. Anders leest je docent je titel niet.'
        },
        {
          vraag: 'Noem drie plekken waar jij online bent. Zet er per plek bij op welk apparaat dat gebeurt.',
          antwoord: 'Bijvoorbeeld: TikTok op mijn telefoon, gamen op mijn console en huiswerk opzoeken op mijn laptop.',
          uitleg: 'Veel mensen noemen alleen hun grootste app. Gamen, kijken, opzoeken en appen tellen net zo goed mee.',
          leerdoel: LD_5_1[0]
        },
        {
          vraag: 'Wat is volgens jou het verschil tussen iets wat je belangrijk vindt en een regel? Eén zin is genoeg.',
          antwoord: 'Wat je belangrijk vindt heet een waarde. De regel die daaruit volgt heet een norm.',
          uitleg: 'Een waarde zit vanbinnen en zie je niet. Een norm zie je aan iemands gedrag.',
          leerdoel: LD_5_1[1]
        },
        {
          vraag: 'Noem één regel die jij online altijd belangrijk vindt. Zeg er in een paar woorden bij waarom.',
          antwoord: 'Bijvoorbeeld: ik vraag eerst toestemming voor ik iemand op een foto zet.',
          uitleg: 'Je komt er in deze paragraaf vier tegen. Twee gaan over de ander, twee over wat jij plaatst.',
          leerdoel: LD_5_1[2]
        }
      ],
      {
        tekst: 'Werk in je presentatie digitale_wereld_jouwvoornaam_jouwklas en sla hem op een vaste plek op. ' +
          'Opdracht 1: een titeldia maken. Stap 1: maak een titeldia en kies daar een plaatje van internet bij. ' +
          'Stap 2: voeg een tekstvak toe met een goed leesbare kleur tekst. De titel is: De digitale wereld van (jouw voornaam). ' +
          'Weet je niet meer hoe je een afbeelding zoekt die je mag gebruiken? Volg dan deze vier stappen. ' +
          'Weet je het nog wel, dan hoef je die uitleg niet te lezen. ' +
          'Stap 1: typ op Google je zoekopdracht, bijvoorbeeld digitale wereld. Stap 2: klik op images, dan krijg je alleen afbeeldingen. ' +
          'Stap 3: klik op tools. Stap 4: klik op usage rights en kies daar Creative Commons. ' +
          'Een license is een licentie: toestemming om iets te gebruiken. Creative Commons betekent dat je het plaatje voor school mag gebruiken. ' +
          'Sla de afbeelding op een plek op waar je hem terugvindt. Voeg hem daarna in je presentatie in. ' +
          "Opdracht 2: dia's met normen en waarden. Beschrijf welke waarden jij hebt en welke gedragsregels daarbij horen. " +
          'Denk aan regels die thuis voor jou gelden, of aan wat je zelf belangrijk vindt. Ze mogen over online en over offline gaan. ' +
          'Maak voor elke waarde een nieuwe dia. Voeg aan die dia een of meer normen toe die bij die waarde horen. ' +
          'Voeg eventueel een afbeelding toe die met jouw waarden en normen te maken heeft. ' +
          'Opdracht 3: jouw social dia. Voeg een nieuwe dia toe met de titel mijn socials. ' +
          'Beschrijf met tekst of met plaatjes van welke social media apps jij gebruikmaakt. Past het niet op één dia, maak er dan twee. ' +
          'Sla je presentatie op. In paragraaf 5.2 werk je er verder in.',
        label: "Beschrijf per dia kort wat erop staat, of plak de link naar je presentatie. Noem bij opdracht 2 minstens twee waarden met de normen erbij.",
        modelAnswer: 'Mijn presentatie heet digitale_wereld_Yara_1K2 en staat in mijn map in OneDrive. Dia 1 is de titeldia. Daarop staat een Creative Commons-plaatje van een telefoon, met in wit het tekstvak De digitale wereld van Yara. Dia 2 heeft de waarde respect. De normen erbij zijn: ik scheld niemand uit in de klassengroep, en ik stuur geen screenshots van gesprekken door. Dia 3 heeft de waarde veiligheid. De normen erbij zijn: ik vul mijn adres nergens in, en ik zet mijn locatie uit bij foto\'s. Dia 4 heeft de waarde eerlijkheid, met de norm dat ik muziek van anderen niet als mijn eigen werk post. Dia 5 heet mijn socials. Daarop staan de logo\'s van TikTok, WhatsApp, Snapchat en Discord, met per app een regel wat ik daar doe.',
        nakijkpunten: [
          'De titeldia heeft een afbeelding met een Creative Commons-licentie en een leesbaar tekstvak met de juiste titel.',
          'Elke waarde staat op een eigen dia, met minstens één norm die logisch uit die waarde volgt.',
          'De socialdia noemt de apps die de leerling echt gebruikt.',
          'De presentatie heeft de naam digitale_wereld_voornaam_klas en is terug te vinden.'
        ]
      },
      ['Wat is jouw digitale wereld?', 'Welke zes apps staan in de theorie?', 'Wat is het verschil tussen een waarde en een norm?', 'Welke norm hoort bij de waarde veiligheid?', 'Noem drie gedragsregels die online gelden.', 'Waarom denk je eerst na voordat je iets plaatst?'],
      'Sorteer uitspraken bij de juiste waarde en bouw per waarde een set regels die klopt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Zeg om de beurt in één zin wat jouw digitale wereld is. Noem daarbij drie plekken.',
            antwoord: 'Mijn digitale wereld is alles wat ik via een scherm doe en wat met internet te maken heeft.',
            uitleg: 'Wie alleen zijn grootste app noemt, is nog niet klaar. Gamen, kijken en opzoeken tellen ook mee.',
            leerdoel: LD_5_1[0]
          },
          {
            groep: 'samen',
            vraag: 'Zet in de goede volgorde: "ik deel geen privégegevens" en "ik vind veiligheid belangrijk". Leg uit waarom.',
            antwoord: 'Eerst de waarde: ik vind veiligheid belangrijk. Daarna de norm: ik deel geen privégegevens.',
            uitleg: 'De norm volgt altijd uit de waarde. Ken je de waarde, dan kun je zelf een nieuwe regel bedenken.',
            leerdoel: LD_5_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Sanne wil een grappige klassenfoto op haar verhaal zetten. Welke gedragsregel geldt hier? Wat doet ze eerst?',
            antwoord: 'De regel dat je toestemming vraagt. Ze vraagt eerst aan iedereen die herkenbaar op de foto staat of het mag.',
            uitleg: 'Grappig bedoeld is geen toestemming. De ander bepaalt zelf wie hem of haar te zien krijgt.',
            leerdoel: LD_5_1[2]
          },
          {
            groep: 'zelf',
            vraag: 'Kies drie van de zes apps uit de theorie. Schrijf per app in één zin op wat je er doet.',
            antwoord: "Bijvoorbeeld: op TikTok maak je korte video's, op Snapchat stuur je foto's die verdwijnen, op Discord chat je over games.",
            uitleg: "De andere drie zijn Instagram voor foto's en video's, WhatsApp voor berichten in groepen en BeReal voor onbewerkte foto's.",
            leerdoel: LD_5_1[0]
          },
          {
            groep: 'steun',
            vraag: 'Vul in: een waarde is ... en een norm is ... . Geef van allebei één voorbeeld uit je eigen leven.',
            antwoord: 'Een waarde is iets wat jij belangrijk vindt, zoals eerlijkheid. Een norm is de regel die daaruit volgt, zoals niet spieken.',
            uitleg: 'Twijfel je? Een waarde kun je niet zien. Een norm zie je aan gedrag.',
            leerdoel: LD_5_1[1]
          },
          {
            groep: 'plus',
            vraag: 'De vier gedragsregels dekken niet alles. Bedenk een vijfde regel voor een groepsapp. Welke waarde ligt eronder?',
            antwoord: 'Bijvoorbeeld: je zet niemand ongevraagd uit de groep. Daaronder ligt de waarde erbij horen.',
            uitleg: 'Zo werkt het systeem: je begint bij een waarde en maakt daar zelf een regel bij.',
            leerdoel: LD_5_1[2]
          }
        ]
      }),

    p('5.2', 'Privacy beschermen en berichten rapporteren', ['23A', '23B'],
      "afgeronde presentatie met een app-dia en drie topicdia's van veiliginternetten.nl", 100, 'Privacy Schild',
      ['Wat je beter privé houdt',
        'Eerst een voorbeeld: Jayden zet in zijn bio zijn school, achternaam en woonplaats. ' +
        'Een vreemde weet daarmee waar Jayden elke dag is, en dat wil privacy juist voorkomen. ' +
        'Privacy betekent: dingen van jou die persoonlijk zijn en die je niet met iedereen hoeft te delen. ' +
        'Vijf gegevens houd je online beter privé, dus leer dit rijtje uit je hoofd.' +
        '</p><ul>' +
        '<li>Je volledige naam en adres.</li>' +
        '<li>Je telefoonnummer.</li>' +
        '<li>Je school.</li>' +
        '<li>Je locatie.</li>' +
        "<li>Privéfoto's of gênante filmpjes. Gênant betekent: je schaamt je ervoor.</li>" +
        '</ul><p>' +
        'Los van elkaar lijken die gegevens onschuldig, maar samen zijn ze dat niet. ' +
        'Iemand weet dan waar je woont, waar je op school zit en hoe laat je waar bent. ' +
        'Nu de vier tips uit de les; de eerste twee kosten je één minuut werk.' +
        '</p><ul>' +
        '<li>Zet je account op privé.</li>' +
        '<li>Deel geen persoonlijke info in je bio.</li>' +
        '<li>Denk goed na voordat je iets plaatst.</li>' +
        '<li>Vraag jezelf af: zou ik willen dat een leraar of toekomstige werkgever dit ziet?</li>' +
        '</ul><p>' +
        'Je account op privé zetten doe je in de instellingen van de app zelf. ' +
        'Zoek daar het kopje privacy en zet de knop voor een privé-account aan. ' +
        "Vanaf dat moment ziet alleen iemand die jij goedkeurt jouw berichten en foto's. " +
        'In je bio zet je hooguit je voornaam en iets wat je leuk vindt. ' +
        'Je school, je woonplaats en je telefoonnummer horen daar dus niet in.'],
      ['Een bericht rapporteren, en wat je vandaag geleerd hebt',
        'Zie je dat iemand online gepest, bedreigd of lastiggevallen wordt, dan kun je dat melden. ' +
        'Dat melden heet rapporteren, en bijna alle apps hebben daar een eigen knop voor. ' +
        'Zo werkt het in vier stappen, en dat kost je nog geen halve minuut.' +
        '</p><ul>' +
        '<li>Tik op de drie puntjes bij het bericht of het account.</li>' +
        '<li>Kies de Rapporteer-knop, soms heet die Report of Melden.</li>' +
        '<li>Kies de reden, bijvoorbeeld pesten of bedreiging.</li>' +
        '<li>Verstuur je melding en blokkeer de persoon als je dat wilt.</li>' +
        '</ul><p>' +
        '<strong>Even doen:</strong> pak je telefoon en zoek in je eigen app die Rapporteer-knop op.' +
        '</p><p>' +
        'Daarna kijken medewerkers van de app of het bericht tegen de regels is. ' +
        'Zo ja, dan halen zij het weg of sluiten zij het account. ' +
        'De ander ziet niet dat jij het was, dus je hoeft niet bang te zijn. ' +
        'Maak eerst een schermafbeelding als bewijsje, want een weggehaald bericht is echt weg.' +
        '</p><p>' +
        'Gaat het om jou of om een vriend, vertel het dan altijd aan een volwassene. ' +
        'Jij helpt op die manier mee om het internet voor iedereen veiliger te maken. ' +
        'De les sluit af met de zin: vandaag heb je geleerd. Hier staat die lijst van zes.' +
        '</p><ul>' +
        '<li>Wat jouw digitale wereld is.</li>' +
        '<li>Wat normen en waarden zijn.</li>' +
        '<li>Welke gedragsregels online gelden.</li>' +
        '<li>Welke apps er zijn en wat je daar doet.</li>' +
        '<li>Hoe je je privacy beschermt.</li>' +
        '<li>Dat je berichten kunt rapporteren.</li>' +
        '</ul><p>' +
        'Controleer straks nog één keer of je de presentatie goed hebt ingeleverd.'],
      [
        media('https://schooltv.nl/video-item/internet-en-privacy-privacy-is-een-recht', 'Schooltv: internet en privacy, privacy is een recht', 'De video noemt naast vrienden nog iemand anders die jouw gegevens bekijkt. Wie is dat, en wat wil die ermee?'),
        media('https://veiliginternetten.nl/privacyinstellingen-social-media-aanpassen/', 'Veilig internetten: je privacyinstellingen aanpassen', 'Zoek de app op waar jij het meest zit. Welke knop bepaalt daar wie jouw berichten ziet, en waar staat die?'),
        media('https://www.veiliginternetten.nl/', 'Veilig internetten: kies je onderwerp', 'Klik drie onderwerpen aan die jou aanspreken. Schrijf per onderwerp in één zin op wat je er leert.')
      ],
      [
        {
          vraag: 'Welke gegevens van jou mag een vreemde op internet volgens jou niet weten? Noem er drie.',
          antwoord: 'Bijvoorbeeld je volledige naam en adres, je telefoonnummer en je school.',
          uitleg: 'De vijfde is je locatie, en daarna komen privéfoto\'s. Samen vormen ze een compleet plaatje van jouw dag.',
          leerdoel: LD_5_2[0]
        },
        {
          vraag: 'Staat jouw account op privé? Zoek op waar die knop in jouw app staat en schrijf het pad op.',
          antwoord: 'Bijvoorbeeld: instellingen, dan privacy, dan de knop privé-account aanzetten.',
          uitleg: 'Elke app noemt het net anders. Zoek altijd eerst het kopje privacy in de instellingen.',
          leerdoel: LD_5_2[1]
        },
        {
          vraag: 'Iemand stuurt een gemeen bericht over een klasgenoot. Wat kun jij daar in de app mee doen?',
          antwoord: 'Ik kan het bericht rapporteren bij de app en de persoon blokkeren.',
          uitleg: 'Rapporteren is melden bij de app zelf. De app kijkt daarna of het bericht tegen de regels is.',
          leerdoel: LD_5_2[2]
        }
      ],
      {
        tekst: 'Werk verder in je presentatie uit 5.1 en maak hem helemaal af. ' +
          'Opdracht 4: denk na over je digitale wereld. Voeg een nieuwe dia toe. ' +
          'Stap 1: kies een van de social media apps waar je het vaakst op zit. Stap 2: voeg een plaatje toe van het logo van die app. ' +
          'Stap 3: schrijf in korte steekwoorden op wat je het meest in deze app doet. Zet erbij wat de voordelen en de nadelen van deze app zijn. ' +
          'Opdracht 5: oefenen met een website. Ga naar www.veiliginternetten.nl of typ dat adres over in je browser. ' +
          'Klik minimaal 3 verschillende topics aan die jou aanspreken en lees wat ze betekenen. Een topic is een onderwerp. ' +
          'Maak voor elk topic een dia met de titel, een korte uitleg en een kleurtje. Zorg dat je tekst goed leesbaar blijft. ' +
          'Sla je presentatie op en deel hem met je docent zoals dat is uitgelegd. ' +
          'Controleer eerst of alles erin zit. 1: een titeldia met foto en een tekstvak met de titel. ' +
          "2: dia's met jouw normen en waarden. 3: een dia met alle social media apps die jij gebruikt. " +
          '4: een dia over je meest gebruikte app, met de voordelen en de nadelen. ' +
          "5: minimaal 3 dia's met elk een topic van veiliginternetten.nl, elk opgemaakt met een kleurtje. " +
          'Maak daarna de afsluittoets van de les: https://maken.wikiwijs.nl/p/questionnaire/standalone/8316631. Dat is een oefening met 5 vragen. ' +
          'Werkt de link niet? Beantwoord de vragen dan hieronder in je bestand. ' +
          'Vraag 1: je ziet op Instagram een foto van jou die gedeeld is en je bent daar niet blij mee. Wat kun je nu doen? ' +
          'Vraag 2: iemand stuurt een gênante foto van een klasgenoot in de groepsapp. Wat doe jij? ' +
          'Vraag 3: je krijgt een DM van iemand die je niet kent. Een DM is een privébericht. Wat doe jij? ' +
          'Vraag 4: een vriend of vriendin deelt jouw foto zonder te vragen. Wat doe jij? ' +
          'Vraag 5: heb jij je social media op privé staan? Waarom wel of niet?',
        label: 'Lever je afgeronde presentatie in en beantwoord de vijf vragen van de afsluittoets in hele zinnen.',
        modelAnswer: 'Mijn app-dia gaat over TikTok. Ik kijk daar vooral filmpjes over voetbal en dans. Voordelen: het is grappig en ik zie snel nieuwe muziek. Nadelen: ik blijf te lang scrollen en ik zie soms nare filmpjes. Mijn drie topics van veiliginternetten.nl zijn phishing, sterke wachtwoorden en veilig social media gebruiken. Vraag 1: ik vraag degene die de foto plaatste om hem weg te halen. Doet die dat niet, dan rapporteer ik de foto bij Instagram en vertel ik het aan mijn mentor. Vraag 2: ik stuur de foto niet door en ik zeg in de groep dat dit niet oké is. Ik rapporteer het bericht en ik waarschuw de klasgenoot. Vraag 3: ik open geen links en ik stuur geen foto\'s. Ik antwoord niet en ik blokkeer of rapporteer het account. Vraag 4: ik vraag mijn vriend om de foto weg te halen, want ik heb geen toestemming gegeven. Vraag 5: ja, mijn account staat op privé. Alleen mensen die ik goedkeur zien mijn berichten, en dat vind ik veiliger.',
        nakijkpunten: [
          'De app-dia noemt in steekwoorden het gebruik, minstens één voordeel en minstens één nadeel.',
          "Er zijn drie topicdia's van veiliginternetten.nl, elk met titel, korte uitleg en leesbare opmaak.",
          'De vijf vragen zijn beantwoord met een handeling, niet alleen met ja of nee.',
          'Bij minstens één antwoord staat rapporteren, blokkeren of een volwassene inschakelen.'
        ]
      },
      ['Welke vijf gegevens houd je privé?', 'Hoe zet je je account op privé?', 'Wat zet je wel en niet in je bio?', 'Wat betekent rapporteren?', 'Wat gebeurt er nadat je iets gerapporteerd hebt?', 'Waarom maak je eerst een schermafbeelding?'],
      'Ruim een profiel op: haal de gegevens weg die niet openbaar horen te staan.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Lees samen deze bio: "Fenna, 13, DaCapo Sittard, 06-12345678". Streep door wat weg moet en zeg waarom.',
            antwoord: 'De school en het telefoonnummer moeten weg. Haar voornaam en leeftijd mogen blijven staan.',
            uitleg: 'School plus leeftijd verraadt waar zij elke dag is. Een nummer is een directe lijn naar haar.',
            leerdoel: LD_5_2[0]
          },
          {
            groep: 'samen',
            vraag: 'Pak samen één telefoon erbij. Zoek in de instellingen de knop voor een privé-account. Schrijf het pad op.',
            antwoord: 'Bijvoorbeeld: Instellingen, dan Privacy, dan Privé-account aan. Elke app noemt het net iets anders.',
            uitleg: 'Zoek altijd eerst het kopje privacy. Staat er accountprivacy, dan zit je goed.',
            leerdoel: LD_5_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Noem uit je hoofd de vijf gegevens die je online beter privé houdt. Kijk pas daarna terug in de tekst.',
            antwoord: "Je volledige naam en adres, je telefoonnummer, je school, je locatie en privéfoto's of gênante filmpjes.",
            uitleg: 'Kwam je er niet op vijf? Lees theorieblok 1 terug voordat je verdergaat.',
            leerdoel: LD_5_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Schrijf de vier stappen op waarmee je een bericht rapporteert. Zet erbij wat je eerst bewaart.',
            antwoord: 'Drie puntjes, Rapporteer-knop, reden kiezen, versturen. Eerst maak je een schermafbeelding als bewijsje.',
            uitleg: 'Zonder schermafbeelding heb je niets meer als het bericht weg is.',
            leerdoel: LD_5_2[2]
          },
          {
            groep: 'steun',
            vraag: 'Streep door wat niet klopt. In je bio mag: je voornaam / je hobby / je woonplaats / je schoolnaam.',
            antwoord: 'Je woonplaats en je schoolnaam moeten weg. Je voornaam en je hobby mogen blijven.',
            uitleg: 'Alles wat vertelt waar je bent, hoort er niet in. Wat je leuk vindt, mag wel.',
            leerdoel: LD_5_2[1]
          },
          {
            groep: 'plus',
            vraag: 'Nordin zegt: rapporteren heeft geen zin, want ze doen er toch niets mee. Geef twee redenen waarom hij ongelijk heeft.',
            antwoord: 'De app kan het bericht weghalen of het account sluiten. En meerdere meldingen samen wegen zwaarder.',
            uitleg: 'Melden is anoniem, dus het kost jou weinig. De ander weet niet dat jij het was.',
            leerdoel: LD_5_2[2]
          }
        ]
      }),

    p('5.3', 'Veilig online shoppen: is deze webshop te vertrouwen?', ['23A', '21B'],
      'vergelijkingstabel met de vijf checks voor drie webshops', 100, 'Webshop Detective',
      ['Online shoppen en betalen met iDEAL',
        'Online shoppen betekent dat je spullen via internet koopt, zoals kleding, gadgets of games. ' +
        'Dat is handig, maar er zitten ook risico\'s aan die je moet kennen. ' +
        'Je betaalt eerst, en daarna stuurt de winkel jou een pakketje toe. ' +
        'Dat doen vervoersbedrijven zoals PostNL, DHL of UPS, die het bij je thuis bezorgen. ' +
        'Betalen kan op vier manieren, en die leer je in 5.4 helemaal kennen.' +
        '</p><ul>' +
        '<li>iDEAL, dat gaat direct via je bank.</li>' +
        '<li>Creditcard.</li>' +
        '<li>Achteraf betalen, bijvoorbeeld met Klarna.</li>' +
        '<li>Apple Pay of Google Pay, via je telefoon of smartwatch.</li>' +
        '</ul><p>' +
        'Soms koop je bij een Nederlandse webshop, soms bij een buitenlandse zoals Temu of Shein. ' +
        'Elke winkel bepaalt zelf welke betaalmethodes hij zijn klanten aanbiedt.' +
        '</p><p>' +
        '<strong>Even doen:</strong> open een webshop die jij kent en kijk onderaan welke betaalmethodes daar staan.' +
        '</p><p>' +
        'Betalen met iDEAL gaat via de app of de website van jouw eigen bank. ' +
        'Het geld gaat dan meteen van jouw rekening naar de rekening van de verkoper. ' +
        'De betaling zelf is veilig, want jouw gegevens worden onderweg versleuteld. ' +
        'Versleuteld betekent dat je gegevens in geheimtaal staan en dus onleesbaar zijn.' +
        '</p><p>' +
        'Maar let op: dat geld haal je zelf niet meer terug, en de bank ook niet. ' +
        'Daarom controleer je altijd eerst of een winkel wel te vertrouwen is.'],
      ['De vijf checks bij een webshop',
        'Hieronder staan de vijf checks uit de les. ' +
        'De volgorde maakt niet uit, als je ze maar alle vijf doet.' +
        '</p><ul>' +
        '<li>1. Vergelijk prijzen. Veel goedkoper dan bij bol.com? Dat kan een nepwinkel zijn.</li>' +
        '<li>2. Kijk naar het slotje voor het webadres. Klik erop om te zien of de site veilig is.</li>' +
        '<li>3. Check de naam en de URL. Let op toevoegingen zoals -korting of -sale.</li>' +
        '<li>4. Bekijk de website. Spelfouten? Contactgegevens? Werkt het telefoonnummer echt?</li>' +
        '<li>5. Lees reviews: beoordelingen van mensen die daar al kochten. Zoek ze op Google.</li>' +
        '</ul><p>' +
        '<strong>Even doen:</strong> dek het rijtje af en noem de vijf checks hardop op.' +
        '</p><p>' +
        'Nu twee dingen die vaak fout gaan, te beginnen bij het slotje in de adresbalk. ' +
        'Dat betekent alleen dat je gegevens onderweg versleuteld verstuurd worden. ' +
        'Een oplichter regelt zo\'n slotje in vijf minuten en helemaal gratis. ' +
        'Het zegt dus niets over de vraag of deze winkel eerlijk met jou omgaat.' +
        '</p><p>' +
        'Lees een webadres verder altijd tot aan de eerste schuine streep. ' +
        'In www.nike_sport.com is nike_sport de winkelnaam, en dat is niet Nike.' +
        '</p><p>' +
        'Het tweede punt is de prijs, want een veel te lage prijs is een waarschuwing. ' +
        'Een winkel koopt in en verdient er iets aan, dus 80 procent korting kan bijna niet. ' +
        'Zo\'n prijs moet je snel laten klikken, voordat je goed nadenkt. ' +
        'Twijfel je na de vijf checks nog, dan bestel je daar gewoon niet.'],
      media('https://www.youtube.com/embed/4DjnfsEIMcQ', 'Zo herken je een malafide webshop', 'Malafide betekent oneerlijk. Welke van de vijf checks zie je in de video terug? Noem er minstens twee.'),
      [
        {
          vraag: 'Terugblik 5.2. Waarom zet je je account op privé, en wat verandert er dan?',
          antwoord: 'Om mijn privacy te beschermen. Alleen mensen die ik goedkeur zien daarna mijn berichten.',
          uitleg: 'Privé zetten levert geen extra likes op. Het laat ook niet zien wie je profiel bekijkt.',
          leerdoel: LD_5_2[1]
        },
        {
          vraag: 'Je wilt weten of een webshop te vertrouwen is. Welke dingen zou jij nu al controleren? Noem er drie.',
          antwoord: 'Bijvoorbeeld de prijs, het slotje voor de URL en de reviews van andere kopers.',
          uitleg: 'De les noemt er vijf. De andere twee zijn: check de naam en de URL, en bekijk de website goed.',
          leerdoel: LD_5_3[0]
        },
        {
          vraag: 'Wat denk jij dat het slotje voor een webadres betekent? Schrijf je eigen antwoord op.',
          antwoord: 'Het slotje betekent dat je gegevens onderweg versleuteld zijn en dus onleesbaar voor anderen.',
          uitleg: 'Het bewijst niet dat de winkel eerlijk is. Een oplichter kan zo\'n slotje ook aanvragen.',
          leerdoel: LD_5_3[1]
        },
        {
          vraag: 'Een game van 60 euro staat ergens voor 9 euro. Zou jij die kopen? Leg je antwoord uit.',
          antwoord: 'Nee. Een winkel moet die game zelf ook inkopen, dus voor 9 euro verdient hij niets.',
          uitleg: 'Zo\'n prijs is lokaas. Hij is bedoeld om je snel te laten klikken voordat je nadenkt.',
          leerdoel: LD_5_3[2]
        }
      ],
      {
        tekst: 'Deel 1: de twee casussen uit de les. Schrijf per casus je keuze op, met minstens twee zinnen uitleg. ' +
          'Casus 1. Je ziet op een webwinkel producten die je graag wilt kopen. Ze zijn voordeliger dan elders, maar niet veel goedkoper. ' +
          'De URL ziet er goed uit: www.goedkopegames.nl, en er staat een slotje voor. ' +
          'Onderaan de pagina zie je bij contactgegevens geen adres, maar wel een telefoonnummer. ' +
          'Je belt dat nummer. Er wordt niet opgenomen. De volgende dag, op woensdagmiddag, ook niet. En donderdagochtend weer niet. Wat doe je? ' +
          'A: ik bestel de producten gewoon, misschien was het personeel druk. ' +
          'B: ik koop de producten niet. Ik zie geen adres, en een webwinkel heeft altijd een adres, ook een digitale winkel. De telefoon wordt op verschillende momenten niet opgenomen: rode vlag. ' +
          'C: ik koop 1 product om het te proberen. Dan loop ik wel het risico mijn geld kwijt te raken. ' +
          'Casus 2. Je hebt gave sneakers gezien op de Nike-website. De URL is www.nike_sport.com en de site ziet er precies uit zoals die van Nike. ' +
          'Je kunt geen contactgegevens of klantenservice vinden, zoals bij www.nike.com wel kan. Is deze website betrouwbaar? ' +
          'A: nee, grote webwinkels gebruiken alleen hun eigen URL om producten te verkopen. ' +
          'B: ja, Nike gebruikt blijkbaar een tweede URL om speciale sportsneakers te verkopen. ' +
          'Deel 2: je eigen vergelijkingstabel. Kies een product dat je echt zou willen hebben. ' +
          'Zoek drie webshops die het verkopen. Maak in Word een tabel met zes kolommen: de naam van de shop en de vijf checks. ' +
          'Vul per shop bij elke check in wat je gevonden hebt. Schrijf geen ja of nee, maar wat je zag. ' +
          'Zet onder je tabel in drie regels welke shop jij kiest en waarom. Lever je bestand in bij je docent.',
        label: 'Lever in: je antwoord op casus 1 en casus 2 met uitleg, en je vergelijkingstabel met de vijf checks voor drie webshops.',
        modelAnswer: 'Casus 1: ik kies B. Een webwinkel moet altijd een adres tonen, ook als hij alleen online bestaat. Bovendien wordt de telefoon op drie verschillende momenten niet opgenomen. Twee checks vallen dus negatief uit, en dan bestel ik daar niet. Casus 2: ik kies A. De echte winkel van Nike staat op www.nike.com. In www.nike_sport.com staat een lage streep in de naam, en dat is een toevoeging. Er is ook geen klantenservice te vinden, terwijl de echte site die wel heeft. Mijn product is een gamemuis van ongeveer 30 euro. Shop 1 is coolblue.nl: prijs 29,95 net als elders, slotje aanwezig, URL zonder toevoegingen, adres en telefoonnummer staan onderaan, veel reviews op andere sites. Shop 2 is bol.com: prijs 31,00, slotje aanwezig, URL klopt, contactgegevens vindbaar, reviews goed. Shop 3 is game-outlet-deals.net: prijs 11,00, slotje aanwezig, URL heeft twee toevoegingen, geen adres maar alleen een formulier, reviews alleen op de site zelf. Ik kies coolblue.nl. Daar vallen alle vijf de checks goed uit. Bij shop 3 vallen er drie negatief uit, en de prijs is veel te laag.',
        nakijkpunten: [
          'Casus 1 en casus 2 zijn allebei beantwoord met een keuze en minstens twee zinnen uitleg.',
          'De tabel bevat drie webshops en alle vijf de checks.',
          'Per check staat er wat de leerling gevonden heeft, niet alleen ja of nee.',
          'De conclusie noemt de gekozen shop met een reden die uit de tabel volgt.'
        ]
      },
      ['Welke vijf checks doe je bij een webshop?', 'Wat betekent het slotje voor de URL?', 'Wat bewijst het slotje juist niet?', 'Waar in een webadres staat de echte winkelnaam?', 'Waarom is een te lage prijs verdacht?', 'Wat doe je als je na de vijf checks nog twijfelt?'],
      'Vijf webshops langs de checks: geef per shop een oordeel en zie of je de nepwinkel eruit haalt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Noem samen de vijf checks op uit je hoofd, om de beurt één. Welke vergat je allebei?',
            antwoord: 'Prijzen vergelijken, het slotje bekijken, naam en URL checken, de website bekijken en reviews lezen.',
            uitleg: 'Reviews worden het vaakst vergeten. Zoek ze op Google, niet alleen op de site zelf.',
            leerdoel: LD_5_3[0]
          },
          {
            groep: 'samen',
            vraag: 'Lees samen deze twee adressen: www.bol.com en www.bol-sale-korting.com. Welke is echt en waaraan zie je dat?',
            antwoord: 'www.bol.com is echt. In het andere adres staan twee toevoegingen: -sale en -korting.',
            uitleg: 'Lees tot de eerste schuine streep. Wat daarvoor staat, is de echte winkelnaam.',
            leerdoel: LD_5_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Een shop heeft een slotje, maar geen adres en geen reviews buiten de eigen site. Bestel je daar? Leg uit.',
            antwoord: 'Nee. Het slotje zegt alleen iets over versleuteling. Twee andere checks vallen negatief uit.',
            uitleg: 'Eén check die goed gaat, weegt niet op tegen twee die misgaan. Je telt ze samen.',
            leerdoel: LD_5_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Een telefoon van 900 euro staat op een onbekende site voor 120 euro. Leg in twee zinnen uit waarom dat verdacht is.',
            antwoord: 'Een winkel koopt die telefoon zelf ook in en moet er iets aan verdienen. Voor 120 euro kan dat niet.',
            uitleg: 'Zo\'n prijs is er om je te laten haasten. Haast is precies wat een oplichter wil.',
            leerdoel: LD_5_3[2]
          },
          {
            groep: 'steun',
            vraag: 'Vul in: het slotje betekent dat je gegevens ... zijn. Kies uit: versleuteld, gecontroleerd, verzekerd.',
            antwoord: 'Versleuteld. Je gegevens staan onderweg in geheimtaal en zijn onleesbaar voor anderen.',
            uitleg: 'Niemand controleert er de winkel mee. Er zit ook geen verzekering aan vast.',
            leerdoel: LD_5_3[1]
          },
          {
            groep: 'plus',
            vraag: 'Welke van de vijf checks kan een oplichter het makkelijkst nadoen? En welke het moeilijkst? Leg uit.',
            antwoord: 'Het slotje is het makkelijkst, want dat is gratis aan te vragen. Reviews op andere sites zijn het moeilijkst.',
            uitleg: 'Alles wat de winkel zelf in de hand heeft, is na te maken. Daarom kijk je ook buiten de site.',
            leerdoel: LD_5_3[0]
          }
        ]
      }),

    p('5.4', 'Betalen en kopen uit het buitenland', ['23A', '23C'],
      "betaalwijzer met de koppeloefening, drie risico's en jouw gouden tip", 100, 'Betaalroute',
      ['Vier manieren om online te betalen',
        'iDEAL ken je al uit 5.3: je geld gaat meteen naar de verkoper. ' +
        'Klarna is een bank uit Zweden waarmee je achteraf betaalt: je koopt nu en betaalt later. ' +
        'Achteraf betalen is lenen, en daarom mag het pas vanaf 18 jaar. ' +
        'Het voordeel: je betaalt pas als je het product echt hebt. ' +
        'Vergeet je de betaaldatum, dan gaat het zo mis.' +
        '</p><ul>' +
        '<li>Eerst een herinnering, daarna boetes.</li>' +
        '<li>Dan een incassobureau: een bedrijf dat jouw geld alsnog probeert te krijgen.</li>' +
        '<li>Hun kosten komen boven op je rekening.</li>' +
        '<li>Je naam gaat naar instanties, dus organisaties die over geld gaan, zoals banken.</li>' +
        '<li>Later geeft dat problemen bij lenen of een huis kopen.</li>' +
        '</ul><p>' +
        '<strong>Even doen:</strong> reken uit: 40 euro trui, 15 euro boete, 45 euro incassokosten.' +
        '</p><p>' +
        'Een creditcard is een bankpas met krediet; credit is Engels voor krediet. ' +
        'Krediet is geld van de bank en niet van jou, dus je leent het. ' +
        'Lenen kost altijd geld, hoe klein het geleende bedrag ook is. ' +
        'Je kunt ook je eigen geld op de kaart storten, en dat is voordeliger. ' +
        'Ook deze kaart krijg je pas vanaf 18 jaar, en alleen met een maandelijks inkomen.' +
        '</p><p>' +
        'De bank bepaalt aan de hand van jouw inkomen hoeveel krediet je krijgt. ' +
        'Zo\'n kaart kost geld, maar de les noemt vier voordelen.' +
        '</p><ul>' +
        '<li>Je betaalt achteraf en wacht dus eerst je pakketje af.</li>' +
        '<li>De bank helpt bij garantie en bij pakketten die niet aankomen; er zit verzekering op.</li>' +
        '<li>Je krijgt rente over eigen geld op de kaart, als er geen krediet openstaat.</li>' +
        '<li>De kaart werkt ook buiten Europa.</li>' +
        '</ul><p>' +
        'Het nadeel is hetzelfde als bij Klarna: geldproblemen als je te laat terugbetaalt.' +
        '</p><p>' +
        '<strong>Even doen:</strong> zeg hardop waarom Klarna en de creditcard pas vanaf 18 mogen.' +
        '</p><p>' +
        'Tot slot koppel je je bankpas aan je telefoon of smartwatch. ' +
        'Dat doe je met een app zoals Apple Pay of Google Pay. Let op drie dingen.' +
        '</p><ul>' +
        '<li>Je betaalt met een knopje, je gezicht, je vingerafdruk of je toegangscode.</li>' +
        '<li>Wie die code kent, kan ook jouw pas gebruiken. Neem er dus een van zes cijfers.</li>' +
        '<li>Een gestolen telefoon is meteen een betaalpas. Op een iPhone helpt Zoek mijn iPhone.</li>' +
        '</ul><p>' +
        'Doe je dat, dan betaal je met je telefoon net zo veilig als met je pas.'],
      ['Kopen uit China, en de rekening van de douane',
        'Webshops zoals Temu of Shein verkopen goedkope producten, vaak direct uit China. ' +
        'Er zijn twee voordelen: lage prijzen en een groot aanbod. ' +
        'Daar staan vijf risico\'s tegenover.' +
        '</p><ul>' +
        '<li>Producten zijn soms niet veilig, bijvoorbeeld speelgoed en kleding met giftige stoffen.</li>' +
        '<li>Geen garantie, of moeilijk je geld terug als iets kapot is of niet aankomt.</li>' +
        '<li>Invoerrechten of btw: extra kosten buiten de EU. Btw is belasting over de prijs.</li>' +
        '<li>Retourneren, dus terugsturen, kan niet altijd.</li>' +
        '<li>Slecht voor het milieu: veel productie, veel weggooien, giftige stoffen en veel vervoer.</li>' +
        '</ul><p>' +
        '<strong>Even doen:</strong> kies twee van deze risico\'s en schrijf ze in je eigen woorden op.' +
        '</p><p>' +
        'Koop je iets van buiten de EU, dan betaal je soms invoerrechten of btw. ' +
        'Die kosten rekent de douane, en die controleert alles wat het land binnenkomt. ' +
        'De les rekent het voor: je koopt een telefoonhoesje uit China van 10 euro. ' +
        'De douane rekent er 4 euro invoerrechten en 3 euro btw bij, samen 17 euro. ' +
        'Let op: die bedragen en regels veranderen vaak, dus reken ze zelf na.' +
        '</p><p>' +
        'Kijk voor je bestelt op douane.nl, bij Extra kosten bij online bestellingen. ' +
        'Onthoud dus hoe het werkt, en niet het bedrag uit dit voorbeeld.' +
        '</p><p>' +
        'Temu, AliExpress en Shein rekenen weinig of geen verzendkosten voor hun pakketten. ' +
        'Dat kan omdat er zoveel besteld wordt dat alles in één container hierheen gaat. ' +
        'Het verwerken van al die bestellingen kost natuurlijk wel heel veel werk. ' +
        'Daarom betaal je soms extra voor producten van buiten de EU.' +
        '</p><p>' +
        'Andere webwinkels hebben zo\'n uitzondering niet, dus daar loop je altijd risico.' +
        '</p><ul>' +
        '<li>Bij iets duurs kan die rekening oplopen, soms met tientallen euro\'s.</li>' +
        '<li>Je betaalt pas als het product in Nederland is aangekomen.</li>' +
        '<li>Betaal je niet, dan wordt je pakket vernietigd en ben je alles kwijt.</li>' +
        '</ul><p>' +
        'Je weet nu wat iDEAL, Klarna en creditcards zijn en hoe invoerrechten werken. ' +
        'Je kent de risico\'s van Temu en Shein, tot en met het milieu. ' +
        'En je weet dat je moet nadenken voordat je op Bestellen klikt.'],
      [
        media('https://www.youtube.com/embed/tkQ94YrCmVA', 'Achteraf betalen met Klarna', 'Welk risico uit de theorie hierboven zie je in deze video terug? Schrijf het in één zin op.'),
        media('https://www.youtube.com/embed/cWxyahVVIBo', 'Spullen van webshops zoals AliExpress kunnen gevaarlijk zijn', "Lees de tekst hierboven over kopen op Temu, Shein of in China en kijk de video. Noem minimaal 3 risico's."),
        media('https://www.douane.nl/onderwerpen/online-shoppen-en-pakketpost/shoppen-bij-een-buitenlandse-webwinkel/extra-kosten-bij-bestellen/', 'Douane: extra kosten bij online bestellingen', 'De Douane noemt hier meer soorten kosten dan de twee uit de theorie. Schrijf er drie op, en zet erbij hoeveel invoerrechten je nu betaalt bij een pakket tot 150 euro.')
      ],
      [
        {
          vraag: 'Terugblik 5.3. Waarom is een prijs die veel te laag is een waarschuwing?',
          antwoord: 'Een echte winkel koopt het product zelf ook in en wil er iets aan verdienen. Dat kan bij zo\'n prijs niet.',
          uitleg: 'De lage prijs is lokaas. Hij moet je laten klikken voordat je de andere checks doet.',
          leerdoel: LD_5_3[2]
        },
        {
          vraag: 'Noem de vier manieren om online te betalen die je kent. Schrijf op wat je van elk al weet.',
          antwoord: 'iDEAL, creditcard, achteraf betalen zoals met Klarna, en Apple Pay of Google Pay.',
          uitleg: 'Deze vier komen alle vier terug in de koppeloefening van deze paragraaf.',
          leerdoel: LD_5_4[0]
        },
        {
          vraag: 'Wat kan er misgaan als je iets koopt en pas later betaalt? Noem twee dingen.',
          antwoord: 'Je krijgt een boete als je te laat bent. En er kan een incassobureau bij komen, dat kost extra geld.',
          uitleg: 'Er is nog een derde: je naam kan worden doorgegeven aan banken en andere instanties.',
          leerdoel: LD_5_4[1]
        },
        {
          vraag: 'Je bestelt iets uit China. Denk je dat je alleen de prijs van het product betaalt? Leg uit.',
          antwoord: 'Nee, er kunnen invoerrechten en btw bij komen. Die rekent de douane als het pakket hier aankomt.',
          uitleg: 'Kun je die rekening niet betalen, dan wordt je pakket vernietigd. Je bent dan alles kwijt.',
          leerdoel: LD_5_4[2]
        }
      ],
      {
        tekst: 'Maak in Word je eigen betaalwijzer met vier onderdelen. ' +
          'Onderdeel 1: de koppeloefening uit de les. Zet de zes begrippen links en de zes omschrijvingen rechts, en koppel ze. ' +
          'De begrippen zijn: Klarna, Creditcard, iDEAL, Apple Pay/Google Pay, Achteraf betalen, en Shein/Temu/AliExpress. ' +
          'De omschrijvingen zijn: (a) met deze apps koppel je je betaalkaarten aan je smartphone; ' +
          '(b) een Zweedse bank waarmee je achteraf kunt betalen; ' +
          '(c) je betaalt pas als je je product in huis hebt, en te laat betalen geeft een boete na een herinnering; ' +
          '(d) een betaalpas met krediet, die je bij een bank aanvraagt en alleen krijgt met een inkomen en zonder schulden; ' +
          '(e) direct veilig betalen via je bank, waarbij het bedrag meteen naar de webwinkel gaat en je het zelf niet terughaalt; ' +
          '(f) apps waarop je producten uit onder andere China koopt, waarvan veel producten giftig en dus gevaarlijk zijn voor mens en natuur. ' +
          "Onderdeel 2: kijk de video over AliExpress en lees de tekst over Temu, Shein en China. Noem minimaal 3 risico's, elk in een eigen zin. " +
          'Onderdeel 3: de douane. Leg in vijf regels uit wanneer je invoerrechten en btw betaalt en op welk moment je die rekening krijgt. ' +
          'Open daarna het mediablok Douane: extra kosten bij online bestellingen. Zoek daar op wat er nu geldt en schrijf op wanneer je gekeken hebt. ' +
          'Onderdeel 4: de reflectieopdracht uit de les. Je mag één gouden tip geven aan je klasgenoten over online shoppen. Wat is die tip? ' +
          'Schrijf de tip op in één zin en leg in twee zinnen uit waarom juist die tip. Lever je bestand in bij je docent.',
        label: "Lever je betaalwijzer in: de zes koppels, drie risico's, je uitleg over de douane met de datum, en je gouden tip met uitleg.",
        modelAnswer: "Koppels: Klarna hoort bij b, Creditcard bij d, iDEAL bij e, Apple Pay/Google Pay bij a, Achteraf betalen bij c, en Shein/Temu/AliExpress bij f. Drie risico's: 1. De producten zijn soms niet veilig, bijvoorbeeld kleding en speelgoed met giftige stoffen. 2. Er is vaak geen garantie, dus je krijgt je geld moeilijk terug als iets kapot is. 3. Je kunt invoerrechten en btw moeten betalen, en dat zijn extra kosten boven op de prijs. Douane: je betaalt invoerrechten en btw als je iets koopt van buiten de EU. Die kosten rekent de douane, die alles controleert wat het land binnenkomt. In de les staat een hoesje van 10 euro met 4 euro invoerrechten en 3 euro btw, samen 17 euro. Je krijgt die rekening pas als het pakket in Nederland is. Kun je niet betalen, dan wordt het pakket vernietigd. Ik heb het op 26 augustus 2026 nagekeken op douane.nl. Daar staat dat je sinds 1 juli 2026 ook bij pakketten tot 150 euro invoerrechten betaalt, namelijk 3 euro per productsoort. Mijn gouden tip: bestel nooit meteen, maar doe eerst de vijf checks. Ik kies die tip omdat bijna alle problemen beginnen bij haast. Wie eerst de reviews en het adres bekijkt, ontdekt een nepwinkel meestal binnen twee minuten.",
        nakijkpunten: [
          'Alle zes koppels zijn gemaakt en kloppen met de omschrijvingen uit de les.',
          "Er staan minstens drie verschillende risico's van kopen bij Chinese webshops, elk in een eigen zin.",
          'De uitleg over de douane noemt wanneer je betaalt, wie het rekent en wat er gebeurt als je niet betaalt.',
          'De gouden tip is één concrete zin, met twee zinnen uitleg waarom.'
        ]
      },
      ['Wat is iDEAL en wanneer gaat je geld weg?', 'Wat is Klarna en wat gebeurt er bij te laat betalen?', 'Wat doet een incassobureau?', 'Wat is krediet bij een creditcard?', 'Waarvoor gebruik je Apple Pay of Google Pay?', 'Wanneer betaal je invoerrechten en btw?'],
      'Kies per aankoop de slimste betaalmethode en zie welk risico je daarmee neemt.',
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Leg elkaar om de beurt uit wat krediet is. Gebruik daarbij het woord lenen.',
            antwoord: 'Krediet is geld van de bank dat je mag gebruiken. Je leent het dus en je betaalt het later terug.',
            uitleg: 'Wie zegt "geld dat op de kaart staat", is er nog niet. Het gaat om geld dat niet van jou is.',
            leerdoel: LD_5_4[0]
          },
          {
            groep: 'samen',
            vraag: 'Zoek samen het verschil: bij welke betaalmethode is je geld meteen weg, en bij welke pas later?',
            antwoord: 'Bij iDEAL is je geld meteen weg. Bij Klarna en bij een creditcard betaal je pas later.',
            uitleg: 'Meteen weg betekent ook: zelf niet meer terug te halen, en de bank kan daar niets aan doen.',
            leerdoel: LD_5_4[0]
          },
          {
            groep: 'zelf',
            vraag: 'Bo bestelt met Klarna en vergeet de betaaldatum. Schrijf in drie stappen op wat er dan gebeurt.',
            antwoord: 'Ze krijgt een herinnering, daarna een boete, en daarna kan er een incassobureau bij komen.',
            uitleg: 'De kosten van dat bureau komen boven op haar rekening. Zo wordt 20 euro er zomaar 60.',
            leerdoel: LD_5_4[1]
          },
          {
            groep: 'zelf',
            vraag: 'Noem twee risico\'s van kopen bij een Chinese webshop die niets met geld te maken hebben.',
            antwoord: 'De producten zijn soms giftig, en het is slecht voor het milieu door veel productie en vervoer.',
            uitleg: "De risico's met geld zijn: geen garantie, extra kosten en niet kunnen retourneren.",
            leerdoel: LD_5_4[2]
          },
          {
            groep: 'steun',
            vraag: 'Vul in: een incassobureau is ... . Het kost jou geld omdat ... .',
            antwoord: 'Een incassobureau is een bedrijf dat jouw geld alsnog probeert te krijgen. Hun kosten komen boven op je rekening.',
            uitleg: 'Op tijd betalen is dus niet alleen netjes. Het scheelt je ook echt geld.',
            leerdoel: LD_5_4[1]
          },
          {
            groep: 'plus',
            vraag: 'Waarom rekenen Temu en Shein bijna geen verzendkosten, terwijl je bij de douane toch kunt bijbetalen?',
            antwoord: 'Er wordt zoveel besteld dat alles in één grote container hierheen gaat. De douane rekent daarnaast per zending.',
            uitleg: 'Verzendkosten betaal je aan de vervoerder. Invoerrechten en btw betaal je aan de Nederlandse staat.',
            leerdoel: LD_5_4[2]
          }
        ]
      }),

    checkpoint('5.5', 'Checkpoint: bewust online kopen en delen', ['23A', '23B', '23C'],
      'checkpointmap met een webshopoordeel, een betaalkeuze en jouw eigen gedragsregels', 120, 'Bewust Online Challenge',
      ['Wat je nu zelf kunt beoordelen',
        'In dit hoofdstuk kwamen twee dingen samen: hoe jij je online gedraagt en hoe jij online koopt. ' +
        'Dat lijken losse onderwerpen, maar bij allebei klik je iets weg dat niet terugkomt. ' +
        'Bij delen is de vraag: wil ik dat dit over een jaar nog te vinden is? ' +
        'Bij kopen is de vraag: bestaat deze winkel echt en kan ik dit bedrag missen? ' +
        'Je hebt nu voor allebei gereedschap in handen.' +
        '</p><ul>' +
        '<li>Uit 5.1: je eigen waarden met de normen erbij, en de vier gedragsregels.</li>' +
        '<li>Uit 5.2: de vijf gegevens die je privé houdt, je accountinstellingen en de Rapporteer-knop.</li>' +
        '<li>Uit 5.3: de vijf checks bij een webshop, en wat het slotje wel en niet bewijst.</li>' +
        "<li>Uit 5.4: de vier betaalmethodes met hun risico's, en de rekening van de douane.</li>" +
        '</ul><p>' +
        'Een betaalmethode kiezen doe je pas nadat je de winkel helemaal gecontroleerd hebt. ' +
        'Voor jou vallen Klarna en de creditcard af, want die mogen pas vanaf 18 jaar. ' +
        'Er blijft dus iDEAL over, en dat geld is meteen weg en komt niet terug.' +
        '</p><p>' +
        'Ken je de winkel niet? Bestel dan samen met een volwassene, of bestel er niet. ' +
        'Valt er een check negatief uit, dan bestel je daar niet en helpt geen betaalmethode meer. ' +
        'In dit checkpoint pak je die checks erbij voor een winkel die je nog niet kent.'],
      ['Wat je doet als het toch misgaat',
        'Ook wie netjes controleert trapt er een keer in, en dan telt hoe snel je handelt. ' +
        'Deze uitleg staat niet in de les, maar komt van ACM ConsuWijzer (consument.acm.nl). ' +
        'Dat is de toezichthouder: een overheidsorganisatie die controleert of bedrijven zich aan de regels houden. ' +
        'Stel dat je betaald hebt bij een winkel die nep blijkt. Doe dan dit, in deze volgorde.' +
        '</p><ul>' +
        '<li>Bewaar je bewijsjes: de bevestigingsmail, de betaling in je bankapp en een schermafbeelding.</li>' +
        '<li>Bel of mail je bank nog dezelfde dag. Soms valt er nog iets te redden.</li>' +
        '<li>Doe aangifte bij de politie. Meerdere meldingen samen wegen zwaarder dan die van jou alleen.</li>' +
        '<li>Meld de winkel bij ACM ConsuWijzer. Zij lossen jouw zaak niet op, maar pakken zo\'n verkoper wel aan.</li>' +
        '</ul><p>' +
        'Vertel het daarnaast altijd aan een volwassene, ook als je je ervoor schaamt. ' +
        'Een oplichter doet dit voor zijn werk, dus erin trappen zegt niets over hoe slim jij bent. ' +
        'Ook delen gaat wel eens mis, bijvoorbeeld als je iets plaatst waar je spijt van hebt. ' +
        'Doe in dat geval dit, en doe het snel.' +
        '</p><ul>' +
        '<li>Haal het meteen weg bij de bron, dus op de plek waar jij het zette.</li>' +
        '<li>Vraag iedereen die het kopieerde of doorstuurde om hun kopie ook te wissen.</li>' +
        '<li>Blijft het staan? Vraag hulp aan een volwassene, bijvoorbeeld je mentor of je ouders.</li>' +
        '<li>Gaat het om een naaktfoto of ander seksueel beeld van jou? Daar is Helpwanted.nl voor.</li>' +
        '</ul><p>' +
        'Ook hier maakt snel handelen het verschil, want elke dag komen er kopieën bij.'],
      media('https://consument.acm.nl/online-winkelen/checklist-veilig-online-winkelen', 'ACM ConsuWijzer: checklist veilig online winkelen', 'Leg deze checklist naast de vijf checks uit 5.3. Welk checkpunt staat hier wel en bij ons niet?'),
      [
        {
          vraag: 'Kies een webshop en een betaalmethode voor een aankoop van dertig euro. Leg allebei je keuzes uit.',
          antwoord: 'Ik doe eerst de vijf checks bij de webshop. Daarna kies ik een betaalmethode waarvan ik het risico ken.',
          uitleg: 'Een goed antwoord noemt de winkel én het geld. Valt een check negatief uit, dan bestel je daar niet.',
          leerdoel: LD_5_5[0]
        },
        {
          vraag: 'Welke drie gedragsregels vind jij online het belangrijkst? Welke waarde ligt onder elke regel?',
          antwoord: 'Bijvoorbeeld: niet schelden vanuit respect, toestemming vragen vanuit privacy, nadenken vanuit verantwoordelijkheid.',
          uitleg: 'De regel zelf is minder belangrijk dan de waarde eronder. Met de waarde maak je zelf nieuwe regels.',
          leerdoel: LD_5_5[1]
        },
        {
          vraag: 'Schrijf per paragraaf van dit hoofdstuk één begrip op met je eigen uitleg, zonder terug te lezen.',
          antwoord: 'Bijvoorbeeld: 5.1 norm, 5.2 rapporteren, 5.3 slotje, 5.4 invoerrechten.',
          uitleg: 'Het begrip dat niet lukte, is precies je leerpunt. Overhoren werkt beter dan herlezen.',
          leerdoel: LD_5_5[0]
        }
      ],
      {
        tekst: 'Maak in OneDrive een map met de naam Checkpoint hoofdstuk 5. Zet daar vier bewijsstukken in. ' +
          "1: je presentatie uit 5.1 en 5.2, met de titeldia, je normen-en-waardendia's, je socialdia, je app-dia en drie topicdia's. " +
          '2: je vergelijkingstabel uit 5.3, met de vijf checks voor drie webshops. ' +
          "3: je betaalwijzer uit 5.4, met de zes koppels, drie risico's, je douane-uitleg en je gouden tip. " +
          '4: een nieuw stuk werk. Zo maak je dat, in vier stappen. ' +
          'Stap 1: kies een product van maximaal dertig euro dat je echt zou willen hebben. ' +
          'Stap 2: zoek twee webshops die het verkopen en doe bij allebei de vijf checks. Noteer per check wat je vond. ' +
          'Stap 3: kies één van de twee shops en kies er een betaalmethode bij. Schrijf in ongeveer tien regels op waarom. ' +
          'Let op: achteraf betalen en een creditcard mogen pas vanaf 18 jaar, dus die vallen voor jou af. ' +
          'Zet erbij welk risico je met die betaalmethode accepteert, en wie er bij een onbekende winkel meekijkt. ' +
          'Stap 4: schrijf op welke drie gedragsregels jij online het belangrijkst vindt. Zet bij elke regel de waarde die eronder ligt. ' +
          'Lever de map of het bestand in bij je docent.',
        label: 'Lever je vier bewijsstukken in. Werk bewijsstuk 4 helemaal uit: twee webshops, je keuze, je betaalmethode en je drie gedragsregels.',
        modelAnswer: 'Mijn product is een gamemuis van 29,95 euro. Webshop 1 is coolblue.nl. De prijs is net als elders, er staat een slotje voor de URL, de URL heeft geen toevoegingen, onderaan staan een adres en een telefoonnummer, en er zijn veel reviews op andere sites. Webshop 2 is game-outlet-deals.net. De prijs is 11 euro, dus veel te laag. Er staat wel een slotje, maar de URL heeft twee toevoegingen. Er is geen adres, alleen een formulier. Reviews staan alleen op de site zelf. Ik kies coolblue.nl, want daar vallen alle vijf de checks goed uit. Bij de andere shop vallen er drie negatief uit. Ik betaal met iDEAL, omdat ik deze winkel ken en gecontroleerd heb. Achteraf betalen en een creditcard mag ik nog niet, want ik ben 13. Het risico dat ik accepteer is dat ik dit geld niet meer kan terughalen. Bij een winkel die ik niet ken, zou ik het samen met mijn ouders bestellen. Mijn drie gedragsregels: 1. ik vraag toestemming voor ik iemand op een foto zet, vanuit de waarde respect. 2. ik deel geen privégegevens van mezelf of anderen, vanuit de waarde veiligheid. 3. ik denk na voor ik iets plaats, vanuit de waarde verantwoordelijkheid.',
        nakijkpunten: [
          'De map bevat vier bewijsstukken: de presentatie, de vergelijkingstabel, de betaalwijzer en het nieuwe stuk werk.',
          'Bij bewijsstuk 4 zijn twee webshops echt langs alle vijf de checks gelegd, met een keuze en een reden.',
          'Bij de gekozen betaalmethode staat het risico dat de leerling daarmee accepteert, en dat achteraf betalen pas vanaf 18 jaar mag.',
          'Er staan drie gedragsregels, elk met de waarde die eronder ligt.'
        ]
      },
      ['Wat is het verschil tussen een waarde en een norm?', 'Welke gegevens houd je online privé?', 'Wat doet de Rapporteer-knop?', 'Welke vijf checks doe je bij een webshop?', 'Wat bewijst het slotje juist niet?', 'Waarom is een te lage prijs verdacht?', 'Wat is het risico van achteraf betalen?', 'Waarom kun je iDEAL-geld niet terughalen?', 'Wanneer betaal je invoerrechten en btw?', 'Wat gebeurt er met je pakket als je de douanekosten niet betaalt?'],
      'Vijf kamers: gedrag, privacy, webshopcheck, betaalkeuze en douane, elk met een echte casus.',
      false,
      {
        oefenen: [
          {
            groep: 'samen',
            vraag: 'Overhoor elkaar op de vier gedragsregels uit 5.1. Wie er drie noemt, krijgt de vierde van de ander.',
            antwoord: 'Je scheldt of pest niemand. Je vraagt toestemming voor een foto. Je deelt niets van een ander. Je denkt na voor je plaatst.',
            uitleg: 'Gaat dit mis? Lees 5.1, theorieblok 2 terug. De laatste regel is de sterkste van de vier.',
            leerdoel: LD_5_5[1]
          },
          {
            groep: 'samen',
            vraag: 'Loop samen de vijf checks langs bij een webshop die jullie allebei kennen. Waar wordt het spannend?',
            antwoord: 'Meestal bij de reviews en de contactgegevens. Die kosten de meeste moeite om echt na te kijken.',
            uitleg: 'Gaat dit mis? Lees 5.3, theorieblok 2 terug. Zoek reviews op Google, niet op de site zelf.',
            leerdoel: LD_5_5[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 1. Wat is jouw digitale wereld? Geef een omschrijving en drie voorbeelden.',
            antwoord: 'Alles wat ik via een scherm doe en wat met internet te maken heeft. Bijvoorbeeld gamen, scrollen en opzoeken.',
            uitleg: 'Gaat dit mis? Lees 5.1, theorieblok 1 terug. De les noemt zes voorbeelden.',
            leerdoel: LD_5_1[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 2. Geef een waarde met de norm die daaruit volgt. Gebruik een ander voorbeeld dan uit de les.',
            antwoord: 'Bijvoorbeeld de waarde eerlijkheid, met de norm dat ik geen werk van een ander als het mijne inlever.',
            uitleg: 'Gaat dit mis? Lees 5.1, theorieblok 2 terug. De waarde staat altijd eerst.',
            leerdoel: LD_5_1[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 3. Noem drie gedragsregels die online gelden en zeg per regel wie hij beschermt.',
            antwoord: 'Niet schelden en toestemming vragen beschermen de ander. Nadenken voor je plaatst beschermt jou.',
            uitleg: 'Gaat dit mis? Lees 5.1, theorieblok 2 terug. De vierde regel gaat over andermans werk.',
            leerdoel: LD_5_1[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 4. Noem de vijf gegevens die je online beter privé houdt.',
            antwoord: "Je volledige naam en adres, je telefoonnummer, je school, je locatie en privéfoto's of gênante filmpjes.",
            uitleg: 'Gaat dit mis? Lees 5.2, theorieblok 1 terug. Samen vormen ze een compleet plaatje van jouw dag.',
            leerdoel: LD_5_2[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 5. Waar staat de knop voor een privé-account, en wat hoort er niet in je bio?',
            antwoord: 'In de instellingen onder privacy. In je bio horen je school, je woonplaats en je nummer niet.',
            uitleg: 'Gaat dit mis? Lees 5.2, theorieblok 1 terug. Je voornaam en je hobby mogen wel.',
            leerdoel: LD_5_2[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 6. Leg in vier stappen uit hoe je een bericht rapporteert.',
            antwoord: 'Drie puntjes aantikken, de Rapporteer-knop kiezen, een reden kiezen en versturen.',
            uitleg: 'Gaat dit mis? Lees 5.2, theorieblok 2 terug. Maak eerst een schermafbeelding.',
            leerdoel: LD_5_2[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 7. Noem de vijf checks die je bij een webshop doet. Welke vergeet jij het snelst?',
            antwoord: 'Prijzen vergelijken, het slotje bekijken, naam en URL checken, de website bekijken en reviews lezen.',
            uitleg: 'Gaat dit mis? Lees 5.3, theorieblok 2 terug. De volgorde maakt niet uit, maar reviews worden het vaakst vergeten.',
            leerdoel: LD_5_3[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 8. Wat betekent het slotje wel, en wat betekent het niet?',
            antwoord: 'Het betekent dat je gegevens onderweg versleuteld zijn. Het bewijst niet dat de winkel eerlijk is.',
            uitleg: 'Gaat dit mis? Lees 5.3, theorieblok 2 terug. Een oplichter regelt zo\'n slotje gratis.',
            leerdoel: LD_5_3[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 9. Waarom is een prijs van 80 procent korting bij een onbekende shop een waarschuwing?',
            antwoord: 'Een echte winkel koopt zelf in en wil verdienen. Zo\'n prijs moet je laten klikken zonder nadenken.',
            uitleg: 'Gaat dit mis? Lees 5.3, theorieblok 2 terug. Haast is precies wat een oplichter wil.',
            leerdoel: LD_5_3[2]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 10. Koppel: iDEAL, Klarna, creditcard en Apple Pay. Wat doet elk van de vier?',
            antwoord: 'iDEAL betaalt direct via je bank. Klarna is achteraf betalen. Een creditcard heeft krediet. Apple Pay koppelt je pas aan je telefoon.',
            uitleg: 'Gaat dit mis? Lees 5.4, theorieblok 1 terug. De koppeloefening staat in de opdracht van 5.4.',
            leerdoel: LD_5_4[0]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 11. Noem drie dingen die er misgaan als je Klarna te laat betaalt.',
            antwoord: 'Je krijgt een boete, er kan een incassobureau bij komen, en je naam gaat door naar andere instanties.',
            uitleg: 'Gaat dit mis? Lees 5.4, theorieblok 1 terug. Later lenen of een huis kopen wordt dan lastiger.',
            leerdoel: LD_5_4[1]
          },
          {
            groep: 'zelf',
            vraag: 'Diagnose 12. Wanneer betaal je invoerrechten en btw, en wat gebeurt er als je niet betaalt?',
            antwoord: 'Bij kopen van buiten de EU. Betaal je niet, dan wordt je pakket vernietigd en ben je alles kwijt.',
            uitleg: 'Gaat dit mis? Lees 5.4, theorieblok 2 terug. Je krijgt die rekening pas bij aankomst in Nederland.',
            leerdoel: LD_5_4[2]
          },
          {
            groep: 'steun',
            vraag: 'Ging er iets mis? Maak deze kaart. Zet bij elk woord de juiste paragraaf: norm, bio, slotje, krediet, douane.',
            antwoord: 'Norm hoort bij 5.1, bio bij 5.2, slotje bij 5.3, en krediet en douane bij 5.4.',
            uitleg: 'Zo weet je meteen welk stuk je terugleest. Elk begrip hoort bij precies één paragraaf.',
            leerdoel: LD_5_5[0]
          },
          {
            groep: 'plus',
            vraag: 'Alles goed? Leg uit waarom de regel "denk na voor je iets plaatst" en de vijf checks op elkaar lijken.',
            antwoord: 'Bij allebei doe je iets voordat je klikt, want daarna kun je het niet meer terugdraaien.',
            uitleg: 'Delen en kopen lijken los van elkaar. Toch gaat het bij allebei om even wachten met klikken.',
            leerdoel: LD_5_5[1]
          }
        ]
      })
  ]
};
