export const GAME_MODES = {
  STANDALONE: 'standalone',
  CMS_BLOCK: 'cmsBlock'
};

export const GAME_RESULT_HANDLING = {
  LOCAL_ONLY: 'localOnly',
  SUBMIT_TO_BACKEND: 'submitToBackend'
};

export const GAME_STATUSES = {
  PLANNED: 'planned',
  PROTOTYPE: 'prototype',
  ACTIVE: 'active'
};

// Leeg: het eerste echte spel wordt opgebouwd volgens STARTGIDS-NIEUW-SPEL.md.
// Voorbeeldvorm van een registry-item:
// {
//   gameId: 'mijn-spel',
//   title: 'Mijn Spel',
//   description: 'Korte omschrijving voor docenten.',
//   subject: 'Digitale vaardigheden',
//   topic: 'Onderwerp',
//   level: 'VMBO leerjaar 1',
//   learningGoals: ['...'],
//   skills: ['...'],
//   estimatedMinutes: 5,
//   route: '/admin/spellen/mijn-spel',
//   componentKey: 'mijnSpel',
//   cmsEmbeddable: true,
//   supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
//   tokenRewardPotential: { min: 0, max: 10, basis: 'score_accuracy_completion' },
//   maxPlays: 0, // 0 = onbeperkt; kennisspel bijv. 3, behendigheidsspel 0
//   status: GAME_STATUSES.PROTOTYPE
// }
// Geplande games voor de leerroute Digitale vaardigheden (30 paragrafen).
// Elk gameblok in docs/seeds/digitale-vaardigheden-vmbo1.seed.json verwijst naar
// een gameId uit deze lijst; de ids liggen vast in
// docs/superpowers/plans/2026-06-04-digitale-vaardigheden-seed-implementation-plan.md.
// Er is nog geen speelbare component, dus GamePlayer toont zelf de nette
// placeholder "Deze game is nog in ontwikkeling" en er staat geen tokenregel
// tegenover (zie SERVER_DEFAULT_GAME_REWARD_RULES): een leerling verdient hier
// niets mee tot het spel echt gebouwd is.
const plannedDigitaleVaardighedenGame = ([gameId, title, code, paragraafTitle, estimatedMinutes, description]) => ({
  gameId,
  title,
  description,
  subject: 'Digitale vaardigheden',
  topic: `${code} ${paragraafTitle}`,
  level: 'VMBO leerjaar 1',
  learningGoals: [`De kernbegrippen uit paragraaf ${code} oefenen in spelvorm.`],
  skills: ['digitale vaardigheden'],
  estimatedMinutes,
  // Leeg zolang er geen component en geen eigen route bestaat.
  route: '',
  componentKey: '',
  cmsEmbeddable: true,
  supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
  tokenRewardPotential: { min: 0, max: 0, basis: 'completion' },
  maxPlays: 3,
  status: GAME_STATUSES.PLANNED
});

