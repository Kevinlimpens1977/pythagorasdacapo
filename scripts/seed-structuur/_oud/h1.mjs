// Oud curriculum, hoofdstuk 1. Bewaard om na te kijken, NIET meegeladen:
// de generator leest alleen scripts/seed-structuur/h<n>.mjs, en dit bestand
// staat in _oud. Het nieuwe jaarplan telt acht hoofdstukken en wordt hier
// een map hoger opnieuw opgebouwd.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
  chapter: 1,
  chapterTitle: 'Starten en Account & Veilig',
  badge: 'Account Starter',
  paragraphs: [
    p('1.1', 'Mijn digitale schooltas: HELIX, OneDrive en Outlook', ['21A', '23A', '22A'], 'Word-bewijsbestand in OneDrive', 100, 'Account Escape',
      ['Twee inloggen: school en HELIX', 'Op school werk je met twee inloggen. Met je schoolaccount kom je binnen bij Outlook en OneDrive: Outlook is voor mail, OneDrive is voor bestanden bewaren en delen. Voor HELIX heb je een eigen inlog met een eigen wachtwoord; daar staan je lessen en opdrachten. Zie je inloggegevens als sleutels: elke sleutel past op een andere deur, dus bewaar ze allebei goed.'],
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
};
