// Oud curriculum, hoofdstuk 5. Bewaard om na te kijken, NIET meegeladen:
// de generator leest alleen scripts/seed-structuur/h<n>.mjs, en dit bestand
// staat in _oud. Het nieuwe jaarplan telt acht hoofdstukken en wordt hier
// een map hoger opnieuw opgebouwd.

import { p, checkpoint, media } from '../helpers.mjs';

export default {
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
};
