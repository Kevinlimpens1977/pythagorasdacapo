// Verrijkingslaag hoofdstuk 3 - Veilig en Mediawijs.
//
// Per paragraafcode:
//   learningGoals: 2 of 3 korte zinnen die beginnen met "Je weet ..." of "Je kunt ...".
//                  Ze beschrijven wat de leerling na afloop KAN of WEET, nooit de stappen.
//   theorie: array met exact twee items, in dezelfde volgorde als de twee
//            theorieblokken van die paragraaf in de generator.
//     keyTerms:    2 tot 4 woorden die LETTERLIJK als los woord in die
//                  theorietekst staan; de leesopmaak zet ze vet. Een woord dat
//                  alleen als deel van een langer woord voorkomt telt niet.
//     exampleHtml: een uitgewerkt voorbeeld als vraag + antwoord, twee tot vier
//                  zinnen. Het paneel zet zelf al het label "Voorbeeld" erboven.
//   samenvatting: de laatste leestekst voor de quiz of toets.
//     html:     2 of 3 zinnen die de begrippen van díé paragraaf herhalen, elk
//               begrip letterlijk genoemd. Taalniveau B1, brugklas. Geen zin die
//               net zo goed in een andere paragraaf zou kunnen staan.
//     keyTerms: verplicht zodra html gevuld is; elk woord staat letterlijk in
//               die samenvatting. Een kernbegrip mag in de hele seed in
//               maximaal twee blokken staan (validator bewaakt dat), dus een
//               begrip dat hier vet komt te staan is daarmee "vol".