const PLANNED_DIGITALE_VAARDIGHEDEN_GAMES = [
  ['dv-account-escape', 'Account Escape', '1.1', 'Mijn digitale schooltas: HELIX, OneDrive en Outlook', 5, 'Escape met kamers voor inloggen, mail vinden, map maken en veilig uitloggen.'],
  ['dv-password-lab', 'Password Lab', '1.2', 'Veilig wachtwoord en accountregels', 5, 'Sorteer nepwachtwoorden van zwak naar sterk en verbeter ze naar wachtwoordzinnen.'],
  ['dv-hardware-hunt', 'Hardware Hunt', '1.3', 'Mijn device: hardware, software, instellingen en updates', 5, 'Klik onderdelen aan, koppel functies en beslis welke instellingen veilig zijn.'],
  ['dv-bestandenrace', 'Bestandenrace', '1.4', 'Bestanden zonder chaos in OneDrive', 5, 'Sleep bestanden naar de juiste map en kies de beste naam onder tijdsdruk.'],
  ['dv-phishing-detective', 'Phishing Detective', '1.5', 'Phishing en verdachte berichten', 5, 'Klik rode vlaggen aan in fictieve berichten en kies de juiste vervolgstap.'],
  ['dv-schoolstart-escape', 'Schoolstart Escape', '1.6', 'Checkpoint: veilig digitaal starten', 7, 'Vijf kamers met één bewijsactie per kamer.'],
  ['dv-opmaakdokter', 'Opmaakdokter', '2.1', 'Word: een net schooldocument', 5, 'Herstel drukke tekst, ontbrekende titel, verkeerde afbeelding en ontbrekende bron.'],
  ['dv-plagiaatpolitie', 'Plagiaatpolitie', '2.2', 'Word-verslag met koppen en bronnen', 5, 'Label zinnen als eigen woorden, citaat of kopie zonder bron.'],
  ['dv-dia-dokter', 'Dia Dokter', '2.3', 'PowerPoint: duidelijk presenteren', 5, 'Verbeter slechte dia’s met keuzes voor tekst, beeld, contrast en volgorde.'],
  ['dv-pitchtimer', 'Pitchtimer', '2.4', 'PowerPoint: uitleg in 5 dia’s', 5, 'Oefen 45 seconden uitleg zonder alles voor te lezen.'],
  ['dv-deelrechten-duel', 'Deelrechten Duel', '2.5', 'Samenwerken via OneDrive en Outlook', 5, 'Kies per situatie privé, bekijken, bewerken of niet delen.'],
  ['dv-microsoft-maker-challenge', 'Microsoft Maker Challenge', '2.6', 'Checkpoint: Microsoft tools', 7, 'Vind fouten in document, dia, mail en deelinstelling.'],
  ['dv-privacy-thermometer', 'Privacy Thermometer', '3.1', 'Privacy en digitale voetafdruk', 5, 'Sorteer scenario’s in groen, oranje of rood met feedback op wie dit ziet en wat veiliger is.'],
  ['dv-feed-sorteerspel', 'Feed Sorteerspel', '3.2', 'Social media, algoritmes en identiteit', 5, 'Kies klik, like of negeren bij fictieve posts en zie hoe de feed verandert.'],
  ['dv-bronbattle', 'Bronbattle', '3.3', 'Nepnieuws en betrouwbare bronnen', 5, 'Rangschik bronnen en verdien bonus voor bewijszinnen.'],
  ['dv-grenzenkompas', 'Grenzenkompas', '3.4', 'Cyberpesten, grenzen en hulp zoeken', 5, 'Kies bij scenario’s: oké, twijfel, niet oké of hulp nodig.'],
  ['dv-webshop-inspecteur', 'Webshop Inspecteur', '3.5', 'Online shoppen en betalen', 5, 'Vind acht signalen in fictieve webshops en bepaal veilig, twijfel of niet kopen.'],
  ['dv-mediawijs-boss', 'Mediawijs Boss', '3.6', 'Checkpoint: mediawijs handelen', 7, 'Levels per thema met een eindbaas die nepbericht, groepschat en kooplink combineert.'],
  ['dv-tabel-tetris', 'Tabel Tetris', '4.1', 'Excel: tabellen maken', 5, 'Sleep datakaartjes naar de juiste kolom.'],
  ['dv-formule-fixer', 'Formule Fixer', '4.2', 'Excel: rekenen met formules', 5, 'Repareer kapotte formules en leg uit wat fout was.'],
  ['dv-grafiek-judge', 'Grafiek Judge', '4.3', 'Grafieken die iets vertellen', 5, 'Beoordeel grafieken met stoplicht en bewijszin.'],
  ['dv-data-spoorzoeker', 'Data Spoorzoeker', '4.4', 'Data om je heen en data/privacy', 5, 'Volg dataspuren door een schooldag en benoem gebruiker, doel en risico.'],
  ['dv-claim-checker', 'Claim Checker', '4.5', 'Bronnen beoordelen met data en bewijs', 5, 'Sorteer claims in sterk bewijs, twijfel of zwak bewijs.'],
  ['dv-dashboard-dash', 'Dashboard Dash', '4.6', 'Checkpoint: data-dashboard en bronkeuze', 7, 'Kies per onderzoeksvraag de beste visualisatie en plaats die op een dashboard.'],
  ['dv-prompt-duel', 'Prompt Duel', '5.1', 'Wat is AI en hoe gebruik je een chatbot verstandig?', 5, 'Vergelijk prompts en verbeter de zwakke prompt met doel, doelgroep, lengte en controle.'],
  ['dv-echt-nep-of-twijfel', 'Echt, nep of twijfel?', '5.2', 'AI-beelden, deepfakes en beroepen', 5, 'Verzamel bewijschecks voordat je kiest of iets echt, nep of twijfel is.'],
  ['dv-algoritme-estafette', 'Algoritme Estafette', '5.3', 'Algoritmes zonder computer', 5, 'Leg stappenkaarten in volgorde; een tester voert letterlijk uit en markeert de eerste onduidelijke stap.'],
  ['dv-debug-sprint', 'Debug Sprint', '5.4', 'Programmeren met blokken en debuggen', 5, 'Los korte blokkenprogramma’s met één fout op.'],
  ['dv-portfolio-quest', 'Portfolio Quest', '5.5', 'Portfolio bouwen, digitale samenleving en herstel', 5, 'Unlock bewijsstukken pas na openen, controleren en reflectiezin.'],
  ['dv-certificaat-quest-finale', 'Certificaat Quest Finale', '5.6', 'Eindexpo: mijn digitale vaardigheden certificaat', 7, 'Beantwoord portfoliovragen en geef peerfeedback met twee sterren en één tip.'],

  // Nieuw jaarplan (8 hoofdstukken, drie leerwegen). De paragraafnummers
  // hierboven horen bij het oude curriculum van 30 paragrafen; die ids blijven
  // staan tot dat curriculum uit de seed verdwijnt. Hieronder de games van het
  // nieuwe jaarplan, in dezelfde vorm: gepland, geen component, geen tokens.
  ['dv-inlog-escape', 'Inlog Escape', '1.1', 'De digitale systemen van school', 5, 'Escapegame met vier kamers: inloggen, wifi, rooster vinden en een opdracht inleveren.'],
  ['dv-wachtwoord-bouwer', 'Wachtwoord Bouwer', '1.2', 'Een sterk wachtwoord maken en bewaren', 5, 'Bouw wachtwoorden op sterkte en sorteer bewaarplekken van onveilig naar veilig.'],
  ['dv-mail-meester', 'Mail Meester', '1.3', 'Netjes mailen met Outlook', 5, 'Sleep de onderdelen van een mail in de goede volgorde en herstel drie slordige mails.'],
  ['dv-stadsbouwer-digiwereld', 'Stadsbouwer Digiwereld', '1.4', 'Digitale geletterdheid: jouw digitale wereld', 5, 'Bouw je eigen digitale stad: plaats gebouwen, kies omgangsregels en zet de juiste wetten op de borden.'],
  ['dv-startklaar-challenge', 'Startklaar Challenge', '1.5', 'Checkpoint: klaar voor het digitale schooljaar', 7, 'Vijf kamers, elke kamer één bewijsactie uit hoofdstuk 1.'],
  ['dv-sleutel-en-slot', 'Sleutel en Slot', '1.6', 'Plus: hoe beschermt een wachtwoord jou eigenlijk?', 5, 'Kraak-simulator: vergelijk wachtwoorden op lengte en zie hoeveel mogelijkheden een raadmachine moet aflopen.'],
  ['dv-moederbord-monteur', 'Moederbord Monteur', '2.1', 'Hardware: de onderdelen van je device', 5, 'Sleep de onderdelen naar de juiste plek op het moederbord en koppel elk onderdeel aan zijn taak.'],
  ['dv-update-loods', 'Update Loods', '2.2', 'Software, besturingssysteem en updates', 5, 'Loods updates door de sluis: kies per melding of je hem nu installeert, uitstelt of negeert, en zie het gevolg.'],
  ['dv-mappen-meester', 'Mappen Meester', '2.3', 'Bestanden ordenen: Verkenner, OneDrive en sneltoetsen', 5, 'Ruim een chaotische bureaubladmap op: maak mappen, versleep bestanden en gebruik de juiste sneltoets bij elke stap.'],
  ['dv-pakketjes-race', 'Pakketjes Race', '2.4', 'Internet en data: hoe reist jouw informatie?', 5, 'Breng informatiepakketjes van server naar scherm: kies bij elke splitsing de route die het snelst aankomt.'],
  ['dv-device-challenge', 'Device Challenge', '2.5', 'Checkpoint: mijn device onder controle', 7, 'Vier kamers, elke kamer één bewijsactie uit hoofdstuk 2: onderdeel benoemen, update kiezen, map bouwen en pakketje sturen.'],
  ['dv-bit-bouwer', 'Bit Bouwer', '2.6', 'Plus: hoe voert een computer jouw opdracht uit?', 5, 'Bouw getallen en letters uit bits: zet de schakelaars goed en zie welk teken er op het scherm verschijnt.'],
  ['dv-normen-navigator', 'Normen Navigator', '5.1', 'Jouw digitale wereld: normen, waarden en gedragsregels', 5, 'Sorteer uitspraken bij de juiste waarde en bouw per waarde een set normen die klopt.'],
  ['dv-privacy-schild', 'Privacy Schild', '5.2', 'Privacy beschermen en berichten rapporteren', 5, 'Stel per situatie het juiste privacyschild samen: instelling, melding of gesprek.'],
  ['dv-webshop-detective', 'Webshop Detective', '5.3', 'Veilig online shoppen: is deze webshop te vertrouwen?', 5, 'Onderzoek nepwebshops: verzamel per zaak vijf aanwijzingen en spreek daarna je oordeel uit.'],
  ['dv-betaalroute', 'Betaalroute', '5.4', 'Betalen en kopen uit het buitenland', 5, 'Kies per aankoop de beste betaalroute en zie welke kosten en risico’s je onderweg tegenkomt.'],
  ['dv-bewust-online-challenge', 'Bewust Online Challenge', '5.5', 'Checkpoint: bewust online kopen en delen', 7, 'Vijf kamers: gedrag, privacy, webshopcheck, betaalkeuze en douane, elk met een echte casus.'],
  ['dv-rechten-radar', 'Rechten Radar', '5.6', 'Plus: jouw rechten als online koper', 5, 'Volg een bestelling die misgaat en kies bij elke stap het recht dat op dat moment geldt.'],
  ['dv-stappen-sorteren', 'Stappen Sorteren', '8.1', 'Algoritmes: een stappenplan voor de computer', 5, 'Sleep losse instructies in de goede volgorde en bouw daarna een herhaling en een keuze in het stappenplan.'],
  ['dv-blokkenbouwer', 'Blokkenbouwer', '8.2', 'Zelf programmeren met blokken', 5, 'Klik blokken aan elkaar tot de sprite de opdracht haalt; elk level vraagt een extra herhaling of keuze.'],
  ['dv-bugjacht', 'Bugjacht', '8.3', 'Testen en verbeteren: fouten uit je programma halen', 5, 'Vind in vijf kapotte programma’s de bug, kies de juiste verbetering en test opnieuw.'],
  ['dv-canva-ontwerpduel', 'Canva Ontwerpduel', '8.4', 'Zelf ontwerpen in Canva', 5, 'Ontwerp tegen de klok: kies template, tekst, element en kleur die het best bij de opdracht passen.'],
  ['dv-posterlab', 'Posterlab', '8.5', 'Eindopdracht: poster met Canva en AI', 5, 'Beoordeel andermans posters op leesbaarheid, drukte en actie, en repareer de zwakste in drie zetten.'],
  ['dv-terugblik-challenge', 'Terugblik Challenge', '8.6', 'Checkpoint: terugblik en jouw digitale creatie', 7, 'Loop in vijf kamers je hele jaar langs: een algoritme, een bug, een ontwerp, een prompt en je eigen terugblik.'],
  ['dv-van-blok-naar-code', 'Van Blok naar Code', '8.7', 'Plus: van blokken naar echte code', 5, 'Leg blok en coderegel naast elkaar en koppel elk Scratch-blok aan de juiste regel Python.'],
  ['dv-voorblad-bouwer', 'Voorblad Bouwer', '4.1', 'Word: je eerste document met voorblad, opmaak en paginanummers', 5, 'Vul de vijf velden van een automatisch voorblad en kies bij elke opmaakopdracht de goede sneltoets.'],
  ['dv-kop-of-geen-kop', 'Kop of Geen Kop', '4.2', 'Koppen en een automatische inhoudsopgave', 5, 'Sorteer stukken tekst in Kop 1, Kop 2 of gewone tekst en bouw daarmee een kloppende inhoudsopgave.'],
  ['dv-beeldrechter', 'Beeldrechter', '4.3', 'Afbeeldingen invoegen en beeld dat je mag gebruiken', 5, 'Beoordeel per afbeelding of je hem mag gebruiken en sleep hem daarna naar de beste plek in de tekst.'],
  ['dv-cel-commando', 'Cel Commando', '4.4', 'Gegevens in Excel: tabel, formule en grafiek', 5, 'Vul een tabel goed in, kies de juiste formule en lees daarna de bijbehorende grafiek af.'],
  ['dv-dia-dirigent', 'Dia Dirigent', '4.5', 'PowerPoint: dia’s, tekst, ontwerp en overgangen', 5, 'Zet de stappen van een presentatie in de goede volgorde en koppel dia, tekstvak en overgang aan de juiste uitleg.'],
  ['dv-presenteer-pro', 'Presenteer Pro', '4.6', 'Je eigen presentatie maken en presenteren', 5, 'Bouw een presentatie door dia’s op de goede plek te zetten en verbeter dia’s die te vol of onleesbaar zijn.'],
  ['dv-ict-eindronde', 'ICT Eindronde', '4.7', 'Checkpoint: eindtoets basisvaardigheden ICT', 7, 'Vier werelden achter elkaar: account, device, veilig internet en Office, met per wereld een echte casus.'],
  ['dv-data-detective', 'Data Detective', '4.8', 'Plus: gegevens analyseren met Excel', 5, 'Kies bij elke onderzoeksvraag het juiste gereedschap: sorteren, filteren of een ander grafiektype.'],
  ['dv-mens-of-machine', 'Mens of Machine', '7.1', 'Wat is kunstmatige intelligentie?', 5, 'Sorteer voorbeelden op de vraag: leert dit systeem zelf, of volgt het alleen een vaste regel?'],
  ['dv-echt-of-gegenereerd', 'Echt of Gegenereerd', '7.2', 'Voordelen, gevaren en AI-beeld', 5, 'Beoordeel twintig gezichten en verzamel punten voor elk kenmerk dat je goed aanwijst.'],
  ['dv-prompt-bouwer', 'Prompt Bouwer', '7.3', 'Een chatbot gebruiken: een goede prompt schrijven', 5, 'Bouw prompts uit losse onderdelen en zie per prompt hoe bruikbaar het antwoord wordt.'],
  ['dv-klopt-dat-wel', 'Klopt Dat Wel', '7.4', 'Kritisch met chatbots: hallucinatie en veilig gebruik', 5, 'Beoordeel chatbotantwoorden: klopt het, is het verzonnen, of moet je het eerst controleren?'],
  ['dv-ai-challenge', 'AI Challenge', '7.5', 'Checkpoint: slim en veilig met AI', 7, 'Vijf kamers, elke kamer één bewijsactie uit hoofdstuk 7.'],
  ['dv-volgend-woord', 'Volgend Woord', '7.6', 'Plus: waar haalt AI zijn antwoorden vandaan?', 5, 'Raad zelf het volgende woord en neem het op tegen het model; zie hoe vaak jullie hetzelfde kiezen.'],
  ['dv-feed-fabriek', 'Feed Fabriek', '6.1', 'Social media en het algoritme', 5, 'Bouw een tijdlijn: kies signalen, kijk wat het algoritme daarna aanraadt en probeer je eigen bubbel open te breken.'],
  ['dv-echt-of-gefilterd', 'Echt of Gefilterd', '6.2', 'FOMO, druk en je zelfbeeld', 5, 'Beoordeel posts op echt of gefilterd, ontmasker het highlight reel en verzamel punten met gezonde keuzes.'],
  ['dv-groepsapp-alarm', 'Groepsapp Alarm', '6.3', 'Cyberpesten: wat het is en wat het doet', 5, 'Lees mee in een groepsapp, herken het moment waarop het pesten wordt en kies per bericht wat je doet.'],
  ['dv-omstander-of-held', 'Omstander of Held', '6.4', 'Wat doe jij bij cyberpesten?', 5, 'Kies in tien online situaties tussen wegkijken, meelachen of ingrijpen en zie meteen wat je keuze doet.'],
  ['dv-schermtijd-balans', 'Schermtijd Balans', '6.5', 'Digitaal gezond blijven', 5, 'Plan een schooldag vol schermmomenten en houd houding, ogen en slaap tegelijk in de groene zone.'],
  ['dv-factcheck-rush', 'Factcheck Rush', '6.6', 'Nepnieuws, deepfake en betrouwbare bronnen', 5, 'Beoordeel berichten onder tijdsdruk op kop, bron en beeld en verzamel bewijs voordat je doorstuurt.'],
  ['dv-mediawijs-meesterproef', 'Mediawijs Meesterproef', '6.7', 'Checkpoint: eindtoets mediawijsheid', 7, 'Vijf kamers, elke kamer een leerdoel uit hoofdstuk 6, met een eindsleutel die je alleen krijgt bij volledig bewijs.'],
  ['dv-bubbel-doorbreker', 'Bubbel Doorbreker', '6.8', 'Plus: hoe een aanbevelingsalgoritme jou leert kennen', 5, 'Stuur een simulatie van jouw feed: geef signalen af, zie het profiel groeien en probeer de bubbel weer open te breken.']
].map(plannedDigitaleVaardighedenGame);

