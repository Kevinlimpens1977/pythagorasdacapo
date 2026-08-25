import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const outputPath = path.resolve('docs/seeds/digitale-vaardigheden-vmbo1.seed.json');

// Verrijkingslaag: leerdoelen, kernbegrippen, uitgewerkte voorbeelden en
// samenvattingen staan
// per hoofdstuk in scripts/seed-verrijking/h1.mjs t/m h5.mjs, zodat de
// lesinhoud los van de routestructuur gevuld kan worden. Ontbreekt of faalt een
// bestand, dan bouwt de seed gewoon door zonder die verrijking.
const enrichmentDir = path.resolve('scripts/seed-verrijking');
const enrichmentFiles = ['h1', 'h2', 'h3', 'h4', 'h5'];

const loadEnrichment = async () => {
  const map = new Map();

  for (const name of enrichmentFiles) {
    const file = path.join(enrichmentDir, `${name}.mjs`);
    if (!fs.existsSync(file)) continue;

    try {
      const module = await import(pathToFileURL(file).href);
      const entries = module.default;
      if (!entries || typeof entries !== 'object') continue;
      for (const [code, entry] of Object.entries(entries)) {
        if (entry && typeof entry === 'object') map.set(code, entry);
      }
    } catch (error) {
      console.warn(`Verrijking ${name}.mjs overgeslagen: ${error.message}`);
    }
  }

  return map;
};

const enrichment = await loadEnrichment();

const cleanStringList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean);

// Leerdoelen voor het paragraaf-document; leeg als de verrijking nog niet gevuld is.
const learningGoalsFor = (code) => cleanStringList(enrichment.get(code)?.learningGoals);

// Kernbegrippen en uitgewerkt voorbeeld voor theorieblok `index` (0 of 1).
// Lege waarden worden weggelaten, zodat de blokinhoud niet met lege velden vervuilt.
const theoryEnrichmentFor = (code, index) => {
  const blocks = enrichment.get(code)?.theorie;
  const entry = Array.isArray(blocks) ? blocks[index] : null;
  if (!entry || typeof entry !== 'object') return {};

  const extra = {};
  const keyTerms = cleanStringList(entry.keyTerms);
  if (keyTerms.length) extra.keyTerms = keyTerms;
  const exampleHtml = String(entry.exampleHtml || '').trim();
  if (exampleHtml) extra.exampleHtml = exampleHtml;

  return extra;
};

// Samenvattingstekst en kernbegrippen voor het samenvattingsblok. Ontbreekt de
// verrijking, dan valt het blok terug op de sjabloonregel in buildBlocks.
// Een samenvatting zonder kernbegrippen is een fout: dan blijft er een leesstap
// over die niets vet kan zetten, en dat is precies wat we willen voorkomen.
const samenvattingFor = (code) => {
  const entry = enrichment.get(code)?.samenvatting;
  if (!entry || typeof entry !== 'object') return null;

  const summaryHtml = String(entry.html || '').trim();
  const keyTerms = cleanStringList(entry.keyTerms);
  if (!summaryHtml) return null;
  if (!keyTerms.length) {
    throw new Error(`${code}: samenvatting heeft html maar geen keyTerms`);
  }

  return { html: summaryHtml, keyTerms };
};

const html = (parts) => parts.map((part) => `<p>${part}</p>`).join('\n');
const slug = (value) => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const gameIdForTitle = (title) => `dv-${slug(title)}`;

const media = (url, label, kijkvraag) => ({ url, label, kijkvraag });