export default {
  // 3.1 Privacy en digitale voetafdruk
  '3.1': {
    learningGoals: [
      'Je weet welke gegevens over jou persoonsgegevens zijn.',
      'Je kunt uitleggen wat een digitale voetafdruk is.',
      'Je kunt per situatie kiezen wat je wel en niet online zet.'
    ],
    theorie: [
      // theorieblok 1: Wat zijn persoonsgegevens?
      {
        keyTerms: ['gegevens', 'foto', 'locatie', 'leerlingnummer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jelle zet in een openbare groepschat dat hij dit weekend alleen thuis is, met zijn adres erbij. Is dat verstandig?</p>',
          '<p><strong>Antwoord.</strong> Nee. Zijn adres zegt precies waar hij woont, en samen met alleen thuis maakt dat hem kwetsbaar. Gebruik de schoolbordvraag: dit zou hij nooit op het schoolbord hangen, dus online ook niet.</p>'
        ].join('\n')
      },
      // theorieblok 2: Sporen die blijven staan
      {
        keyTerms: ['zoekgedrag', 'digitale voetafdruk', 'screenshot', 'privacy'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sanne plaatst een foto, vindt hem toch lelijk en haalt hem na tien minuten weg. Is die foto nu echt verdwenen?</p>',
          '<p><strong>Antwoord.</strong> Dat weet je niet zeker. In die tien minuten kan iemand een screenshot hebben gemaakt en die staat dan bij hem op zijn toestel. Wat je post hoort bij je digitale voetafdruk, ook als jij het zelf weghaalt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Persoonsgegevens zijn alle gegevens waaraan iemand jou kan herkennen: je naam, je foto, je adres, je locatie en je leerlingnummer. Wat je post, likt en opzoekt hoort bij je digitale voetafdruk, dus ook je zoekgedrag laat sporen na; wat jij weghaalt, kan bij iemand anders gewoon blijven staan. Twijfel je of iets online mag, stel jezelf dan de schoolbordvraag: wat je niet op het schoolbord wilt hangen, zet je ook niet in een groepschat.</p>',
      keyTerms: ['persoonsgegevens', 'zoekgedrag', 'digitale voetafdruk']
    }
  },

  // 3.2 Social media, algoritmes en identiteit
  '3.2': {
    learningGoals: [
      'Je weet hoe een algoritme bepaalt wat jij te zien krijgt.',
      'Je kunt uitleggen waarom jouw feed anders is dan die van een klasgenoot.',
      'Je weet dat social media meestal een selectie laat zien.'
    ],
    theorie: [
      // theorieblok 1: Waarom jouw feed anders is
      {
        keyTerms: ['algoritme', 'kijktijd', 'feed', 'liken'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan kijkt drie skatefilmpjes helemaal uit. De volgende dag staat zijn feed vol met skaten. Hoe kan dat?</p>',
          '<p><strong>Antwoord.</strong> Het algoritme meet dat zijn kijktijd hoog is en concludeert: dit vindt hij leuk. Daarom krijgt hij meer van hetzelfde. Wil hij iets anders zien, dan moet hij ook andere filmpjes openen en uitkijken.</p>'
        ].join('\n')
      },
      // theorieblok 2: Online identiteit en druk
      {
        keyTerms: ['selectie', 'filters', 'FOMO', 'zelfbeeld'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ayla ziet een foto van een feestje waar half haar klas was en zij niet. Ze voelt zich er rot door. Hoe heet dat gevoel?</p>',
          '<p><strong>Antwoord.</strong> Dat heet FOMO: de angst dat je iets mist. Op zo’n foto staat een selectie van de leukste seconden van de avond. Hoe de anderen zich die avond echt voelden, zie je er niet aan af.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een algoritme vult jouw feed met wat je aanklikt, wat je liket en vooral hoe lang je blijft hangen: veel kijktijd levert meer van hetzelfde op. Daarom staat er bij jou iets anders op het scherm dan bij je klasgenoot, ook al zitten jullie in dezelfde klas. Wat je ziet is bovendien een selectie van de leukste momenten, met filters erover, en dat kan aan je zelfbeeld gaan trekken.</p>',
      keyTerms: ['feed', 'kijktijd', 'selectie', 'zelfbeeld']
    }
  },

  // 3.3 Nepnieuws en betrouwbare bronnen
  '3.3': {
    learningGoals: [
      'Je weet waaraan je nepnieuws en clickbait herkent.',
      'Je kunt een bericht controleren met de vijf broncheckvragen.',
      'Je weet dat beeld en geluid ook nep kunnen zijn.'
    ],
    theorie: [
      // theorieblok 1: Nepnieuws lijkt vaak echt
      {
        keyTerms: ['nepnieuws', 'koppen', 'clickbait', 'geloofwaardig'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je ziet de kop: deze school gaat morgen dicht! Je schrikt en wilt het meteen doorsturen. Wat doe je eerst?</p>',
          '<p><strong>Antwoord.</strong> Even niets. Zulke heftige koppen zijn juist gemaakt om je te laten schrikken en klikken; dat heet clickbait. Kijk eerst of een betrouwbare bron, zoals de site van de school zelf, hetzelfde meldt.</p>'
        ].join('\n')
      },
      // theorieblok 2: De 5 broncheckvragen
      {
        keyTerms: ['deepfake', 'bron', 'context'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een filmpje zegt een bekende voetballer iets heel raars. Het beeld ziet er echt uit. Is dat filmpje daarmee bewijs?</p>',
          '<p><strong>Antwoord.</strong> Nee. Met AI kan iemand een deepfake maken waarin gezicht en stem worden nagemaakt. Vraag je af wie het maakte, wanneer, en of een tweede betrouwbare bron hetzelfde zegt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Nepnieuws lijkt geloofwaardig door heftige koppen, veel emotie en een nette opmaak; clickbait is gemaakt om je te laten klikken, niet om je iets te laten begrijpen. Voor je iets doorstuurt loop je de vijf broncheckvragen langs: wie maakte dit, wanneer, met welk doel, waar is het bewijs en meldt een tweede betrouwbare bron hetzelfde? Beeld en geluid tellen daarbij niet als bewijs, want met een deepfake laat AI iemand dingen zeggen die hij nooit heeft gezegd.</p>',
      keyTerms: ['nepnieuws', 'geloofwaardig', 'clickbait', 'deepfake']
    }
  },

  // 3.4 Cyberpesten, grenzen en hulp zoeken
  '3.4': {
    learningGoals: [
      'Je weet waarom online pesten anders werkt dan pesten op het schoolplein.',
      'Je kunt de stappen van de hulproute noemen en uitvoeren.',
      'Je weet wanneer je toestemming nodig hebt om beeld te delen.'
    ],
    theorie: [
      // theorieblok 1: Wat cyberpesten anders maakt
      {
        keyTerms: ['pesten', 'anoniem', 'buitensluiten', 'kwetsend'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In de klassengroep maakt iemand elke dag een grap over de schoenen van Youssef. Hij lacht mee, maar baalt ervan. Is dit pesten?</p>',
          '<p><strong>Antwoord.</strong> Dat kan het zeker zijn. Niet de bedoeling van de zender telt, maar hoe het bij de ander binnenkomt. Is het kwetsend en gaat het dag na dag door, dan moet het stoppen.</p>'
        ].join('\n')
      },
      // theorieblok 2: Hulproute in vijf stappen
      {
        keyTerms: ['blokkeer', 'toestemming', 'mentor'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iemand stuurt jou een bewerkte foto van een klasgenoot en vraagt of je hem doorstuurt. Wat doe je?</p>',
          '<p><strong>Antwoord.</strong> Niet doorsturen, want daarvoor is toestemming nodig van degene op de foto. Bewaar een screenshot als bewijs, blokkeer de afzender als het doorgaat en vertel het aan je mentor.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Cyberpesten gaat door na schooltijd, verspreidt zich in seconden en voelt voor de zender anoniem; ook iemand buitensluiten uit de klassengroep hoort erbij. Niet wat de zender als grap bedoelde telt, maar hoe kwetsend het bij de ander binnenkomt. Scheld daarom niet terug maar volg de hulproute: bewaar het bericht, blokkeer, meld het op het platform en vertel het aan je mentor; beeld van iemand anders deel je alleen met toestemming.</p>',
      keyTerms: ['cyberpesten', 'kwetsend', 'hulproute', 'toestemming']
    }
  },

  // 3.5 Online shoppen en betalen
  '3.5': {
    learningGoals: [
      'Je kunt controleren of een webshop betrouwbaar lijkt.',
      'Je weet dat een bekende betaalmethode geen bewijs van betrouwbaarheid is.',
      'Je weet welke kosten achteraf betalen en kopen buiten de EU kunnen geven.'
    ],
    theorie: [
      // theorieblok 1: Is deze webshop te vertrouwen?
      {
        keyTerms: ['URL', 'contactgegevens', 'reviews', 'retourregels'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een site verkoopt schoenen van 150 euro voor 29 euro. De site ziet er strak uit, maar er staat geen adres of telefoonnummer bij. Bestel je hier?</p>',
          '<p><strong>Antwoord.</strong> Nee. De extreem lage prijs en het ontbreken van contactgegevens zijn twee sterke waarschuwingen tegelijk. Zoek eerst reviews buiten de site zelf en bekijk de retourregels.</p>'
        ].join('\n')
      },
      // theorieblok 2: Betaalmethoden en risico's
      {
        keyTerms: ['iDEAL', 'Klarna', 'levertijd', 'invoerkosten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een onbekende webshop biedt iDEAL aan. Betekent dat de winkel te vertrouwen is?</p>',
          '<p><strong>Antwoord.</strong> Nee. iDEAL zegt alleen dat je op die manier kunt afrekenen; ook een oplichter kan het aanbieden. Je blijft dus de URL, de reviews en de retourregels controleren voordat je betaalt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Voor je bestelt controleer je de URL, de contactgegevens, reviews buiten de winkel zelf en de retourregels; een strak vormgegeven site zegt nog niets over betrouwbaarheid. Dat een webshop iDEAL aanbiedt, betekent alleen dat je kunt afrekenen, niet dat de winkel deugt. Achteraf betalen met Klarna kost extra geld zodra je te laat bent, en bestel je buiten de EU, dan kunnen de levertijd en de invoerkosten flink tegenvallen.</p>',
      keyTerms: ['contactgegevens', 'retourregels', 'iDEAL', 'invoerkosten']
    }
  },

  // 3.6 Checkpoint: mediawijs handelen
  '3.6': {
    learningGoals: [
      'Je weet waarom je bij twijfel eerst stopt voordat je klikt of doorstuurt.',
      'Je weet welke veilige actie je kiest bij nepnieuws, cyberpesten of een verdachte webshop.',
      'Je weet wanneer je een situatie zelf oplost en wanneer je hulp vraagt aan een volwassene.'
    ],
    theorie: [
      // theorieblok 1: Eerst denken, dan klikken
      {
        keyTerms: ['risico', 'veilige actie', 'mediawijs', 'cyberpesten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je krijgt een appje: klik binnen tien minuten en win een telefoon. Welke drie stappen zet je?</p>',
          '<p><strong>Antwoord.</strong> Stop met klikken, check het risico (haast plus een gratis prijs wijst op oplichting) en kies een veilige actie: niet klikken en het bericht melden. Kun je het niet inschatten, dan vraag je hulp.</p>'
        ].join('\n')
      },
      // theorieblok 2: Casus oplossen
      {
        // Bewust maar één kernbegrip: in deze theorietekst staat verder geen
        // vakbegrip. "misgaan" en "nadenkt" zijn gewone werkwoorden; die vet
        // zetten leert een leerling niets.
        keyTerms: ['casus'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een klasgenoot deelt een screenshot uit jullie groepschat in een andere groep. Hoe schrijf je deze casus op?</p>',
          '<p><strong>Antwoord.</strong> In vier korte zinnen. Wat gebeurt er: een privébericht gaat rond zonder toestemming. Wat kan misgaan: het is kwetsend en verspreidt verder. Wat doe ik: er iets van zeggen en bewijs bewaren, want zo laat je zien dat je nadenkt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Bij privacy, je feed, nepnieuws, cyberpesten en online kopen werkt steeds dezelfde aanpak: eerst stoppen, dan het risico inschatten en pas daarna een veilige actie kiezen. Mediawijs zijn betekent dat je die keuze ook aan iemand anders kunt uitleggen. Bij elke casus schrijf je kort op wat er gebeurt, wat er mis kan gaan, wat jij doet en waarom; kun je het risico niet inschatten, dan vraag je hulp aan een volwassene.</p>',
      keyTerms: ['mediawijs', 'veilige actie', 'casus']
    }
  }
};