export const GAME_REGISTRY = [
  {
    gameId: 'wachtwoord-detective',
    title: 'Wachtwoord Detective',
    description:
      'Kraak als detective de wachtwoorden van vier personages via hun online profiel, en leer waarom een sterk wachtwoord niets over jou mag verklappen.',
    subject: 'Digitale vaardigheden',
    topic: 'Veilige wachtwoorden',
    level: 'VMBO kader-TL leerjaar 1',
    learningGoals: [
      'Herkennen waarom persoonlijke informatie in wachtwoorden onveilig is',
      'Zwakke en sterke wachtwoorden van elkaar onderscheiden',
      'Zelf een sterke wachtwoordzin samenstellen'
    ],
    skills: ['veilig handelen', 'kritisch denken', 'accountveiligheid'],
    estimatedMinutes: 6,
    route: '/admin/spellen/wachtwoord-detective',
    componentKey: 'wachtwoordDetective',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 100, basis: 'score_accuracy_completion' },
    // Default speellimiet (0 = onbeperkt). Kennisspel: na 3 keer kennen ze de antwoorden.
    // Kan per spel overschreven worden op /admin/spellen.
    maxPlays: 3,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'social-media-zoektocht',
    title: 'Social Media Zoektocht',
    description:
      'Zoek-en-vindspel in drie levels plus bonuslevel: speur als digitale detective apparaten, symbolen en gevaren op in een klaslokaal, influencerkamer, social media studio en op het grote mediafestival.',
    subject: 'Digitale vaardigheden',
    topic: 'Sociale media, privacy en veilig internet',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Digitale apparaten en socialmedia-symbolen herkennen',
      'Veilig omgaan met vergrendelen, locatie delen en verdachte berichten',
      'Signalen van phishing en nepnieuws herkennen'
    ],
    skills: ['waarnemen', 'veilig handelen', 'mediawijsheid'],
    estimatedMinutes: 12,
    route: '/admin/spellen/social-media-zoektocht',
    componentKey: 'socialMediaZoektocht',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 200, basis: 'score_accuracy_completion' },
    maxPlays: 3,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'turbo-typen',
    title: 'Turbo Typen',
    description:
      'Sneltypspel in vijf levels: digitale woorden razen naar de firewall en jij typt ze weg. Elk level worden de woorden langer en sneller.',
    subject: 'Digitale vaardigheden',
    topic: 'Sneltypen en digitale woordenschat',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Sneller en foutloos leren typen',
      'Digitale kernbegrippen herkennen en spellen',
      'Onder tijdsdruk nauwkeurig blijven werken'
    ],
    skills: ['typvaardigheid', 'concentratie', 'digitale woordenschat'],
    estimatedMinutes: 8,
    route: '/admin/spellen/turbo-typen',
    componentKey: 'turboTypen',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 200, basis: 'score_accuracy_completion' },
    // Onbeperkt oefenen mag: de tokenopbrengst halveert server-side per beurt (replayDecay).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'paco-pac-man',
    title: 'PacoPacMan',
    description:
      'Doolhof-arcadespel in vier levels: eet datapunten, ontwijk de virussen en beantwoord powervragen over digitale vaardigheden om de virussen op te eten. Finale met teleports en de Virus-Koning.',
    subject: 'Digitale vaardigheden',
    topic: 'De hele leerlijn: basis ICT, Office, mediawijsheid en AI',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Kernbegrippen uit de hele cursus herhalen in spelvorm',
      'Sterke wachtwoorden, phishing en nepnieuws herkennen',
      'Slim omgaan met AI, algoritmes en schermtijd'
    ],
    skills: ['reactievermogen', 'kennis toepassen', 'digitale geletterdheid'],
    estimatedMinutes: 15,
    route: '/admin/spellen/paco-pac-man',
    componentKey: 'pacoPacMan',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 400, basis: 'score_accuracy_completion' },
    // Onbeperkt oefenen; tokens vervallen per beurt via replayDecay (plafond 400).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'data-koerier',
    title: 'Data Koerier',
    description:
      'Leer blind typen met tien vingers: bezorg datapakketjes door foutloos te typen. Dertien routes van basisrij tot volledige zinnen, plus een snelheids-Toprit.',
    subject: 'Digitale vaardigheden',
    topic: 'Blind typen met tien vingers',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Blind typen met de juiste vinger per toets',
      'Eerst nauwkeurig, daarna sneller leren typen',
      'Digitale kernwoorden en zinnen foutloos typen'
    ],
    skills: ['typvaardigheid', 'vingerzetting', 'concentratie'],
    estimatedMinutes: 5,
    route: '/admin/spellen/data-koerier',
    componentKey: 'dataKoerier',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 200, basis: 'score_accuracy_completion' },
    // Onbeperkt oefenen mag: de tokenopbrengst halveert server-side per beurt (replayDecay).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  {
    gameId: 'dvlingo',
    title: 'DVLingo',
    description:
      'Digitale Vaardigheden Lingo: raad woorden over veilig en slim online zijn in drie levels, met na elk level de ballenfase en een bonuswoord van elf letters.',
    subject: 'Digitale vaardigheden',
    topic: 'Digitale woordenschat: veiligheid, internet en apparaten',
    level: 'VMBO basis/kader/TL leerjaar 1-2',
    learningGoals: [
      'Kernbegrippen over digitale veiligheid herkennen en spellen',
      'Woorden ontleden op letters en posities onder tijdsdruk',
      'Doorzetten en slim gokken bij onvolledige informatie'
    ],
    skills: ['digitale woordenschat', 'logisch redeneren', 'spelling'],
    estimatedMinutes: 20,
    route: '/admin/spellen/dvlingo',
    componentKey: 'dvlingo',
    cmsEmbeddable: true,
    supportedModes: [GAME_MODES.STANDALONE, GAME_MODES.CMS_BLOCK],
    tokenRewardPotential: { min: 0, max: 400, basis: 'score_accuracy_completion' },
    // Onbeperkt spelen; de opbrengst halveert server-side per beurt (replayDecay).
    maxPlays: 0,
    status: GAME_STATUSES.PROTOTYPE
  },
  ...PLANNED_DIGITALE_VAARDIGHEDEN_GAMES
];

