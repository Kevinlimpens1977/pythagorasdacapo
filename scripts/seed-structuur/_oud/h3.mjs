// Oud curriculum, hoofdstuk 3. Bewaard om na te kijken, NIET meegeladen:
// de generator leest alleen scripts/seed-structuur/h<n>.mjs, en dit bestand
// staat in _oud. Het nieuwe jaarplan telt acht hoofdstukken en wordt hier
// een map hoger opnieuw opgebouwd.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
  chapter: 3,
  chapterTitle: 'Veilig en Mediawijs',
  badge: 'Veilig & Mediawijs',
  paragraphs: [
    p('3.1', 'Privacy en digitale voetafdruk', ['23A', '23B', '21C'], 'privacy-scenariokaart', 100, 'Privacy Thermometer',
      ['Wat zijn persoonsgegevens?', 'Naam, foto, school, locatie, wachtwoord en leerlingnummer zijn gegevens waaraan iemand jou kan herkennen. Vraag jezelf af: zou ik dit ook op het schoolbord hangen? Zo niet, dan moet je extra goed nadenken voordat je het online zet of deelt.'],
      ['Sporen die blijven staan', 'Likes, posts, zoekgedrag en gedeelde foto’s vormen je digitale voetafdruk. Ook als jij iets verwijdert, kan iemand anders een screenshot hebben. Privacy gaat niet alleen over geheimen, maar ook over zelf kiezen wie wat over jou weet.'],
      media('https://schooltv.nl/video-item/wat-doet-een-tracker-volgt-jouw-internetgedrag', 'HackShield tracker', 'Welke informatie wordt gevolgd of gedeeld zonder dat je daar goed over nadenkt?'),
      ['Noem drie persoonsgegevens.', 'Waarom is een foto van je rijbewijs gevaarlijk?', 'Wat doe je als iemand jouw foto deelt zonder toestemming?'],
      'Maak een privacy-scenariokaart: welke gegevens, wie kan ze zien, risico en veilige keuze.',
      ['Persoonsgegeven of niet?', 'Wie mag dit zien?', 'Wat is een digitale voetafdruk?', 'Wat is toestemming?', 'Wat is de veiligste keuze?'],
      'Sorteer scenario’s in groen, oranje of rood met feedback op wie dit ziet en wat veiliger is.'),
    p('3.2', 'Social media, algoritmes en identiteit', ['23B', '21B', '22B'], 'feed-observatiekaart', 100, 'Feed Sorteerspel',
      ['Waarom jouw feed anders is', 'Een algoritme kiest berichten op basis van klikken, liken, kijktijd en volgen. Het doel is vaak dat jij langer blijft kijken. Daardoor ziet jouw feed er anders uit dan die van een klasgenoot. Jij beïnvloedt de feed, maar de feed beïnvloedt jou ook.'],
      ['Online identiteit en druk', 'Op social media laat je meestal een selectie zien. Filters, likes, trends en FOMO kunnen invloed hebben op je zelfbeeld en keuzes. Niet alles wat je ziet is het hele verhaal. Online sterk lijken betekent niet dat iemand zich ook zo voelt.'],
      media('https://schooltv.nl/video-item/clickwise-vraag-het-ciana-algoritme', 'Schooltv algoritme', 'Welke acties van jou bepalen wat je daarna te zien krijgt?'),
      ['Waarom krijg je steeds vergelijkbare video’s?', 'Wat is een nadeel van alleen zien wat je leuk vindt?', 'Wanneer voelt social media als druk?'],
      'Vul een feed-observatiekaart in met fictieve voorbeelden: klik, like, kijktijd, aanbeveling en risico.',
      ['Wat doet een algoritme?', 'Wat is FOMO?', 'Wat is een filterbubbel?', 'Welke keuze beïnvloedt je feed?', 'Wat is online identiteit?'],
      'Kies klik, like of negeren bij fictieve posts en zie hoe de feed verandert.'),
    p('3.3', 'Nepnieuws en betrouwbare bronnen', ['21B', '21D', '23C'], 'broncheckkaart', 100, 'Bronbattle',
      ['Nepnieuws lijkt vaak echt', 'Nepnieuws gebruikt heftige koppen, emotie, bekende namen of mooie opmaak. Dat maakt het geloofwaardig, ook als het niet klopt. Clickbait wil vooral dat je klikt. Betrouwbare informatie wil dat je begrijpt wat er echt aan de hand is.'],
      ['De 5 broncheckvragen', 'Vraag altijd: wie maakte dit, wanneer, met welk doel, waar is het bewijs en zegt een tweede betrouwbare bron hetzelfde? Video of audio kan ook nep zijn door AI of deepfake. Beeld is dus niet automatisch bewijs. Controleer bron en context.'],
      media('https://schooltv.nl/video-item/wat-is-clickbait-desinformatie-met-sensationele-koppen', 'HackShield clickbait', 'Wat maakt dit bericht geloofwaardig en wat maakt je toch voorzichtig?'),
      ['Wat is clickbait?', 'Welke bron vertrouw je eerder en waarom?', 'Waarom check je de datum?'],
      'Controleer een bericht met vijf vragen: maker, datum, doel, bewijs en tweede bron.',
      ['Welke bron is betrouwbaarst?', 'Wat mist er aan bewijs?', 'Waarom is datum belangrijk?', 'Wat is deepfake?', 'Wat is clickbait?'],
      'Rangschik bronnen en verdien bonus voor bewijszinnen.'),
    p('3.4', 'Cyberpesten, grenzen en hulp zoeken', ['23A', '23B'], 'hulproutekaart', 100, 'Grenzenkompas',
      ['Wat cyberpesten anders maakt', 'Online pesten kan doorgaan buiten schooltijd, snel verspreiden en anoniem voelen. Voorbeelden zijn gemene DM’s, buitensluiten, bewerkte foto’s of haat in games. Wat voor de één een grap lijkt, kan voor de ander kwetsend zijn.'],
      ['Hulproute in vijf stappen', 'Ga niet terugschelden. Bewaar bewijs, blokkeer waar nodig, meld het op het platform en vraag hulp aan mentor, ouder of docent. Foto’s, memes en screenshots delen vraagt toestemming, vooral als iemand herkenbaar is.'],
      media('https://schooltv.nl/video-item/zijn-memes-altijd-leuk-altijd-toestemming-vragen-voordat-je-een-grappige-foto-doorstuurt', 'HackShield memes', 'Wanneer verandert een grap in iets dat niet oké is?'),
      ['Wat is cyberpesten?', 'Waarom is screenshot bewaren slim?', 'Wie kun je op school om hulp vragen?'],
      'Maak een hulproutekaart: niet reageren met wraak, bewijs bewaren, blokkeren, melden en hulp vragen.',
      ['Oké, twijfel of niet oké?', 'Wat is de beste eerste stap?', 'Waarom vraag je hulp?', 'Wanneer is toestemming nodig?', 'Wat bewaar je als bewijs?'],
      'Kies bij scenario’s: oké, twijfel, niet oké of hulp nodig.'),
    p('3.5', 'Online shoppen en betalen', ['23A', '21B', '23C'], 'webshop-checklist', 100, 'Webshop Inspecteur',
      ['Is deze webshop te vertrouwen?', 'Check URL, contactgegevens, reviews buiten de site, retourregels, betaalmogelijkheden en extreem lage prijzen. Een mooie website is niet automatisch betrouwbaar. Als iets te mooi lijkt om waar te zijn, moet je extra goed controleren.'],
      ['Betaalmethoden en risico’s', 'iDEAL betekent dat je kunt betalen, niet dat de winkel betrouwbaar is. Klarna of achteraf betalen kan handig zijn, maar te laat betalen geeft kosten. Bij kopen buiten de EU kunnen levertijd, retour en invoerkosten tegenvallen.'],
      media('https://schooltv.nl/video-item/wat-is-witwassen-zwart-geld-legaal-laten-lijken', 'HackShield witwassen', 'Welke drie signalen bepalen of jij hier zou kopen?'),
      ['Wat controleer je eerst bij een webshop?', 'Waarom is een rare URL verdacht?', 'Noem twee risico’s van achteraf betalen.'],
      'Vul een webshop-checklist in: contact, reviews, betaalmethode, retour, prijs en eindoordeel.',
      ['Veilig of niet kopen?', 'Wat zegt een URL?', 'Waarom reviews buiten de site?', 'Wat is risico van achteraf betalen?', 'Waarom bewijs bewaren?'],
      'Vind acht signalen in fictieve webshops en bepaal veilig, twijfel of niet kopen.'),
    checkpoint('3.6', 'Checkpoint: mediawijs handelen', ['21B', '23A', '23B', '23C'], 'mediawijs-casusdossier', 120, 'Mediawijs Boss',
      ['Eerst denken, dan klikken', 'Bij privacy, feeds, nepnieuws, cyberpesten en online kopen gebruik je steeds dezelfde aanpak: stop, check risico, kies een veilige actie en vraag hulp als dat nodig is. Mediawijs zijn betekent dat je je keuze kunt uitleggen.'],
      ['Casus oplossen', 'Bij elke casus beschrijf je kort: wat gebeurt er, wat kan misgaan, wat doe ik en waarom? Je hoeft geen lange tekst te schrijven. Korte duidelijke zinnen zijn genoeg als je laat zien dat je nadenkt.'],
      null,
      ['Welke casus vond je lastigst?', 'Welke checkvraag gebruik je het meest?', 'Wanneer vraag je hulp aan een volwassene?'],
      'Kies twee casussen uit privacy, social media, nepnieuws, cyberpesten of online kopen. Schrijf per casus risico, keuze, uitleg en hulproute of broncheck.',
      ['Privacycasus', 'Algoritme/FOMO', 'Broncheck', 'Cyberpesten', 'Webshop', 'Hulproute', 'Toestemming', 'Clickbait', 'Risico uitleggen', 'Veilige actie kiezen', 'Tweede bron', 'Reflectie'],
      'Levels per thema met een eindbaas die nepbericht, groepschat en kooplink combineert.')
  ]
};