const mediaKindForUrl = (url = '') => {
  const value = String(url || '').trim();
  if (!value) return 'image';
  if (/youtube\.com|youtu\.be/i.test(value)) return 'youtube';
  if (/\.pdf($|[?#])/i.test(value)) return 'pdf';
  if (/\.(png|jpe?g|webp|gif)($|[?#])/i.test(value)) return 'image';
  if (/\.(mp4|webm|ogg|ogv|mov|m4v)($|[?#])/i.test(value)) return 'video';
  return 'link';
};

const lessons = [
  {
    chapter: 1,
    chapterTitle: 'Starten en Account & Veilig',
    badge: 'Account Starter',
    paragraphs: [
      p('1.1', 'Mijn digitale schooltas: HELIX, OneDrive en Outlook', ['21A', '23A', '22A'], 'Word-bewijsbestand in OneDrive', 100, 'Account Escape',
        ['Je schoolaccount is je digitale sleutel', 'Met je schoolaccount kom je bij de belangrijkste digitale plekken: HELIX, OneDrive, Outlook en de school-ELO. Zie je account als een sleutelbos. Je gebruikt niet elke sleutel voor hetzelfde. Outlook is voor mail. OneDrive is voor bestanden bewaren en delen. HELIX is voor lessen en opdrachten. De school-ELO is nu nog een placeholder, omdat het platform later verandert.'],
        ['Bewijs opslaan', 'Maak een vaste map voor dit vak. Sla daarin je eerste Word-bestand op met een duidelijke naam. Voeg een screenshot toe van je map. Zo laat je zien dat je niet alleen hebt geklikt, maar echt weet waar je schoolwerk staat. Als iets niet lukt, vraag je hulp en klik je niet zomaar op onbekende knoppen.'],
        media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'Microsoft 365 basis', 'Welke drie plekken moet je op dag 1 kunnen vinden?'),
        ['Waar bewaar je schoolwerk?', 'Wanneer gebruik je Outlook?', 'Wat doe je als inloggen niet lukt?'],
        'Maak in OneDrive de map Digitale Vaardigheden. Maak een Word-bestand met je naam, klas, geopende apps, screenshot van je map en twee regels voor veilig accountgebruik.',
        ['Koppel app aan functie.', 'Kies de juiste map.', 'Wat doe je als je bestand kwijt is?', 'Welke informatie deel je niet?', 'Welke screenshot bewijst dat je map bestaat?'],
        'Escape met kamers voor inloggen, mail vinden, map maken en veilig uitloggen.'),
      p('1.2', 'Veilig wachtwoord en accountregels', ['23A', '21A'], 'wachtwoordzin-checkkaart zonder echte wachtwoorden', 100, 'Password Lab',
        ['Lang is sterker dan moeilijk', 'Een sterk wachtwoord is vooral lang en uniek. Een wachtwoordzin met meerdere woorden is vaak beter dan een kort wachtwoord met rare tekens. Gebruik nooit je naam, geboortedatum, club of huisdier. Gebruik ook niet overal hetzelfde wachtwoord. Als één site gehackt wordt, is anders alles onveilig.'],
        ['Nooit delen', 'Deel je wachtwoord niet met vrienden. Ook niet als je iemand vertrouwt. Een docent of ICT-medewerker vraagt nooit om jouw echte wachtwoord. Is je wachtwoord vergeten, gelekt of verdacht? Gebruik dan de officiële herstelroute of vraag hulp aan school. In deze les werk je alleen met nepwachtwoorden.'],
        media('https://schooltv.nl/video-item/hoe-zorg-je-dat-je-tiktok-account-niet-gehackt-wordt-tips-voor-een-veilig-wachtwoord', 'Schooltv veilig wachtwoord', 'Welke fout maakt het account onveilig?'),
        ['Welk nepwachtwoord is sterker?', 'Waarom gebruik je niet overal hetzelfde wachtwoord?', 'Wat doe je bij een gelekt wachtwoord?'],
        'Maak een checkkaart met wat je niet gebruikt, wat wel sterk is, hoe je wachtwoorden bewaart en wat je doet bij twijfel.',
        ['Kies het sterkste nepwachtwoord.', 'Waarom is 123456 zwak?', 'Wat doe je als een vriend je wachtwoord vraagt?', 'Wat betekent uniek wachtwoord?', 'Wat doe je bij een lek?'],
        'Sorteer nepwachtwoorden van zwak naar sterk en verbeter ze naar wachtwoordzinnen.'),
      p('1.3', 'Mijn device: hardware, software, instellingen en updates', ['21A', '23A'], 'device-checkkaart', 100, 'Hardware Hunt',
        ['Hardware en software', 'Hardware kun je aanraken: scherm, toetsenbord, muis, camera, accu en printer. Software zijn programma’s en systemen die het apparaat laten werken, zoals Windows, browser, Word en beveiliging. Samen zorgen ze dat jij kunt typen, opslaan, zoeken, printen en online werken.'],
        ['Instellingen en updates', 'Instellingen helpen je wifi, geluid, scherm en accounts regelen. Verander niet zomaar dingen die je niet begrijpt. Updates zijn belangrijk, omdat ze fouten oplossen en je device veiliger maken. Stel updates dus niet eindeloos uit. Vraag hulp als een update of instelling schoolwerk blokkeert.'],
        media('https://schooltv.nl/video-item/wat-doet-een-server-een-computer-die-taken-uitvoert-voor-andere-computers', 'HackShield server', 'Wat doet het apparaat zelf en wat doet software?'),
        ['Is een toetsenbord hardware of software?', 'Waarom update je?', 'Welke instelling pas je niet zomaar aan?'],
        'Vul een device-checkkaart in met hardware, software, wifi, updates en wat je wel/niet zelf aanpast.',
        ['Hardware of software?', 'Wat is invoer?', 'Waarom zijn updates nodig?', 'Wat doe je bij een onbekende melding?', 'Welke volgorde hoort bij invoer-verwerking-uitvoer?'],
        'Klik onderdelen aan, koppel functies en beslis welke instellingen veilig zijn.'),
      p('1.4', 'Bestanden zonder chaos in OneDrive', ['21A', '22A'], 'nette OneDrive-mapstructuur', 100, 'Bestandenrace',
        ['Device, cloud en OneDrive', 'Een bestand kan lokaal op je apparaat staan of in de cloud. OneDrive is cloudopslag van Microsoft. Het voordeel is dat je je werk op school en thuis kunt terugvinden. Dat lukt alleen als je netjes opslaat en weet waar je bestand staat.'],
        ['Slimme mappen en namen', 'Gebruik een vaste structuur: vak, hoofdstuk en opdracht. Goede bestandsnamen helpen jou en je docent. Zet bijvoorbeeld lesnummer, onderwerp, voornaam en klas in de naam. Vermijd namen zoals nieuw, opdracht, klaar of versie2echtklaar. Dan raak je minder kwijt.'],
        media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'Microsoft 365 bestanden', 'Welk bestand vind je het snelst en waarom?'),
        ['Wat is een duidelijke bestandsnaam?', 'Wanneer gebruik je OneDrive?', 'Wat is het verschil tussen kopiëren en verplaatsen?'],
        'Maak in OneDrive de map Digitale Vaardigheden > H1 Starten en Account & Veilig > Inleverbestanden. Maak drie testbestanden met duidelijke namen en lever een screenshot in.',
        ['Kies de beste map.', 'Verbeter een foute bestandsnaam.', 'Wat betekent cloud?', 'Waarom is versiebeheer handig?', 'Welke screenshot bewijst je structuur?'],
        'Sleep bestanden naar de juiste map en kies de beste naam onder tijdsdruk.'),
      p('1.5', 'Phishing en verdachte berichten', ['23A', '21B'], 'phishing-herkenkaart', 100, 'Phishing Detective',
        ['Verdachte signalen', 'Phishing is een truc om gegevens of geld van jou te krijgen. Let op rare afzenders, haast, dreiging, prijzen, spelfouten en onbekende bijlagen. Een bericht kan er netjes uitzien en toch gevaarlijk zijn. Criminelen willen dat je snel klikt zonder na te denken.'],
        ['Bij twijfel stoppen', 'Klik niet zomaar op links. Controleer eerst de afzender en waar een link heen lijkt te gaan. Open geen onbekende bijlagen. Twijfel je? Stop, maak eventueel een screenshot en vraag je docent, mentor of ICT om hulp. Melden is slim, geen blunder.'],
        media('https://schooltv.nl/video-item/wat-is-phishing-digitale-dieven-vissen-naar-jouw-persoonlijke-gegevens', 'HackShield phishing', 'Waar probeert de afzender druk te zetten?'),
        ['Welke rode vlag zie je?', 'Is dit veilig, twijfel of gevaar?', 'Wat doe je eerst bij twijfel?'],
        'Maak een phishing-herkenkaart met zes checks: afzender, link, taal, druk, bijlage en actie bij twijfel.',
        ['Veilig, twijfel of gevaar?', 'Welke rode vlag zie je?', 'Wat doe je met een onbekende bijlage?', 'Waarom is haast verdacht?', 'Wie vraag je om hulp?'],
        'Klik rode vlaggen aan in fictieve berichten en kies de juiste vervolgstap.'),
      checkpoint('1.6', 'Checkpoint: veilig digitaal starten', ['21A', '23A', '22A'], 'hoofdstukcheckpoint met bewijsbestand', 120, 'Schoolstart Escape',
        ['Alles werkt samen', 'Account, mail, OneDrive, device en veiligheid horen bij zelfstandig digitaal starten. Je laat zien dat je weet waar je moet zijn, hoe je bewijs opslaat en wanneer je hulp vraagt. Digitaal vaardig zijn betekent niet dat alles altijd lukt, maar dat je veilig en rustig handelt.'],
        ['Bewijs leveren', 'In deze checkpoint verzamel je bewijs: een map, een Word-bestand, een screenshot, een nette Outlook-mail en een phishingkeuze. Je hoeft geen perfecte expert te zijn. Je moet wel laten zien dat je de basis zelfstandig kunt uitvoeren en uitleggen.'],
        null,
        ['Welke H1-vaardigheid vind je makkelijk?', 'Waar moet je nog op letten?', 'Welke stap bewijst dat je veilig werkt?'],
        'Maak map Checkpoint1, maak Word-bestand, schrijf een korte Outlook-mail, voeg screenshot toe en beantwoord een phishing-scenario.',
        ['Waar hoort schoolwerk?', 'Wat doe je bij phishing?', 'Wat is een sterk wachtwoord?', 'Wat is hardware?', 'Wat is OneDrive?', 'Welke mailregel is netjes?', 'Wat doe je bij inlogproblemen?', 'Welke screenshot hoort erbij?', 'Wat deel je nooit?', 'Waarom vraag je hulp?'],
        'Vijf kamers met één bewijsactie per kamer.')
    ]
  },
  {
    chapter: 2,
    chapterTitle: 'Werken met Microsoft',
    badge: 'Microsoft Maker',
    paragraphs: [
      p('2.1', 'Word: een net schooldocument', ['22A', '21A'], 'net Word-document', 100, 'Opmaakdokter',
        ['Rustige opmaak', 'Een net Word-document is rustig en goed leesbaar. Gebruik een duidelijke titel, korte alinea’s en genoeg witruimte. Maak niet alles vet, groot of gekleurd. Opmaak helpt de lezer, maar mag niet afleiden van de inhoud.'],
        ['Basisfuncties', 'In Word kun je tekst typen, opslaan, kopiëren, afbeeldingen invoegen en bronnen noemen. Een afbeelding maakt je document sterker als die past bij je tekst. Zet er altijd een korte bronregel bij, zodat duidelijk is waar het beeld vandaan komt.'],
        media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'Microsoft Word basis', 'Welke knop maakt het document netter?'),
        ['Wat hoort bovenaan?', 'Waarom sla je bewust op?', 'Wat is een bronregel?'],
        'Maak een Word-document over een hobby of schoolvak met titel, naam, twee alinea’s, één afbeelding, bronregel en correcte bestandsnaam.',
        ['Wat maakt een titel duidelijk?', 'Welke opmaak is rustig?', 'Waarom noem je een bron?', 'Wat is een goede bestandsnaam?', 'Waar sla je op?'],
        'Herstel drukke tekst, ontbrekende titel, verkeerde afbeelding en ontbrekende bron.'),
      p('2.2', 'Word-verslag met koppen en bronnen', ['22A', '21B', '23A'], 'kort verslag met koppen en bronvermelding', 100, 'Plagiaatpolitie',
        ['Koppen geven structuur', 'Koppen helpen de lezer. Ze laten zien waar een nieuw onderdeel begint. In Word kun je stijlen gebruiken zoals Kop 1 en Kop 2. Dat ziet er netter uit en maakt je verslag overzichtelijker. Een verslag zonder koppen wordt snel één lange tekst.'],
        ['Eigen woorden en bronnen', 'Kopiëren zonder bron heet plagiaat. Schrijf informatie in je eigen woorden, alsof je het uitlegt aan een klasgenoot. Gebruik je een website, video of afbeelding? Noem dan de bron. Zo kan iemand controleren waar je informatie vandaan komt.'],
        media('https://schooltv.nl/video-item/wat-is-plagiaat-auteursrecht-betekent-dat-je-de-baas-bent-over-wat-jij-gemaakt-hebt', 'HackShield plagiaat', 'Wanneer is iets kopiëren?'),
        ['Welke kop past bij deze alinea?', 'Is dit eigen woorden of kopie?', 'Welke bronregel is duidelijk?'],
        'Schrijf een kort verslag Drie tips voor veilig internet met titel, drie koppen, drie alinea’s, één afbeelding en twee bronnen.',
        ['Is dit plagiaat?', 'Welke kop is duidelijk?', 'Waarom schrijf je in eigen woorden?', 'Welke bronregel klopt?', 'Wat controleer je bij peerfeedback?'],
        'Label zinnen als eigen woorden, citaat of kopie zonder bron.'),
      p('2.3', 'PowerPoint: duidelijk presenteren', ['22A', '21B'], '3 duidelijke dia’s', 100, 'Dia Dokter',
        ['Een dia is geen werkstuk', 'Een PowerPoint-dia ondersteunt jouw verhaal. Zet er dus niet een heel verslag op. Gebruik weinig tekst, grote letters en één boodschap per dia. Als iemand achter in het lokaal het niet kan lezen, is de dia te druk of te klein.'],
        ['Beeld helpt je verhaal', 'Een afbeelding kan helpen, maar alleen als die past bij wat je uitlegt. Kies rustige kleuren en goed contrast. Vertel zelf de uitleg; de dia geeft steun. Een goede presentatie bestaat uit duidelijke dia’s én iemand die rustig vertelt.'],
        media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'Microsoft PowerPoint basis', 'Welke dia kun je achterin het lokaal lezen?'),
        ['Welke dia is rustiger?', 'Hoeveel tekst is genoeg?', 'Waarvoor gebruik je een titeldia?'],
        'Maak drie dia’s over een schoolapp of digitale vaardigheid: titeldia, wat kun je ermee en drie tips.',
        ['Welke dia is duidelijker?', 'Wat is te veel tekst?', 'Waarom gebruik je contrast?', 'Welke afbeelding past?', 'Wat vertel je zelf?'],
        'Verbeter slechte dia’s met keuzes voor tekst, beeld, contrast en volgorde.'),
      p('2.4', 'PowerPoint: uitleg in 5 dia’s', ['22A', '23B'], 'mini-presentatie', 100, 'Pitchtimer',
        ['Begin, midden en einde', 'Een korte presentatie heeft een duidelijke opbouw. Begin met je onderwerp. Leg daarna drie belangrijke punten uit. Sluit af met een tip, samenvatting of vraag. Daardoor kan de luisteraar je beter volgen.'],
        ['Kort presenteren', 'Lees niet alles voor. Zet kernwoorden op je dia en vertel de rest in je eigen woorden. Oefen hardop. Let op tempo, volume en houding. Een bron hoort ook in je presentatie als je informatie of beeld van internet gebruikt.'],
        media('', 'Presentatietips docentdemo', 'Wat doet de spreker waardoor je blijft luisteren?'),
        ['Welke dia hoort eerst?', 'Welke zin is spreektekst en welke is diatekst?', 'Waar zet je de bron?'],
        'Maak vijf dia’s over veilig internet, Word gebruiken, digitale geletterdheid, favoriete app of bestanden terugvinden. Voeg bronvermelding toe.',
        ['Welke volgorde klopt?', 'Wat is een goede afsluitdia?', 'Wat hoort op de dia en wat vertel je?', 'Waarom oefen je hardop?', 'Waar staat de bron?'],
        'Oefen 45 seconden uitleg zonder alles voor te lezen.'),
      p('2.5', 'Samenwerken via OneDrive en Outlook', ['21A', '22A', '23B'], 'gedeeld bestand en nette mail', 100, 'Deelrechten Duel',
        ['Delen met rechten', 'In OneDrive kun je een bestand delen. Kies bewust wie mag kijken of bewerken. Niet elk bestand moet voor iedereen open staan. Bewerkrechten geef je alleen als iemand echt moet meewerken. Bij twijfel kies je veiliger.'],
        ['Nette mail met link', 'Een goede mail heeft een onderwerp, aanhef, korte uitleg, link en afsluiting. Schrijf vriendelijk en duidelijk. Controleer of de link werkt en of de rechten kloppen. Zo voorkom je dat iemand je bestand niet kan openen of juist te veel kan aanpassen.'],
        media('https://support.microsoft.com/nl-nl/office/basisbewerkingen-in-microsoft-365-videotraining-396b8d9e-e118-42d0-8a0d-87d1f2f055fb', 'OneDrive en Outlook demo', 'Wanneer geef je bewerkrechten?'),
        ['Welke rechten kies je?', 'Wat hoort in een nette mail?', 'Wat doe je als de link niet werkt?'],
        'Werk in duo’s aan een gedeeld Word-bestand met vijf samenwerkingsregels. Stuur daarna een nette Outlook-mail met link aan de docent of oefenadres.',
        ['Welke rechten passen?', 'Wat ontbreekt in deze mail?', 'Waarom geen openbare link?', 'Wat doe je bij foutmelding?', 'Welke afspraak voorkomt chaos?'],
        'Kies per situatie privé, bekijken, bewerken of niet delen.'),
      checkpoint('2.6', 'Checkpoint: Microsoft tools', ['21A', '21B', '22A', '23B'], 'Microsoft mini-portfolio', 120, 'Microsoft Maker Challenge',
        ['Microsoft als gereedschapskist', 'Word, PowerPoint, OneDrive en Outlook zijn verschillende gereedschappen. Word gebruik je voor documenten. PowerPoint gebruik je om iets uit te leggen. OneDrive bewaart en deelt bestanden. Outlook gebruik je om netjes te communiceren.'],
        ['Mini-portfolio', 'In deze checkpoint lever je bewijs in. Je laat zien dat je een document, presentatie, gedeelde link en mail kunt maken. Je schrijft ook kort wat zelfstandig lukte en waarbij je nog hulp nodig had.'],
        null,
        ['Welke tool kies je bij welke taak?', 'Wat maakt je document netjes?', 'Wat maakt je presentatie duidelijk?'],
        'Lever een mini-portfolio in met Word-document, PowerPoint, gedeelde OneDrive-link, nette mail en korte reflectie.',
        ['Welke tool hoort bij een verslag?', 'Welke tool hoort bij presenteren?', 'Wat is een goede deelinstelling?', 'Welke mail is netjes?', 'Waar hoort bronvermelding?', 'Wat maakt een dia duidelijk?', 'Wat is een goede bestandsnaam?', 'Waarom reflecteer je?', 'Wat controleer je bij delen?', 'Wat doe je als link niet werkt?'],
        'Vind fouten in document, dia, mail en deelinstelling.')
    ]
  },
  {
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
  },
  {
    chapter: 4,
    chapterTitle: 'Data en Bronnen',
    badge: 'Data & Bron Detective',
    paragraphs: [
      p('4.1', 'Excel: tabellen maken', ['21C', '21A', '22A'], 'Excel-tabel', 100, 'Tabel Tetris',
        ['Data netjes verzamelen', 'Data zijn losse gegevens, zoals namen, tijden, aantallen of keuzes. In Excel zet je die overzichtelijk in rijen en kolommen. Daardoor kun je later sorteren, tellen of een grafiek maken. Rommelige data geven sneller fouten.'],
        ['Rij, kolom en cel', 'Een cel is één vakje. Een rij loopt horizontaal en een kolom verticaal. Kolomtitels moeten kort en duidelijk zijn. Schrijf bijvoorbeeld Reistijd in minuten in plaats van alleen Tijd. Dan weet je later nog wat de gegevens betekenen.'],
        media('', 'Docentdemo Excel-tabel', 'Wat maakt deze tabel makkelijk of juist lastig te lezen?'),
        ['Wat is het verschil tussen rij en kolom?', 'Waarom geef je een kolom een titel?', 'Wat is een cel?'],
        'Maak een Excel-tabel met minimaal vijf rijen en vier kolommen over weekplanning, kantineverkoop of reistijd.',
        ['Wijs cel B3 aan.', 'Kies een goede kolomtitel.', 'Verbeter rommelige data.', 'Wat is een rij?', 'Waarom sorteer je?'],
        'Sleep datakaartjes naar de juiste kolom.'),
      p('4.2', 'Excel: rekenen met formules', ['21C', '21A'], 'Excel-sheet met formules', 100, 'Formule Fixer',
        ['Excel rekent, jij controleert', 'Formules helpen snel totalen, gemiddelden en procenten te berekenen. Toch moet jij controleren of Excel de juiste cellen gebruikt. Een uitkomst kan er netjes uitzien en toch fout zijn als het bereik verkeerd gekozen is.'],
        ['Formules lezen', 'Een formule begint met =. `=SOM(B2:B6)` betekent: tel alles van B2 tot en met B6 bij elkaar op. Bij `=GEMIDDELDE(B2:B6)` berekent Excel het gemiddelde. Leer niet alleen klikken, maar ook begrijpen wat de formule doet.'],
        media('', 'Docentdemo foute formule', 'Waarom lijkt het antwoord goed, maar klopt het toch niet?'),
        ['Wat betekent het =-teken?', 'Wanneer gebruik je gemiddelde?', 'Waarom controleer je celbereik?'],
        'Voeg aan je tabel totaal, gemiddelde en korte conclusie toe.',
        ['Kies de juiste SOM-formule.', 'Herken fout celbereik.', 'Wat is gemiddelde?', 'Waarom controleren?', 'Welke formule past?'],
        'Repareer kapotte formules en leg uit wat fout was.'),
      p('4.3', 'Grafieken die iets vertellen', ['21C', '22A', '21B'], 'grafiek met uitleg', 100, 'Grafiek Judge',
        ['Van tabel naar verhaal', 'Een grafiek maakt data sneller zichtbaar. Je ziet bijvoorbeeld wat het meeste voorkomt of wat verandert. Een grafiek heeft een duidelijke titel, labels en een korte conclusie nodig. Zonder uitleg weet de lezer niet wat belangrijk is.'],
        ['Eerlijk kijken', 'Grafieken kunnen misleiden door een rare schaal, ontbrekende labels of verkeerde grafieksoort. Een staafdiagram is handig voor vergelijken. Een lijngrafiek past bij verandering in tijd. Kies wat helpt bij je vraag, niet alleen wat er mooi uitziet.'],
        media('https://www.terzake-excel.nl/grafiek-maken-in-excel/', 'Excel grafiek maken', 'Welke grafiek helpt eerlijker begrijpen wat er gebeurt?'),
        ['Waarom heeft een grafiek labels nodig?', 'Wat kan misleidend zijn aan een schaal?', 'Welke grafiek past bij vergelijken?'],
        'Maak een grafiek bij je dataset met titel, labels en conclusie van drie zinnen.',
        ['Welke grafiek past?', 'Wat mist aan deze grafiek?', 'Is de schaal eerlijk?', 'Schrijf een conclusie.', 'Wat betekent label?'],
        'Beoordeel grafieken met stoplicht en bewijszin.'),
      p('4.4', 'Data om je heen en data/privacy', ['21C', '21D', '23A', '23C'], 'datastroomkaart', 100, 'Data Spoorzoeker',
        ['Jouw dataspuren', 'Apps, websites en schoolsystemen bewaren gegevens zoals klikgedrag, locatie, inlogtijd of zoekwoorden. Dat kan handig zijn, bijvoorbeeld om je rooster te tonen. Maar data zegt ook iets over jou en kan verkeerd gebruikt worden.'],
        ['Privacykeuzes', 'Privacy betekent dat je nadenkt wie iets mag weten, waarom en wat er kan gebeuren als data wordt gedeeld. Niet alle data is geheim, maar veel data is persoonlijk. Daarom kies je bewust instellingen en deel je niet meer dan nodig.'],
        media('https://schooltv.nl/video-item/wat-doet-een-tracker-volgt-jouw-internetgedrag', 'HackShield tracker', 'Welke data wordt verzameld zonder dat je het meteen merkt?'),
        ['Noem één dataspur op school.', 'Wat is een privacyrisico?', 'Waarom is doel belangrijk?'],
        'Teken een datastroomkaart op papier of digitaal: activiteit, data, wie gebruikt het, doel, risico en veilige keuze.',
        ['Welke data wordt verzameld?', 'Wie gebruikt het?', 'Wat is het doel?', 'Wat is risico?', 'Welke instelling is veiliger?'],
        'Volg dataspuren door een schooldag en benoem gebruiker, doel en risico.'),
      p('4.5', 'Bronnen beoordelen met data en bewijs', ['21B', '21C', '23C'], 'bewijskaart bij claim', 100, 'Claim Checker',
        ['Een claim is nog geen bewijs', '“9 van de 10 jongeren...” klinkt sterk, maar je moet weten wie dit zegt, hoeveel mensen zijn onderzocht en of de bron betrouwbaar is. Een claim is een bewering. Bewijs laat zien waarom je die bewering wel of niet kunt geloven.'],
        ['Data controleren', 'Kijk naar datum, afzender, grafiek, steekproef en wat er ontbreekt. Soms gebruikt iemand cijfers om iets groter of kleiner te laten lijken. Controleer daarom niet alleen de uitkomst, maar ook hoe de data is verzameld.'],
        media('', 'Misleidende grafiek voorbeeld', 'Welke informatie mis je om dit te geloven?'),
        ['Wat is een claim?', 'Waarom is de afzender belangrijk?', 'Wat is ontbrekende data?'],
        'Onderzoek een aangeboden claim. Vul in: wie zegt dit, welke data, wat ontbreekt, welke bron bevestigt en wat is jouw conclusie?',
        ['Sterk bewijs of twijfel?', 'Welke bron is beter?', 'Wat ontbreekt?', 'Waarom datum checken?', 'Schrijf conclusie.'],
        'Sorteer claims in sterk bewijs, twijfel of zwak bewijs.'),
      checkpoint('4.6', 'Checkpoint: data-dashboard en bronkeuze', ['21B', '21C', '22A', '23A'], 'mini-dashboard met bronkeuze', 120, 'Dashboard Dash',
        ['Mini-dashboard', 'Een dashboard laat in één overzicht tabel, formule, grafiek en conclusie zien. Het doel is niet vooral mooi maken, maar duidelijk antwoord geven op een vraag. Je lezer moet snel begrijpen wat de data laat zien.'],
        ['Bronkeuze uitleggen', 'Je vertelt waar je data vandaan komt en waarom die bruikbaar is. Je schrijft ook een privacyzin: welke data is persoonlijk en hoe ga je daar netjes mee om? Zo combineer je Excel, bronnen en veiligheid.'],
        null,
        ['Wat moet minimaal in je dashboard?', 'Waarom noem je je bron?', 'Wat is een privacyzin?'],
        'Maak een mini-dashboard met tabel, formule, grafiek, conclusie en privacyzin. Voeg toe welke bron/data je gebruikt hebt en waarom die bruikbaar is.',
        ['Excelbegrippen', 'Formule kiezen', 'Grafiek beoordelen', 'Privacycasus', 'Bronkeuze', 'Dashboardonderdeel', 'Conclusie', 'Datafout', 'Steekproef', 'Reflectie'],
        'Kies per onderzoeksvraag de beste visualisatie en plaats die op een dashboard.')
    ]
  },
  {
    chapter: 5,
    chapterTitle: 'AI, Code en Portfolio',
    badge: 'Digitaal Vaardig',
    paragraphs: [
      p('5.1', 'Wat is AI en hoe gebruik je een chatbot verstandig?', ['21D', '21B', '21C', '23A'], 'prompt-en-checkblad', 100, 'Prompt Duel',
        ['AI voorspelt, niet denkt', 'AI lijkt slim, maar maakt antwoorden op basis van patronen in data. Een chatbot kan helpen met uitleg, ideeën en samenvatten, maar kan fouten maken. Jij blijft verantwoordelijk voor wat je inlevert. Controleer dus altijd.'],
        ['Goede prompt, veilige prompt', 'Een prompt is je opdracht aan AI. Zeg duidelijk wat je wilt, voor wie, hoe lang en in welke vorm. Deel geen privégegevens, zoals naam, adres, telefoonnummer of leerlingnummer. Gebruik AI als hulp, niet als vervanger van jouw denken.'],
        media('https://schooltv.nl/video-item/clipphanger-wat-is-ai', 'Schooltv wat is AI', 'Waar helpt AI en waar moet een mens controleren?'),
        ['Wat is een prompt?', 'Waarom deel je geen persoonlijke info?', 'Waarom controleer je AI-output?'],
        'Maak een prompt-en-checkblad: doel, prompt, antwoord samenvatten, controlebron en privacyregel.',
        ['Kies de beste prompt.', 'Herken privacyfout.', 'Wat kan AI fout doen?', 'Wat is controleren?', 'Welke bron gebruik je?'],
        'Vergelijk prompts en verbeter de zwakke prompt met doel, doelgroep, lengte en controle.'),
      p('5.2', 'AI-beelden, deepfakes en beroepen', ['21D', '21B', '23C', '23B'], 'AI-impactkaart', 100, 'Echt, nep of twijfel?',
        ['Echt, nep of twijfel', 'AI kan beelden maken van mensen of situaties die nooit hebben bestaan. Soms zie je fouten aan handen, tekst, ogen of rare details, maar niet altijd. Daarom is twijfel soms een goed antwoord. Zoek bewijs voordat je deelt.'],
        ['AI verandert werk', 'AI kan taken sneller doen, maar mensen blijven nodig voor controle, creativiteit, zorg, keuzes en verantwoordelijkheid. Bij veel beroepen verandert het werk. Dat betekent niet dat mensen verdwijnen, maar dat vaardigheden veranderen.'],
        media('https://schooltv.nl/video-item/tegenlicht-in-de-klas-nepvideos-en-deepfake/nepnieuws-hoe-weet-je-wat-waar-is-en-wat-niet', 'Schooltv deepfake', 'Welke aanwijzingen maken jou onzeker over echtheid?'),
        ['Wat is een deepfake?', 'Noem een menselijke vaardigheid die AI niet zomaar vervangt.', 'Waarom is twijfel soms goed?'],
        'Kies een beroep en maak een AI-impactkaart: waar helpt AI, wat is risico en welke menselijke vaardigheid blijft nodig?',
        ['Echt, nep of twijfel?', 'Welke aanwijzing zie je?', 'Wat is een deepfake?', 'Welk beroep verandert?', 'Welke mensvaardigheid blijft nodig?'],
        'Verzamel bewijschecks voordat je kiest of iets echt, nep of twijfel is.'),
      p('5.3', 'Algoritmes zonder computer', ['22B', '21A'], 'papieren algoritme', 100, 'Algoritme Estafette',
        ['Algoritme als stappenplan', 'Een algoritme is een serie duidelijke stappen. Een computer doet precies wat er staat, niet wat jij bedoelde. Daarom moet elke stap helder zijn. “Doe normaal” is geen goede stap, want iedereen kan dat anders uitleggen.'],
        ['Testen en debuggen', 'Als een stappenplan misgaat, zoek je welke stap onduidelijk, verkeerd of vergeten is. Dat heet debuggen. Je verbetert één stap en test opnieuw. Fouten horen erbij. Door testen wordt je algoritme beter.'],
        media('https://schooltv.nl/video-item/clipphanger-wat-is-een-algoritme', 'Schooltv algoritme', 'Welke stap moet preciezer zodat iedereen hetzelfde doet?'),
        ['Waarom moet een algoritme precies zijn?', 'Wat is debuggen?', 'Welke stap is te vaag?'],
        'Schrijf een papieren algoritme voor bestand opslaan, mail sturen, robotdoolhof of veilig bericht controleren. Test bij een klasgenoot en verbeter één stap.',
        ['Zet stappen in volgorde.', 'Herken vage stap.', 'Wat is debuggen?', 'Welke stap ontbreekt?', 'Wat doet een computer letterlijk?'],
        'Leg stappenkaarten in volgorde; een tester voert letterlijk uit en markeert de eerste onduidelijke stap.'),
      p('5.4', 'Programmeren met blokken en debuggen', ['22B', '22A', '21A'], 'blokkenprogramma of interactieve mini-quiz', 100, 'Debug Sprint',
        ['Blokken bouwen gedrag', 'Met blokkenprogrammeren maak je regels: wanneer iets start, wat er gebeurt, wanneer iets herhaalt en welke feedback de gebruiker krijgt. Een start-event bepaalt wanneer het programma begint. Voorwaarden laten iets gebeuren als iets waar is.'],
        ['Fouten horen erbij', 'Debuggen is normaal. Je test, zoekt de fout, past aan en test opnieuw. Laat een klasgenoot je programma proberen. Die vindt vaak fouten die jij zelf niet ziet, omdat jij weet wat je bedoelde.'],
        media('', 'Scratch quiz-demo', 'Waar krijgt de gebruiker feedback en waar nog niet?'),
        ['Wat doet een start-event?', 'Waarom test je met een klasgenoot?', 'Wat is een voorwaarde?'],
        'Maak een korte interactieve quiz of mini-game over een digitaal vaardigheidsthema met start-event, minimaal drie vragen/acties, feedback en score of eindmelding.',
        ['Wat is event?', 'Wat is herhaling?', 'Voorspel uitkomst.', 'Vind bug.', 'Welke feedback ontbreekt?'],
        'Los korte blokkenprogramma’s met één fout op.'),
      p('5.5', 'Portfolio bouwen, digitale samenleving en herstel', ['22A', '23C', '23B'], 'portfolio en herstelplan', 100, 'Portfolio Quest',
        ['Portfolio als bewijsmap', 'Je portfolio laat zien wat je kunt: Word, PowerPoint, Excel/dashboard, privacy, broncheck, AI en programmeren. Bij elk bewijsstuk schrijf je kort wat je hebt geleerd. Zo ziet je docent niet alleen wat je maakte, maar ook wat je begrijpt.'],
        ['Herstellen mag', 'Missen is niet falen. Als je iets nog niet af hebt, maak je een herstelplan. Zet erin welke taak ontbreekt, wat je gaat doen en wanneer je het afmaakt. Iedereen kan blijven doorwerken richting het volledig certificaat.'],
        media('https://www.kennisnet.nl/digitale-geletterdheid/', 'Kennisnet digitale geletterdheid', 'Welk bewijsstuk overtuigt het meest en waarom?'),
        ['Waarom schrijf je reflectie bij bewijs?', 'Wat hoort in een herstelplan?', 'Welke bewijsstukken heb je nodig?'],
        'Bouw een portfolio in OneDrive of PowerPoint met bewijsstukken voor Microsoft, veiligheid/privacy, data/bron, AI en programmeren. Voeg per bewijsstuk twee zinnen toe.',
        ['Welk bewijs hoort erbij?', 'Wat is reflectie?', 'Wat mist nog?', 'Wat is een herstelactie?', 'Welke badge past?'],
        'Unlock bewijsstukken pas na openen, controleren en reflectiezin.'),
      checkpoint('5.6', 'Eindexpo: mijn digitale vaardigheden certificaat', ['21A', '21B', '21C', '21D', '22A', '22B', '23A', '23B', '23C'], 'eindportfolio, presentatie en certificaatgesprek', 150, 'Certificaat Quest Finale',
        ['Laten zien wat je kunt', 'Bij de eindexpo kies je vier bewijsstukken: Microsoft, veiligheid/privacy, data/bron en AI/programmeren. Je vertelt wat je maakte, wat je leerde en wat je nu beter kunt. Je hoeft niet alles lang te vertellen. Kies duidelijk bewijs.'],
        ['Digitale vaardigheid is gedrag', 'Digitale vaardigheden gaan niet alleen over knoppen. Het gaat ook over veilig, kritisch, netjes en zelfstandig werken. Je laat zien dat je hulp kunt vragen, bronnen kunt controleren en bewust omgaat met technologie.'],
        null,
        ['Welke vier bewijssoorten presenteer je?', 'Wat maakt een uitleg sterk?', 'Wat heb je veiliger leren doen?'],
        'Presenteer vier bewijsstukken en vertel per bewijsstuk wat je leerde en welk kerndoel erbij past.',
        ['Wat doe je nu veiliger?', 'Hoe controleer je bronnen?', 'Wat kan AI wel?', 'Wat kan AI niet?', 'Hoe gebruik je data?', 'Wat heb je gemaakt?', 'Wat is je beste bewijs?', 'Waar ben je trots op?'],
        'Beantwoord portfoliovragen en geef peerfeedback met twee sterren en één tip.',
        true)
    ]
  }
];

function p(code, title, kerndoelen, product, tokens, gameTitle, theoryA, theoryB, mediaBlock, checks, assignment, quizItems, gameDescription) {
  return { code, title, kerndoelen, product, tokens, gameTitle, theory: [theoryA, theoryB], media: mediaBlock, checks, assignment, assessmentItems: quizItems, gameDescription, checkpoint: false };
}

function checkpoint(code, title, kerndoelen, product, tokens, gameTitle, theoryA, theoryB, mediaBlock, checks, assignment, toetsItems, gameDescription, final = false) {
  return { code, title, kerndoelen, product, tokens, gameTitle, theory: [theoryA, theoryB], media: mediaBlock, checks, assignment, assessmentItems: toetsItems, gameDescription, checkpoint: true, final };
}

const blockSettings = (type) => ({
  allowAiHelp: ['question', 'quiz'].includes(type),
  allowMathToolbox: false
});

const tokenConfig = (totalTokens) => ({
  enabled: totalTokens > 0,
  totalTokens
});

const block = ({ id, type, order, title, content, tokens = 0, status = 'published', sourceBasis = ['lessenserie-md', 'ai-aanvulling'] }) => ({
  id,
  type,
  order,
  title,
  status,
  tokenConfig: tokenConfig(tokens),
  tokenTotal: tokens,
  settings: blockSettings(type),
  content: {
    ...content,
    sourceBasis,
    sourceNotes: 'Interne bronmetadata voor docent/CMS; niet tonen in leerlingweergave.'
  },
  isArchived: false
});

// ---------------------------------------------------------------------------
// Toetsvragen
//
// Een quiz- of toetsvraag komt UITSLUITEND uit de verrijkingslaag, onder de
// sleutel `vragen` bij de paragraafcode. De generator verzint geen opties, geen
// feedback en geen vraagtype meer. Ontbreekt `vragen`, dan komt er geen quiz in
// de leerlingroute: het blok gaat op status 'draft' en wordt onderaan de run
// opgesomd. Liever geen quiz dan een quiz die iedereen haalt.
//
// FORMAAT per vraag (zie ook de kop van scripts/seed-verrijking/h1.mjs):
//
//   {
//     prompt:   'De vraag of stelling zoals de leerling hem leest.'  (verplicht)
//     type:     'meerkeuze' | 'waar-niet-waar' | 'open'              (optioneel)
//     options:  [ { text, correct, explanation?, misconception? } ]  (gesloten)
//     waar:     true | false        korte vorm voor een waar-niet-waar-stelling
//     feedback: 'Wat de leerling na het antwoorden leest.'           (verplicht)
//     modelAnswer:   'Wat er in een goed antwoord staat.'            (open)
//     nakijkpunten:  ['...', '...']  2 of 3 punten waar de docent op let (open)
//     leerdoel: 'Je kunt ...'   optioneel; koppelt de vraag aan een leerdoel
//   }
//
// De veldnamen zijn dezelfde als die de CMS-editor schrijft, zodat een vraag die
// in de app is gemaakt hier ongewijzigd in geplakt kan worden.
//
// Regels die de generator afdwingt (fout = build stopt, geen stille nepvraag):
//   - type wordt afgeleid uit de vraag zelf, nooit uit de volgorde. Een prompt
//     die begint met wat/waarom/hoe/welke/wanneer/wie of eindigt op een
//     vraagteken kan geen waar-niet-waar-stelling zijn.
//   - meerkeuze: 3 of 4 opties, minstens een goede en minstens een foute.
//   - waar-niet-waar: precies de twee opties Waar en Niet waar, een correct.
//   - open: modelAnswer plus 2 of 3 nakijkpunten.
//   - elke vraag heeft eigen feedback; dezelfde feedbackzin mag niet in twee
//     vragen van hetzelfde blok en in hoogstens twee paragrafen staan.
//   - het goede antwoord staat niet in elke vraag van een blok op dezelfde plek.
//   - een quiz heeft minstens 3 vragen, een toets minstens 6.
// ---------------------------------------------------------------------------

const MIN_ITEMS = { quiz: 3, toets: 6 };
const MAX_PARAGRAFEN_PER_FEEDBACK = 2;

// Paragraafcodes zonder vragen; onderaan de run opgesomd.
const missingAssessments = [];
// Feedbackzin -> paragraafcodes, om sjabloonfeedback over de hele seed te vangen.
const feedbackParagrafen = new Map();

const VRAAGWOORDEN = /^(wat|waarom|hoe|welke|welk|wanneer|wie|waar|waardoor|waarmee|waarvoor|noem|leg|beschrijf|geef|vergelijk|verklaar|kies)\b/i;

const questionsFor = (code) => {
  const entries = enrichment.get(code)?.vragen;
  if (!Array.isArray(entries) || entries.length === 0) return null;
  return entries;
};

const inferItemType = (vraag, label) => {
  if (vraag.type) return String(vraag.type);
  if (typeof vraag.waar === 'boolean') return 'waar-niet-waar';
  if (Array.isArray(vraag.options) && vraag.options.length > 0) return 'meerkeuze';
  if (vraag.modelAnswer || vraag.nakijkpunten) return 'open';
  throw new Error(`${label}: vraagtype niet af te leiden; zet type, options, waar of modelAnswer`);
};

// Het vraagtype moet bij de vraag passen. Een vraag die om uitleg vraagt is
// geen ja/nee-knop, ook niet als het toevallig de eerste vraag van de quiz is.
const assertTypeFitsPrompt = (type, prompt, label) => {
  const text = prompt.trim();
  if (type !== 'waar-niet-waar') return;
  if (VRAAGWOORDEN.test(text)) {
    throw new Error(`${label}: "${text.slice(0, 48)}..." begint met een vraagwoord en kan geen waar-niet-waar zijn`);
  }
  if (text.endsWith('?')) {
    throw new Error(`${label}: een waar-niet-waar-vraag is een stelling, geen vraagzin`);
  }
};

const buildOptions = (type, vraag, label) => {
  if (type === 'waar-niet-waar') {
    if (typeof vraag.waar !== 'boolean' && !Array.isArray(vraag.options)) {
      throw new Error(`${label}: waar-niet-waar heeft waar: true of waar: false nodig`);
    }
    if (typeof vraag.waar === 'boolean') {
      return [
        { id: 'waar', text: 'Waar', correct: vraag.waar === true, explanation: '', misconception: '' },
        { id: 'niet-waar', text: 'Niet waar', correct: vraag.waar === false, explanation: '', misconception: '' }
      ];
    }
  }

  const raw = Array.isArray(vraag.options) ? vraag.options : [];
  if (type === 'meerkeuze' && (raw.length < 3 || raw.length > 4)) {
    throw new Error(`${label}: meerkeuze heeft 3 of 4 opties nodig, kreeg ${raw.length}`);
  }
  if (type === 'waar-niet-waar' && raw.length !== 2) {
    throw new Error(`${label}: waar-niet-waar heeft precies 2 opties`);
  }

  const options = raw.map((option, index) => {
    const text = String(option?.text || '').trim();
    if (!text) throw new Error(`${label}: optie ${index + 1} heeft geen tekst`);
    return {
      id: `optie-${index + 1}`,
      text,
      correct: option.correct === true,
      explanation: String(option.explanation || option.uitleg || '').trim(),
      misconception: String(option.misconception || option.misvatting || '').trim()
    };
  });

  const correctCount = options.filter((option) => option.correct).length;
  if (correctCount === 0) throw new Error(`${label}: geen enkele optie is correct`);
  if (correctCount === options.length) throw new Error(`${label}: alle opties zijn correct`);

  const texts = new Set(options.map((option) => option.text.toLowerCase()));
  if (texts.size !== options.length) throw new Error(`${label}: dubbele antwoordoptie`);

  return options;
};

const buildOpenAnswer = (vraag, label) => {
  const modelAnswer = String(vraag.modelAnswer || '').trim();
  if (!modelAnswer) throw new Error(`${label}: open vraag zonder modelAnswer`);

  // De CMS-editor bewaart de nakijkpunten als een tekstvak met regels. Een vraag
  // die daar vandaan geplakt is mag dus ook een string zijn.
  const bron = vraag.nakijkpunten ?? vraag.rubric;
  const nakijkpunten = cleanStringList(
    typeof bron === 'string' ? bron.split('\n').map((regel) => regel.replace(/^[-*]\s*/, '')) : bron
  );
  if (nakijkpunten.length < 2 || nakijkpunten.length > 3) {
    throw new Error(`${label}: open vraag heeft 2 of 3 nakijkpunten nodig, kreeg ${nakijkpunten.length}`);
  }

  return {
    type: 'open',
    modelAnswer,
    rubric: nakijkpunten.map((punt) => `- ${punt}`).join('\n'),
    teacherNotes: ''
  };
};

const makeQuestionItems = (code, vragen, totalTokens, type = 'quiz') => {
  if (vragen.length < MIN_ITEMS[type]) {
    throw new Error(`${code}: een ${type} heeft minstens ${MIN_ITEMS[type]} vragen nodig, kreeg ${vragen.length}`);
  }

  const base = Math.floor(totalTokens / vragen.length);
  let rest = totalTokens - base * vragen.length;

  const feedbackInBlock = new Set();
  const correctPositions = [];

  const items = vragen.map((vraag, index) => {
    const label = `${code} vraag ${index + 1}`;
    const tokens = base + (rest > 0 ? 1 : 0);
    rest -= 1;

    const prompt = String(vraag.prompt || '').trim();
    if (!prompt) throw new Error(`${label}: lege prompt`);

    const itemType = inferItemType(vraag, label);
    if (!['meerkeuze', 'waar-niet-waar', 'open'].includes(itemType)) {
      throw new Error(`${label}: onbekend vraagtype ${itemType}`);
    }
    assertTypeFitsPrompt(itemType, prompt, label);

    const feedback = String(vraag.feedback || '').trim();
    if (feedback.length < 20) {
      throw new Error(`${label}: feedback ontbreekt of is te kort om iets uit te leggen`);
    }
    const feedbackKey = feedback.toLowerCase();
    if (feedbackInBlock.has(feedbackKey)) {
      throw new Error(`${label}: dezelfde feedbackzin staat al bij een andere vraag in dit blok`);
    }
    feedbackInBlock.add(feedbackKey);
    if (!feedbackParagrafen.has(feedbackKey)) feedbackParagrafen.set(feedbackKey, new Set());
    feedbackParagrafen.get(feedbackKey).add(code);

    const taxonomy = {
      learningGoal: String(vraag.leerdoel || '').trim(),
      cognitiveSkill: vraag.denkniveau || (itemType === 'open' ? 'uitleggen' : 'begrijpen'),
      masteryLevel: vraag.niveau || 'basis',
      scaffoldingRole: vraag.rol || 'zelf_proberen'
    };

    if (itemType === 'open') {
      return {
        id: `${type}-${index + 1}`,
        type: 'open',
        vraagtype: 'open',
        prompt,
        answer: buildOpenAnswer(vraag, label),
        options: [],
        feedback,
        tokens,
        taxonomy
      };
    }

    const options = buildOptions(itemType, vraag, label);
    correctPositions.push(options.findIndex((option) => option.correct));

    return {
      id: `${type}-${index + 1}`,
      type: itemType,
      vraagtype: itemType,
      prompt,
      answer: { type: 'meerkeuze', options: options.map((option) => ({ ...option })) },
      options: options.map((option) => ({ ...option })),
      feedback,
      tokens,
      taxonomy
    };
  });

  // Staat het goede antwoord elke keer op dezelfde knop, dan is de quiz te halen
  // zonder de vraag te lezen.
  if (correctPositions.length >= 3 && new Set(correctPositions).size === 1) {
    throw new Error(`${code}: het goede antwoord staat in elke gesloten vraag op positie ${correctPositions[0] + 1}`);
  }

  const openCount = items.filter((item) => item.type === 'open').length;
  if (openCount === items.length) {
    throw new Error(`${code}: alleen open vragen; een quiz of toets heeft ook gesloten vragen nodig`);
  }

  return items;
};

const tokenPlan = (paragraph) => {
  if (paragraph.final) {
    return { slidedeck: 0, theory: [10, 10], media: 0, check: 15, practice: 55, summary: 10, assessment: 25, game: 25 };
  }
  if (paragraph.checkpoint) {
    return { slidedeck: 0, theory: [5, 5], media: 0, check: 10, practice: 20, summary: 10, assessment: 50, game: 20 };
  }
  return { slidedeck: 0, theory: [5, 5], media: 5, check: 15, practice: 35, summary: 10, assessment: 15, game: 10 };
};

const buildBlocks = (chapter, paragraph) => {
  const plan = tokenPlan(paragraph);
  const idPrefix = `dv-${paragraph.code.replace('.', '-')}`;
  const blocks = [];
  let order = 1;

  blocks.push(block({
    id: `${idPrefix}-slidedeck`,
    type: 'slidedeck',
    order: order++,
    title: `${paragraph.code} Startpresentatie`,
    content: {
      html: `<p>Slidedeck-placeholder voor ${paragraph.title}. De docent vult deze presentatie later.</p>`,
      slidedeckPackageId: '',
      deckTitle: `${paragraph.code} ${paragraph.title}`,
      generatedDeckUrl: '',
      generatedDeckStoragePath: '',
      sourcePdfUrl: '',
      sourcePdfStoragePath: ''
    },
    tokens: plan.slidedeck,
    sourceBasis: ['lessenserie-md']
  }));

  paragraph.theory.forEach(([title, text], index) => {
    blocks.push(block({
      id: `${idPrefix}-theory-${index + 1}`,
      type: 'theory',
      order: order++,
      title,
      content: { html: html([text]), ...theoryEnrichmentFor(paragraph.code, index) },
      tokens: plan.theory[index] || 0,
      sourceBasis: ['wikiwijs', 'lessenserie-md', 'ai-aanvulling']
    }));
  });

  if (paragraph.media?.url || paragraph.media?.label) {
    blocks.push(block({
      id: `${idPrefix}-media`,
      type: 'media',
      order: order++,
      title: paragraph.media.label || 'Media',
      content: {
        html: html([`Kijkvraag: ${paragraph.media.kijkvraag}`]),
        mediaKind: mediaKindForUrl(paragraph.media.url),
        mediaUrl: paragraph.media.url || '',
        caption: paragraph.media.kijkvraag,
        altText: paragraph.media.label || ''
      },
      tokens: plan.media,
      sourceBasis: ['lessenserie-md', 'schooltv-kennisnet-microsoft']
    }));
  }

  blocks.push(block({
    id: `${idPrefix}-question-check`,
    type: 'question',
    order: order++,
    title: 'Korte check',
    content: {
      html: html(['Beantwoord de korte vragen in gewone zinnen.', ...paragraph.checks.map((q) => `<strong>${q}</strong>`)]),
      exercise: { fields: paragraph.checks.map((label, index) => ({ id: `check-${index + 1}`, label, answer: '' })) }
    },
    tokens: plan.check
  }));

  blocks.push(block({
    id: `${idPrefix}-question-practice`,
    type: 'question',
    order: order++,
    title: 'Praktijkopdracht',
    content: {
      html: html([paragraph.assignment]),
      exercise: { fields: [{ id: 'bewijs', label: 'Beschrijf of lever je bewijs in volgens de opdracht.', answer: '' }] }
    },
    tokens: plan.practice
  }));

  // Samenvatting: de laatste leestekst vóór de quiz of toets. De kerndoelcodes
  // zijn docentmetadata en staan daarom naast sourceBasis/sourceNotes in de
  // blokinhoud, niet in de leestekst; sanitizeContent laat ze niet door naar de
  // leerlingweergave.
  const samenvatting = samenvattingFor(paragraph.code);
  blocks.push(block({
    id: `${idPrefix}-summary`,
    type: 'summary',
    order: order++,
    title: 'Samenvatting',
    content: {
      html: samenvatting ? samenvatting.html : html([`Je werkte aan: ${paragraph.product}.`]),
      ...(samenvatting ? { keyTerms: samenvatting.keyTerms } : {}),
      kerndoelen: paragraph.kerndoelen
    },
    tokens: plan.summary
  }));

  const assessmentType = paragraph.checkpoint ? 'toets' : 'quiz';
  const vragen = questionsFor(paragraph.code);
  if (!vragen) missingAssessments.push({ code: paragraph.code, type: assessmentType, ideas: paragraph.assessmentItems.length });

  blocks.push(block({
    id: `${idPrefix}-${assessmentType}`,
    type: assessmentType,
    order: order++,
    title: paragraph.final ? 'Eindtoets' : paragraph.checkpoint ? 'Hoofdstuktoets' : 'Afsluitquiz',
    // Zonder vragen blijft het blok op 'draft'. Het staat dan wel in de CMS,
    // zodat de docent ziet wat er nog moet gebeuren, maar contentBlockUtils
    // filtert draft weg uit de leerlingroute. De tokens blijven op het blok
    // staan en zijn dus onbereikbaar tot de vragen er zijn.
    status: vragen ? 'published' : 'draft',
    content: {
      html: html([
        vragen
          ? paragraph.checkpoint
            ? 'Maak deze toets zelfstandig. De Digidocent staat hier uit.'
            : 'Maak deze korte quiz om te controleren of je de paragraaf begrepen hebt.'
          : `Deze ${assessmentType} heeft nog geen vragen. Vul ze aan in scripts/seed-verrijking en zet het blok daarna op gepubliceerd.`
      ]),
      assessmentType,
      items: vragen ? makeQuestionItems(paragraph.code, vragen, plan.assessment, assessmentType) : [],
      // Docentmetadata: de vraagideeën uit de lessenserie, als startpunt voor wie
      // de vragen gaat schrijven. sanitizeContent laat dit veld niet door naar de
      // leerlingweergave.
      ...(vragen ? {} : { pendingPrompts: paragraph.assessmentItems }),
      attemptPolicy: {
        maxAttempts: paragraph.final || paragraph.checkpoint ? 1 : null,
        scoring: 'best',
        allowTeacherReset: true
      },
      tokenConfig: tokenConfig(plan.assessment)
    },
    tokens: plan.assessment
  }));

  blocks.push(block({
    id: `${idPrefix}-game`,
    type: 'game',
    order: order++,
    title: paragraph.gameTitle,
    content: {
      html: html([`Gameplaceholder: ${paragraph.gameDescription}`, 'Deze game wordt later gebouwd. Je docent kan dit blok nu al in de lesroute laten staan.']),
      gameId: gameIdForTitle(paragraph.gameTitle),
      gameTitle: paragraph.gameTitle,
      settings: { estimatedMinutes: paragraph.checkpoint ? 7 : 5 },
      tokenConfig: tokenConfig(plan.game)
    },
    tokens: plan.game,
    sourceBasis: ['lessenserie-md']
  }));

  const total = blocks.reduce((sum, item) => sum + (item.tokenTotal || 0), 0);
  if (total !== paragraph.tokens) {
    throw new Error(`${paragraph.code} token total ${total} does not match ${paragraph.tokens}`);
  }

  return blocks.map((item) => ({
    ...item,
    vakId: 'vak-digitale-vaardigheden',
    leerjaarId: 'leerjaar-digitale-vaardigheden-vmbo1',
    niveauId: 'niveau-digitale-vaardigheden-vmbo1-vmbo',
    hoofdstukId: `hoofdstuk-dv-h${chapter.chapter}`,
    paragraafId: `paragraaf-dv-${paragraph.code.replace('.', '-')}`
  }));
};

const seed = {
  meta: {
    seedId: 'digitale-vaardigheden-vmbo1',
    generatedAt: new Date().toISOString(),
    status: 'published',
    sourceDocuments: [
      'docs/LessenserieDigitaleVaardigheden30Lessen.md',
      'docs/wikiwijs_dacapo_huidige lessen.json',
      'docs/superpowers/specs/2026-06-04-digitale-vaardigheden-seed-design.md'
    ],
    internalSourceFieldsHiddenFromStudents: ['sourceBasis', 'sourceNotes']
  },
  vakken: [{
    id: 'vak-digitale-vaardigheden',
    name: 'Digitale vaardigheden',
    code: 'DV',
    description: 'Digitale vaardigheden voor VMBO leerjaar 1',
    order: 99,
    isActive: true,
    color: '#2563eb',
    emoji: 'DV'
  }],
  leerjaren: [{
    id: 'leerjaar-digitale-vaardigheden-vmbo1',
    vakId: 'vak-digitale-vaardigheden',
    year: 1,
    label: 'Leerjaar 1',
    order: 1,
    isActive: true
  }],
  niveaus: [{
    id: 'niveau-digitale-vaardigheden-vmbo1-vmbo',
    vakId: 'vak-digitale-vaardigheden',
    leerjaarId: 'leerjaar-digitale-vaardigheden-vmbo1',
    label: 'VMBO',
    name: 'VMBO',
    description: 'Gedeelde leerroute voor VMBO leerjaar 1',
    order: 1,
    isActive: true
  }],
  hoofdstukken: lessons.map((chapter) => ({
    id: `hoofdstuk-dv-h${chapter.chapter}`,
    vakId: 'vak-digitale-vaardigheden',
    leerjaarId: 'leerjaar-digitale-vaardigheden-vmbo1',
    niveauId: 'niveau-digitale-vaardigheden-vmbo1-vmbo',
    number: chapter.chapter,
    title: `H${chapter.chapter}: ${chapter.chapterTitle}`,
    description: `Hoofdstuk ${chapter.chapter} van Digitale vaardigheden.`,
    order: chapter.chapter,
    published: true,
    isArchived: false,
    badge: chapter.badge
  })),
  paragrafen: lessons.flatMap((chapter) => chapter.paragraphs.map((paragraph, index) => {
    const learningGoals = learningGoalsFor(paragraph.code);

    return {
      id: `paragraaf-dv-${paragraph.code.replace('.', '-')}`,
      vakId: 'vak-digitale-vaardigheden',
      leerjaarId: 'leerjaar-digitale-vaardigheden-vmbo1',
      niveauId: 'niveau-digitale-vaardigheden-vmbo1-vmbo',
      hoofdstukId: `hoofdstuk-dv-h${chapter.chapter}`,
      code: paragraph.code,
      title: paragraph.title,
      beschrijving: paragraph.product,
      kerndoelen: paragraph.kerndoelen,
      product: paragraph.product,
      totalTokens: paragraph.tokens,
      order: index + 1,
      published: true,
      aiCompanionEnabled: true,
      cropCount: 0,
      isArchived: false,
      // normalizeParagraphMetadata leest learningGoals; leerdoelen staat erbij
      // omdat de CMS-editor dat veld schrijft. Leeg blijft leeg.
      ...(learningGoals.length ? { learningGoals, leerdoelen: learningGoals } : {})
    };
  })),
  contentBlocks: lessons.flatMap((chapter) => chapter.paragraphs.flatMap((paragraph) => buildBlocks(chapter, paragraph))),
  badges: lessons.map((chapter) => ({
    id: `badge-dv-h${chapter.chapter}`,
    title: chapter.badge,
    hoofdstukId: `hoofdstuk-dv-h${chapter.chapter}`,
    requiredParagrafen: chapter.paragraphs.map((paragraph) => `paragraaf-dv-${paragraph.code.replace('.', '-')}`),
    tokenIndependent: true
  })),
  certificates: [
    { id: 'basis-certificaat-dv', title: 'Basis-certificaat', requirement: '4 van 5 badges + herstelportfolio + eindreflectie', tokenIndependent: true },
    { id: 'volledig-certificaat-dv', title: 'Volledig certificaat', requirement: '5 van 5 badges + portfolio + eindreflectie', tokenIndependent: true }
  ]
};

// Dezelfde feedbackzin in paragraaf na paragraaf is sjabloontekst, geen uitleg.
const hergebruikteFeedback = [...feedbackParagrafen.entries()]
  .filter(([, codes]) => codes.size > MAX_PARAGRAFEN_PER_FEEDBACK);
if (hergebruikteFeedback.length) {
  const details = hergebruikteFeedback
    .map(([feedback, codes]) => `"${feedback.slice(0, 60)}..." in ${[...codes].join(', ')}`)
    .join('; ');
  throw new Error(`feedbackzin mag in maximaal ${MAX_PARAGRAFEN_PER_FEEDBACK} paragrafen staan: ${details}`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Generated ${outputPath}`);
console.log(`${seed.contentBlocks.length} content blocks for ${seed.paragrafen.length} paragrafen`);

const theoryBlocks = seed.contentBlocks.filter((item) => item.type === 'theory');
const summaryBlocks = seed.contentBlocks.filter((item) => item.type === 'summary');
console.log(
  `Verrijking: ${seed.paragrafen.filter((item) => item.learningGoals?.length).length}/${seed.paragrafen.length} paragrafen met leerdoelen, ` +
    `${theoryBlocks.filter((item) => item.content?.keyTerms?.length).length}/${theoryBlocks.length} theorieblokken met kernbegrippen, ` +
    `${theoryBlocks.filter((item) => item.content?.exampleHtml).length}/${theoryBlocks.length} met uitgewerkt voorbeeld, ` +
    `${summaryBlocks.filter((item) => item.content?.keyTerms?.length).length}/${summaryBlocks.length} samenvattingen verrijkt.`
);

const assessmentBlocks = seed.contentBlocks.filter((item) => item.type === 'quiz' || item.type === 'toets');
const publishedAssessments = assessmentBlocks.filter((item) => item.status === 'published');
const questionCount = publishedAssessments.reduce((sum, item) => sum + (item.content?.items?.length || 0), 0);
const closedCount = publishedAssessments.reduce(
  (sum, item) => sum + (item.content?.items || []).filter((entry) => entry.type !== 'open').length,
  0
);
console.log(
  `Toetsvragen: ${publishedAssessments.length}/${assessmentBlocks.length} quiz- en toetsblokken gepubliceerd, ` +
    `${questionCount} vragen (${closedCount} gesloten, ${questionCount - closedCount} open).`
);

if (missingAssessments.length) {
  console.log(`\nNog geen toetsvragen (${missingAssessments.length} van ${assessmentBlocks.length} blokken staan op draft):`);
  for (const entry of missingAssessments) {
    console.log(`  ${entry.code}  ${entry.type.padEnd(5)}  ${entry.ideas} vraagideeën in content.pendingPrompts`);
  }
  console.log('Vul scripts/seed-verrijking/hN.mjs aan onder de sleutel `vragen`; zie de kop van h1.mjs voor het formaat.');
} else {
  console.log('Alle quiz- en toetsblokken hebben eigen vragen.');
}