export const getGameById = (gameId) => {
  return GAME_REGISTRY.find((game) => game.gameId === gameId) || null;
};

export const getCmsEmbeddableGames = () => {
  return GAME_REGISTRY.filter((game) => game.supportedModes.includes(GAME_MODES.CMS_BLOCK));
};

export const isSerializableGameRegistryItem = (game) => {
  try {
    return JSON.stringify(game) !== undefined;
  } catch {
    return false;
  }
};

export const createLocalGameResult = ({
  game,
  context,
  score = 0,
  maxScore = 0,
  startedAt,
  completedAt,
  attemptId,
  details = null
}) => {
  const safeMaxScore = Number(maxScore) > 0 ? Number(maxScore) : 0;
  const safeScore = Math.max(0, Number(score) || 0);
  const accuracy = safeMaxScore > 0 ? Math.round((Math.min(safeScore, safeMaxScore) / safeMaxScore) * 100) : 0;
  const startedDate = startedAt ? new Date(startedAt) : new Date();
  const completedDate = completedAt ? new Date(completedAt) : new Date();
  const timeSpentSeconds = Math.max(0, Math.round((completedDate.getTime() - startedDate.getTime()) / 1000));

  return {
    attemptId: attemptId || createAttemptId(game.gameId),
    gameId: game.gameId,
    studentId: context?.studentId,
    lessonId: context?.lessonId,
    blockId: context?.blockId,
    score: safeScore,
    maxScore: safeMaxScore,
    accuracy,
    timeSpentSeconds,
    startedAt: startedDate.toISOString(),
    completedAt: completedDate.toISOString(),
    suggestedTokenReward: calculateSuggestedTokenReward(game, accuracy),
    // Optionele spel-specifieke details (bijv. per-level statistieken);
    // reizen mee naar de voortgangsopslag, server negeert onbekende velden.
    ...(details ? { details } : {})
  };
};

const createAttemptId = (gameId) => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${gameId}-${crypto.randomUUID()}`;
  }

  return `${gameId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const calculateSuggestedTokenReward = (game, accuracy) => {
  const potential = game.tokenRewardPotential || { min: 0, max: 0 };
  const min = Number(potential.min) || 0;
  const max = Number(potential.max) || 0;
  const estimated = Math.round((max * Math.max(0, Math.min(accuracy, 100))) / 100);

  return Math.max(min, Math.min(max, estimated));
};
