// Verrijkingslaag hoofdstuk 5 - AI, Code en Portfolio.
//
// Per paragraafcode:
//   learningGoals: 2 of 3 korte zinnen die beginnen met “Je weet ...” of “Je kunt ...”.
//   theorie: array met exact twee items, in dezelfde volgorde als de twee
//            theorieblokken van die paragraaf in de generator.
//     keyTerms:    2 tot 4 woorden die LETTERLIJK als los woord in die
//                  theorietekst staan; de leesopmaak zet ze vet.
//     exampleHtml: een uitgewerkt voorbeeld als vraag + antwoord. Het paneel
//                  zet zelf al het label “Voorbeeld” erboven.

export default {
  // 5.1 Wat is AI en hoe gebruik je een chatbot verstandig?
  '5.1': {
    learningGoals: [
      'Je weet dat AI antwoorden maakt met patronen en dus fouten kan maken.',
      'Je kunt een prompt schrijven met doel, doelgroep, lengte en vorm.',
      'Je weet welke gegevens je nooit aan een chatbot geeft.'
    ],
    theorie: [
      {
        // theorieblok 1: AI voorspelt, niet denkt
        keyTerms: ['AI', 'patronen', 'chatbot', 'verantwoordelijk'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sem vraagt een chatbot wanneer de Tweede Wereldoorlog eindigde. Hij krijgt het jaartal 1946 terug en zet dat in zijn werkstuk. Wat ging er mis?</p>',
          '<p><strong>Antwoord.</strong> Het antwoord klonk zeker, maar het klopt niet. AI kiest woorden die vaak samen voorkomen; dat is geen garantie. Sem had het jaartal even in zijn boek of op een schoolsite moeten nakijken, want hij blijft zelf verantwoordelijk voor wat hij inlevert.</p>'
        ].join('\n')
      },
      {
        // theorieblok 2: Goede prompt, veilige prompt
        keyTerms: ['prompt', 'AI', 'privégegevens', 'vervanger'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa typt: “Schrijf mijn spreekbeurt. Ik ben Lisa de Wit, klas 1B, ik woon in de Kerkstraat 12.” Wat zijn de twee problemen?</p>',
          '<p><strong>Antwoord.</strong> Ze geeft haar adres weg, en dat hoort niet in een prompt. En ze laat AI het werk doen in plaats van zichzelf. Beter: “Geef vijf ideeën voor een spreekbeurt van drie minuten over honden, voor klas 1 vmbo.”</p>'
        ].join('\n')
      }
    ]
  },

  // 5.2 AI-beelden, deepfakes en beroepen
  '5.2': {
    learningGoals: [
      'Je weet dat AI beelden kan maken van dingen die nooit gebeurd zijn.',
      'Je kunt bewijs zoeken voordat je een foto of video deelt.',
      'Je weet welke menselijke vaardigheden nodig blijven als AI werk overneemt.'
    ],
    theorie: [
      {
        // theorieblok 1: Echt, nep of twijfel
        keyTerms: ['beelden', 'fouten', 'twijfel', 'bewijs'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een groepsapp staat een foto van een bekende voetballer op het schoolplein. De hand op de foto heeft zes vingers. Deel je hem door?</p>',
          '<p><strong>Antwoord.</strong> Nee. De rare hand is een aanwijzing dat het beeld door AI is gemaakt. Zoek eerst of een nieuwssite of de club zelf het bericht heeft. Vind je niets, dan blijft het twijfel en deel je het niet.</p>'
        ].join('\n')
      },
      {
        // theorieblok 2: AI verandert werk
        keyTerms: ['controle', 'creativiteit', 'verantwoordelijkheid', 'beroepen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een kapper laat AI de afspraken inplannen en de foto\'s voor Instagram bewerken. Verdwijnt haar beroep nu?</p>',
          '<p><strong>Antwoord.</strong> Nee, haar werk verandert. Het knippen, het advies en het contact met de klant blijft mensenwerk. AI neemt de saaie taken over, maar de controle en de keuzes blijven bij haar.</p>'
        ].join('\n')
      }
    ]
  },

  // 5.3 Algoritmes zonder computer
  '5.3': {
    learningGoals: [
      'Je weet dat een computer precies doet wat er staat, niet wat jij bedoelt.',
      'Je kunt een stappenplan schrijven dat een ander letterlijk kan uitvoeren.',
      'Je kunt een vage of vergeten stap opsporen en verbeteren.'
    ],
    theorie: [
      {
        // theorieblok 1: Algoritme als stappenplan
        keyTerms: ['algoritme', 'stappen', 'computer', 'precies'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een algoritme voor het maken van thee begint met: “Zet water op.” Waarom is dat geen goede stap?</p>',
          '<p><strong>Antwoord.</strong> Het kan op tien manieren gelezen worden: hoeveel water, waarin, hoe warm? Beter: “Vul de waterkoker tot de streep van 1 liter” en dan “Druk de knop van de waterkoker in.” Nu doet iedereen hetzelfde.</p>'
        ].join('\n')
      },
      {
        // theorieblok 2: Testen en debuggen
        keyTerms: ['stappenplan', 'debuggen', 'testen', 'fouten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara maakt een stappenplan om een bestand op te slaan, maar haar klasgenoot loopt vast bij stap 3. Wat doet Yara nu?</p>',
          '<p><strong>Antwoord.</strong> Ze verbetert alleen stap 3 en laat het daarna opnieuw uitproberen. Dat heet debuggen: een fout zoeken, een ding aanpassen en weer testen. Zou ze alles tegelijk veranderen, dan weet ze niet wat het probleem oploste.</p>'
        ].join('\n')
      }
    ]
  },

  // 5.4 Programmeren met blokken en debuggen
  '5.4': {
    learningGoals: [
      'Je weet wat een start-event en een voorwaarde doen in een programma.',
      'Je kunt een klein programma bouwen dat de gebruiker feedback geeft.',
      'Je kunt een fout in je eigen programma opsporen en oplossen.'
    ],
    theorie: [
      {
        // theorieblok 1: Blokken bouwen gedrag
        keyTerms: ['blokkenprogrammeren', 'start-event', 'voorwaarden', 'feedback'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je maakt een quiz. Als de speler het goede antwoord kiest, moet er “Goed zo!” verschijnen. Welke twee onderdelen heb je minstens nodig?</p>',
          '<p><strong>Antwoord.</strong> Een start-event, bijvoorbeeld “wanneer op de groene vlag geklikt”, zodat de quiz begint. En een voorwaarde: “als antwoord = B, zeg Goed zo!” Zonder die voorwaarde krijgt de speler bij elk antwoord dezelfde reactie.</p>'
        ].join('\n')
      },
      {
        // theorieblok 2: Fouten horen erbij
        keyTerms: ['debuggen', 'fout', 'klasgenoot', 'test'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Bij Milan telt de score bij elk antwoord op, ook bij een fout antwoord. Hij ziet zelf niet waar het misgaat. Wat is de slimste stap?</p>',
          '<p><strong>Antwoord.</strong> Laat een klasgenoot het spelen. Die kiest expres een fout antwoord en ziet meteen dat het “score +1”-blok buiten de als-voorwaarde staat. Milan sleept het blok naar binnen en test opnieuw.</p>'
        ].join('\n')
      }
    ]
  },

  // 5.5 Portfolio bouwen, digitale samenleving en herstel
  '5.5': {
    learningGoals: [
      'Je weet welke bewijsstukken in je portfolio horen.',
      'Je kunt bij elk bewijsstuk kort opschrijven wat je geleerd hebt.',
      'Je kunt een herstelplan maken voor werk dat nog niet af is.'
    ],
    theorie: [
      {
        // theorieblok 1: Portfolio als bewijsmap
        keyTerms: ['portfolio', 'bewijsstuk', 'privacy', 'broncheck'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jill zet haar PowerPoint in haar portfolio en schrijft eronder: “Dit is mijn PowerPoint.” Is dat genoeg?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat ziet de docent zelf ook al. Bij elk bewijsstuk hoort wat je leerde. Beter: “Ik heb geleerd hoe ik met een vaste dia-indeling werk en waarom ik niet te veel tekst op een dia zet.”</p>'
        ].join('\n')
      },
      {
        // theorieblok 2: Herstellen mag
        keyTerms: ['herstelplan', 'taak', 'certificaat'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi mist zijn Excel-dashboard omdat hij twee weken ziek was. Hij denkt dat hij het certificaat niet meer kan halen. Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Nee. Hij maakt een herstelplan: welke taak ontbreekt (het dashboard), wat hij doet (les 4.5 opnieuw doorlopen en de grafiek maken) en wanneer het af is (vrijdag). Daarmee kan hij gewoon doorwerken.</p>'
        ].join('\n')
      }
    ]
  },

  // 5.6 Eindexpo: mijn digitale vaardigheden certificaat
  '5.6': {
    learningGoals: [
      'Je weet welke vier soorten bewijs je bij de eindexpo laat zien.',
      'Je kunt uitleggen wat je maakte, wat je leerde en wat je nu beter kunt.',
      'Je weet dat digitale vaardigheid ook over veilig en kritisch gedrag gaat.'
    ],
    theorie: [
      {
        // theorieblok 1: Laten zien wat je kunt
        keyTerms: ['eindexpo', 'bewijsstukken', 'bewijs'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima wil al haar zeven opdrachten laten zien in vijf minuten. Waarom is dat geen goed plan?</p>',
          '<p><strong>Antwoord.</strong> Dan wordt alles kort en oppervlakkig. Ze kiest vier bewijsstukken, een uit elk gebied, en vertelt per stuk wat ze maakte en wat ze leerde. Weinig bewijs dat je goed uitlegt is sterker dan veel bewijs dat je afraffelt.</p>'
        ].join('\n')
      },
      {
        // theorieblok 2: Digitale vaardigheid is gedrag
        keyTerms: ['kritisch', 'zelfstandig', 'bronnen', 'bewust'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Twee leerlingen kunnen even goed met Word omgaan. De een controleert bronnen en vraagt hulp als hij vastloopt, de ander niet. Wie is digitaal vaardiger?</p>',
          '<p><strong>Antwoord.</strong> De eerste. Digitale vaardigheid zit niet alleen in de knoppen, maar ook in kritisch kijken naar wat je leest en zelfstandig verder komen. Hulp vragen hoort daar gewoon bij.</p>'
        ].join('\n')
      }
    ]
  }
};
