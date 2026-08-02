// Routecontent voor Data Koerier. Puur data, geen logica.
// Elke regel in een pool is één typdoel. Spaties tellen mee als aanslag.
//
// Tekensetregel: een regel gebruikt alleen toetsen die in deze of een eerdere
// route zijn geïntroduceerd, plus de spatie. Hoofdletters pas vanaf route 7.

export const DATA_KOERIER_ROUTES = [
  {
    id: 'route-01-startpositie',
    nummer: 1,
    titel: 'Startpositie',
    uitleg: 'Leg je linkerwijsvinger op de f en je rechterwijsvinger op de j. Voel je de richeltjes? Dan zit je goed. Je middelvingers rusten op d en k.',
    tip: 'Kijk niet naar je handen. De richeltjes op f en j wijzen je de weg. De spatie tik je met je duim.',
    nieuweToetsen: ['f', 'j', 'd', 'k'],
    hoofdletters: false,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'fff jjj fff',
          'jjj fff jjj',
          'fjf jfj fjf',
          'ddd kkk ddd',
          'kkk ddd kkk',
          'dkd kdk dkd'
        ]
      },
      {
        titel: 'Wisselwerk',
        type: 'reeks',
        kies: 4,
        pool: [
          'fj fj dk dk fj',
          'jf jf kd kd jf',
          'df df jk jk df',
          'fd fd kj kj fd',
          'fk fk jd jd fk',
          'kf kf dj dj kf',
          'dfj dfj jfd jfd',
          'kjf kjf fjk fjk'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'reeks',
        kies: 4,
        pool: [
          'fdjk fdjk fdjk',
          'jkfd jkfd jkfd',
          'kdfj kdfj kdfj',
          'fjdk fjdk fjdk',
          'dkjf dkjf dkjf',
          'jfkd jfkd jfkd',
          'kjdf kjdf kjdf',
          'djfk djfk djfk'
        ]
      }
    ]
  },
  {
    id: 'route-02-linkerhand-thuis',
    nummer: 2,
    titel: 'Linkerhand thuis',
    uitleg: 'Je linkerhand krijgt drie toetsen erbij: de a met je pink, de s met je ringvinger en de g met je wijsvinger.',
    tip: 'De g ligt naast de f. Strek je linkerwijsvinger even opzij en spring daarna meteen terug naar de f.',
    nieuweToetsen: ['a', 's', 'g'],
    hoofdletters: false,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'aaa sss aaa',
          'sss aaa sss',
          'ggg fff ggg',
          'asa sas asa',
          'gag aga gag',
          'sgs gsg sgs'
        ]
      },
      {
        titel: 'Springwerk',
        type: 'reeks',
        kies: 4,
        pool: [
          'asdf asdf asdf',
          'fdsa fdsa fdsa',
          'ag ag sf sf ag',
          'gd gd sa sa gd',
          'aj aj sk sk aj',
          'gj gj ad ad gj',
          'fa fa ks ks fa',
          'ga ga df df ga'
        ]
      },
      {
        titel: 'Eerste woorden',
        type: 'woorden',
        kies: 3,
        pool: [
          'das gas jas kas ja',
          'kaas gaas dag af ga',
          'aas dak kajak saga',
          'kaak gaf das jas',
          'dag kaas gas af ja',
          'ga saga kajak kas',
          'gaas aas dak kaak gaf'
        ]
      }
    ]
  },
  {
    id: 'route-03-rechterhand-thuis',
    nummer: 3,
    titel: 'Rechterhand thuis',
    uitleg: 'Nu je rechterhand: de h met je wijsvinger, de l met je ringvinger en de puntkomma met je pink.',
    tip: 'De h ligt naast de j. Spring met je rechterwijsvinger naar de h en veer meteen terug naar de j.',
    nieuweToetsen: ['h', 'l', ';'],
    hoofdletters: false,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'hhh lll hhh',
          'lll hhh lll',
          'hjh jhj hjh',
          'lkl klk lkl',
          ';;; lll ;;;',
          ';l; l;l ;l;'
        ]
      },
      {
        titel: 'Sprongen',
        type: 'reeks',
        kies: 4,
        pool: [
          'hj hj kl kl hj',
          'jh jh lk lk jh',
          'gh gh l; l; gh',
          'hg hg ;l ;l hg',
          'lha lha ahl ahl',
          'shl shl khl khl',
          'jkl; jkl; jkl;',
          ';lkj ;lkj ;lkj'
        ]
      },
      {
        titel: 'Woordenrit',
        type: 'woorden',
        kies: 4,
        pool: [
          'als hal las gal',
          'klas glas half dal',
          'slak haak laag sla',
          'hals haag hak lak',
          'gala salsa kalf al',
          'glad slag galg la',
          'haal dal als lag',
          'lag haal glas hal'
        ]
      }
    ]
  },
  {
    id: 'route-04-beide-handen-samen',
    nummer: 4,
    titel: 'Beide handen samen',
    uitleg: 'Geen nieuwe toetsen. Je traint nu allebei je handen samen op de thuisrij en typt echte woorden.',
    tip: 'Laat je vingers na elke aanslag terugveren naar de thuisrij. Zo weet je altijd waar je bent.',
    nieuweToetsen: [],
    hoofdletters: false,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'asdf jkl; asdf',
          'jkl; asdf jkl;',
          ';lkj fdsa ;lkj',
          'fdsa ;lkj fdsa',
          'fghj jhgf fghj',
          'hjkl gfds hjkl'
        ]
      },
      {
        titel: 'Woordenmix',
        type: 'woorden',
        kies: 4,
        pool: [
          'sjaal kajak salsa',
          'das jas kas dal hal',
          'gas glas klas haag',
          'half hals kalf galg',
          'laag haal slak aas',
          'dag lag gaf sla lak',
          'als dak kaak gaas ja',
          'gala sjaal glad slag'
        ]
      },
      {
        titel: 'Expreswoorden',
        type: 'woorden',
        kies: 4,
        pool: [
          'klas gaas kajak dal',
          'haag half salsa dag',
          'glas hals dak lag ja',
          'kaak galg slak haal',
          'das gas jas hal lak',
          'aas kalf gala glad',
          'als kas laag gaf sla',
          'haak slag saga kaas'
        ]
      }
    ]
  },
  {
    id: 'route-05-bovenste-rij',
    nummer: 5,
    titel: 'De bovenste rij',
    uitleg: 'Je vingers reiken nu omhoog. Eerst e, r, u en i, daarna t, o, w, y, q en p. Spring omhoog en veer terug naar de thuisrij.',
    tip: 'De e typ je met je linkermiddelvinger, de i met je rechtermiddelvinger, de r en u met je wijsvingers. Later: t en y zijn een verre reik van je wijsvingers, q en p zijn voor je pinken.',
    nieuweToetsen: ['e', 'r', 'u', 'i', 't', 'o', 'w', 'y', 'q', 'p'],
    hoofdletters: false,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'ded ded kik kik',
          'frf frf juj juj',
          'ede ede iki iki',
          'rfr rfr uju uju',
          'dre dre kui kui',
          'fer fer jui jui'
        ]
      },
      {
        titel: 'Eerste woorden',
        type: 'woorden',
        kies: 3,
        pool: [
          'leuk huis reis deur',
          'dier hier drie kies',
          'ruil duik kuil rijk',
          'stuur les durf geluid',
          'leraar aardig suiker',
          'eerlijk kies duik les',
          'huis dier deur drie'
        ]
      },
      {
        titel: 'Hele bovenrij',
        type: 'woorden',
        kies: 4,
        pool: [
          'typ toets woord tekst',
          'stop top pret weer',
          'water wereld poster',
          'route rit post pakket',
          'koerier data grote trap',
          'start stuur spoor kaart',
          'speler werk sterk goud',
          'wijs hulp regels adres'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'woorden',
        kies: 2,
        pool: [
          'wifi app site update',
          'delete spatie typist',
          'digitaal apparaat step',
          'sleutel kwijt op de weg',
          'oplader stekker eruit',
          'de typles is de route waard'
        ]
      }
    ]
  },
  {
    id: 'route-06-onderste-rij',
    nummer: 6,
    titel: 'De onderste rij',
    uitleg: 'De onderste rij: n en m met je rechterwijsvinger, v en b met je linkerwijsvinger, de c met je linkermiddelvinger, de x met je linkerringvinger en de z met je linkerpink.',
    tip: 'Duik met je vinger naar beneden, tik de toets en veer meteen terug naar de thuisrij.',
    nieuweToetsen: ['n', 'm', 'v', 'c', 'b', 'x', 'z'],
    hoofdletters: false,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'jnj jnj jmj jmj',
          'fvf fvf fbf fbf',
          'dcd dcd sxs sxs',
          'aza zaz aza zaz',
          'nm nm mn mn nm',
          'vb vb cx cx vb'
        ]
      },
      {
        titel: 'Nieuwe woorden',
        type: 'woorden',
        kies: 4,
        pool: [
          'muis scherm bestand',
          'man van bank boom',
          'vis mand menu knop',
          'zoeken mailbox spam',
          'cloud online cookie',
          'computer chatten map',
          'virus cursor browser',
          'mobiel nummer webcam'
        ]
      },
      {
        titel: 'Bezorgronde',
        type: 'woorden',
        kies: 4,
        pool: [
          'bezorg bericht boek',
          'verzend ontvang klik',
          'nepnieuws chatbot',
          'zoekmachine printen',
          'muismat mens boodschap',
          'bestand map cloud open',
          'binnen buiten zebra',
          'centrum wolk exact'
        ]
      }
    ]
  },
  {
    id: 'route-07-hoofdletters',
    nummer: 7,
    titel: 'Hoofdletters',
    uitleg: 'Hoofdletters maak je met Shift. Druk Shift in met de pink van je andere hand en tik dan pas de letter.',
    tip: 'Typ je een letter met links, dan houd je rechts Shift ingedrukt met je pink. En andersom.',
    nieuweToetsen: [],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'Ff Jj Ff Jj Ff',
          'Dd Kk Dd Kk Dd',
          'Ss Ll Ss Ll Ss',
          'Aa Pp Aa Pp Aa',
          'Gg Hh Gg Hh Gg',
          'Ee Rr Uu Ii Oo'
        ]
      },
      {
        titel: 'Namen',
        type: 'woorden',
        kies: 4,
        pool: [
          'Anna Tom Lisa Sem',
          'Emma Daan Noor Bas',
          'Sara Finn Jules Roos',
          'Milan Fleur Teun Isa',
          'Lars Vera Stan Loes',
          'Tess Ruben Julia Max',
          'Noa Sven Floor Timo',
          'Pim Iris Jesse Mila'
        ]
      },
      {
        titel: 'Grote woorden',
        type: 'woorden',
        kies: 4,
        pool: [
          'Wachtwoord Bestand',
          'Computer Muis Scherm',
          'Online Cloud Wifi App',
          'Cursor Browser Virus',
          'Toetsenbord Spatie',
          'Mediawijs Chatbot Les',
          'Robot Spam Cookie Typ',
          'Digitaal Netwerk Map'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'woorden',
        kies: 2,
        pool: [
          'Anna typt een bericht',
          'Tom opent het bestand',
          'Lisa bezorgt de data',
          'Daan zoekt het adres',
          'Emma stuurt de mail',
          'Sem wint de toprit'
        ]
      }
    ]
  },
  {
    id: 'route-08-cijfers',
    nummer: 8,
    titel: 'Cijfers',
    uitleg: 'De cijfers staan helemaal bovenaan. Reik vanaf de thuisrij omhoog met de vinger die eronder ligt en veer terug.',
    tip: 'De 1 en 2 typ je met je linkerpink en ringvinger, de 9 en 0 met je rechterringvinger en pink.',
    nieuweToetsen: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          '444 777 444',
          '555 666 555',
          '111 222 333',
          '888 999 000',
          '4747 5858 4747',
          '1234 6789 1234'
        ]
      },
      {
        titel: 'Cijferritten',
        type: 'reeks',
        kies: 4,
        pool: [
          '375 12 908',
          '46 802 159',
          '2026 13 57',
          '90 481 267',
          '804 62 319',
          '17 350 926',
          '685 20 741',
          '539 06 128'
        ]
      },
      {
        titel: 'Cijfers en woorden',
        type: 'woorden',
        kies: 4,
        pool: [
          'wachtwoord met 12 tekens',
          'code 4589 voor de deur',
          'niveau 7 van het spel',
          'bewaar 25 bestanden',
          '10 vingers 1 toetsenbord',
          'typ 60 woorden per minuut',
          'les 3 duurt 45 minuten',
          'klas 2 heeft 30 leerlingen'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'woorden',
        kies: 2,
        pool: [
          'de wifi code heeft 8 tekens',
          'level 5 geeft 100 punten',
          'om 15 uur begint les 6',
          'pak 3 dozen en 6 pakketten',
          'typ 40 woorden in 2 minuten',
          'bewaar 20 films en 4 series'
        ]
      }
    ]
  },
  {
    id: 'route-09-leestekens',
    nummer: 9,
    titel: 'Leestekens',
    uitleg: 'De komma zit rechtsonder naast de m, en de punt daar weer naast. Het vraagteken, uitroepteken en apenstaartje maak je samen met Shift.',
    tip: 'De komma tik je met je rechtermiddelvinger, de punt met je rechterringvinger.',
    nieuweToetsen: ['.', ',', '?', '!', '@'],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'reeks',
        kies: 3,
        pool: [
          'l.l l.l k,k k,k',
          'k,k l.l k,k l.l',
          '.,. .,. ,., ,.,',
          'f! j! f? j? f!',
          's@ d@ s@ d@ s@',
          'k? l! k? l! k?'
        ]
      },
      {
        titel: 'Mailronde',
        type: 'woorden',
        kies: 3,
        pool: [
          'mail naar sem@school.nl',
          'stuur naar noor@school.nl',
          'daan@mail.nl en tess@mail.nl',
          'post voor anna@klas.nl',
          'tom@school.nl krijgt post',
          'bericht aan docent@klas.nl'
        ]
      },
      {
        titel: 'Vraag en uitroep',
        type: 'zinnen',
        kies: 3,
        pool: [
          'Typ jij nu al met tien vingers?',
          'Is jouw wachtwoord sterk genoeg?',
          'Let op, dit is een nepbericht!',
          'Kijk niet naar je handen, dat kan al!',
          'Wat staat er nu op jouw scherm?',
          'Goed bezig, jij haalt deze rit!'
        ]
      }
    ]
  },
  {
    id: 'route-10-digiwoorden',
    nummer: 10,
    titel: 'Digiwoorden',
    uitleg: 'Alle toetsen ken je nu. Tijd voor de woorden van het internet: van wachtwoord tot algoritme.',
    tip: 'Lange woorden? Houd rustig je ritme vast. Liever iets langzamer en foutloos.',
    nieuweToetsen: [],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'woorden',
        kies: 3,
        pool: [
          'wifi app spam robot',
          'muis map les data',
          'cloud virus cookie',
          'online scherm mail',
          'chatbot cursor typ',
          'spel knop menu site'
        ]
      },
      {
        titel: 'Digiwoorden',
        type: 'woorden',
        kies: 4,
        pool: [
          'wachtwoord account map',
          'browser bestand phishing',
          'privacy downloaden wifi',
          'inloggen document data',
          'nepnieuws algoritme app',
          'presentatie mediawijs',
          'chatten streamen gamen',
          'toetsenbord beeldscherm'
        ]
      },
      {
        titel: 'Lange ritten',
        type: 'woorden',
        kies: 4,
        pool: [
          'zoekmachine programma',
          'beveiliging uploaden',
          'videobellen internet',
          'computer netwerk opslag',
          'software updaten opslaan',
          'digitaal bericht delen',
          'tablet oplader printer',
          'website account cookie'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'woorden',
        kies: 2,
        pool: [
          'sterk wachtwoord kiezen',
          'bestand in de cloud zetten',
          'veilig online chatten',
          'spam en phishing herkennen',
          'nepnieuws goed checken',
          'privacy op je scherm'
        ]
      }
    ]
  },
  {
    id: 'route-11-korte-zinnen',
    nummer: 11,
    titel: 'Korte zinnen',
    uitleg: 'Nu typ je hele zinnen. Begin met een hoofdletter en sluit af met een punt, vraagteken of uitroepteken.',
    tip: 'Na elk woord komt precies één spatie met je duim. Houd je ogen op het scherm.',
    nieuweToetsen: [],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Opwarmen',
        type: 'zinnen',
        kies: 3,
        pool: [
          'Ik typ deze zin met tien vingers.',
          'De muis staat naast het toetsenbord.',
          'Mijn wachtwoord blijft altijd geheim.',
          'De koerier bezorgt het pakketje.',
          'Anna opent haar mail op school.',
          'Het bestand staat in de cloud.'
        ]
      },
      {
        titel: 'Digiritten',
        type: 'zinnen',
        kies: 3,
        pool: [
          'Klik nooit op een link in een vreemde mail.',
          'Een sterk wachtwoord heeft twaalf tekens.',
          'De docent zet de opdracht online voor de klas.',
          'Sem downloadt het bestand op de tablet.',
          'Denk goed na voor je een foto deelt.',
          'De robot in het spel volgt een algoritme.'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'zinnen',
        kies: 2,
        pool: [
          'Wie het snelst typt, bezorgt de meeste data.',
          'Kijk niet naar je handen en voel de toetsen.',
          'Tom stuurt om drie uur een bericht naar Emma.',
          'Zet je telefoon op stil als je huiswerk maakt.',
          'Een chatbot geeft niet altijd het goede antwoord.',
          'Na de typles speel je de toprit van dit spel.'
        ]
      }
    ]
  },
  {
    id: 'route-12-langere-zinnen',
    nummer: 12,
    titel: 'Langere zinnen',
    uitleg: 'Langere zinnen vragen om een vast ritme. Adem rustig, typ door en laat een foutje je niet stoppen.',
    tip: 'Maak je een fout? Herstel hem rustig en pak daarna je ritme weer op.',
    nieuweToetsen: [],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Warmdraaien',
        type: 'zinnen',
        kies: 2,
        pool: [
          'Zet je voeten plat op de grond en houd je rug lekker recht.',
          'Leg je vingers op de thuisrij en voel de rand op de f en j.',
          'Met een vast ritme maak je minder fouten en typ je sneller.',
          'Kijk naar het scherm, je vingers vinden de weg zelf wel.',
          'Na elke zin haal je even adem en ga je rustig verder.',
          'Oefen elke dag tien minuten en je ziet snel verschil.'
        ]
      },
      {
        titel: 'Digibezorging',
        type: 'zinnen',
        kies: 2,
        pool: [
          'De koerier brengt het datapakket veilig naar de server.',
          'Deel je wachtwoord nooit, ook niet met je beste vriend.',
          'Een update maakt je tablet veiliger en vaak ook sneller.',
          'Op internet is niet alles waar, check daarom de bron.',
          'Met tweestapsverificatie is je account extra goed beveiligd.',
          'Sla je document elke vijf minuten op, dan raak je niks kwijt.'
        ]
      },
      {
        titel: 'Expresrit',
        type: 'zinnen',
        kies: 2,
        pool: [
          'Wie rustig en foutloos typt, wint deze rit met gemak.',
          'Anna typt haar verslag en checkt daarna de spelling.',
          'De snelste route is niet altijd de beste, foutloos telt ook.',
          'Stuur het bestand naar je docent voordat de les begint.',
          'Een goede koerier let op de weg en jij let op het scherm.',
          'Hoe vaker je oefent, hoe sneller je vingers de weg vinden.'
        ]
      }
    ]
  },
  {
    id: 'route-13-meesterproef',
    nummer: 13,
    titel: 'Meesterproef',
    uitleg: 'De laatste route: alles door elkaar. Woorden, hoofdletters, cijfers en leestekens. Laat zien wat je kunt!',
    tip: 'Snelheid komt vanzelf. Foutloos typen is nu je missie.',
    nieuweToetsen: [],
    hoofdletters: true,
    blokken: [
      {
        titel: 'Warmrijden',
        type: 'woorden',
        kies: 3,
        pool: [
          'thuisrij ritme duim',
          'foutloos tempo focus',
          'blind typen lukt al',
          'datapakket bezorgd',
          'expresrit route klaar',
          'toets scherm vinger'
        ]
      },
      {
        titel: 'Cijfers en tekens',
        type: 'woorden',
        kies: 3,
        pool: [
          'code 7391 opent de kluis!',
          'mail naar docent@klas.nl om 9 uur',
          'level 12 haal je met 0 fouten',
          'typ 55 woorden, dat kan jij!',
          'om 14 uur begint rit 13',
          'pak pakket 8, 9 en 10 mee'
        ]
      },
      {
        titel: 'Meesterzinnen',
        type: 'zinnen',
        kies: 3,
        pool: [
          'Emma bezorgt 12 pakketten en maakt 0 fouten!',
          'Typ jij deze zin foutloos met tien vingers?',
          'De meester van route 13 kent alle toetsen blind.',
          'Stuur je score naar tom@school.nl en win de rit!',
          'Na 13 routes ben jij een echte datakoerier.',
          'Wat een rit, je hebt alle 13 routes gehaald!'
        ]
      }
    ]
  }
];

export const TOPRIT = {
  id: 'toprit-expres',
  titel: 'Toprit: Expresbezorging',
  uitleg: 'Bezorg alle 25 pakketjes zo vlot als je kunt. De tijdsbonus krijg je alleen als je ook nauwkeurig blijft typen.',
  tip: 'Ga niet jagen op snelheid. Een foutloos woord levert meer op dan drie slordige.',
  kiesWoorden: 25,
  woordenPool: [
    'wachtwoord',
    'bestand',
    'browser',
    'virus',
    'phishing',
    'privacy',
    'online',
    'scherm',
    'muis',
    'cursor',
    'downloaden',
    'wifi',
    'cloud',
    'chatten',
    'nepnieuws',
    'algoritme',
    'robot',
    'chatbot',
    'spam',
    'cookie',
    'account',
    'inloggen',
    'document',
    'presentatie',
    'mediawijs',
    'digitaal',
    'netwerk',
    'toetsenbord',
    'beeldscherm',
    'programma',
    'website',
    'zoekmachine',
    'tablet',
    'software',
    'updaten',
    'opslaan',
    'delen',
    'streamen',
    'gamen',
    'printer',
    'computer',
    'internet',
    'mail',
    'reservekopie',
    'uploaden',
    'videobellen',
    'beveiliging',
    'koerier',
    'pakket',
    'route',
    'data',
    'server',
    'bericht',
    'map',
    'apparaat',
    'oplader',
    'spatie',
    'thuisrij',
    'foutloos',
    'bezorgen',
    'sneltoets',
    'webcam',
    'mobiel',
    'emoji',
    'klembord',
    'zoekterm'
  ]
};
