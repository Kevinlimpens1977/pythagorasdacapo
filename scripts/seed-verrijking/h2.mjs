// Verrijkingslaag hoofdstuk 2 - Werken met Microsoft.
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

export default {
  // 2.1 Word: een net schooldocument
  '2.1': {
    learningGoals: [
      'Je weet waaraan een net schooldocument te herkennen is.',
      'Je kunt met een duidelijke titel en genoeg witruimte rustig opmaken.',
      'Je kunt een afbeelding invoegen met een korte bronregel erbij.'
    ],
    theorie: [
      // theorieblok 1: Rustige opmaak
      {
        keyTerms: ['Word-document', 'titel', 'witruimte', 'opmaak'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Jelle levert een document in met drie kleuren, vier lettertypen en alles vet. Hij zegt: het valt lekker op. Is dit een net Word-document?</p>',
          '<p><strong>Antwoord.</strong> Nee. Door al die opmaak ziet de lezer niet meer wat belangrijk is. Een duidelijke titel, gewone tekst en genoeg witruimte werken beter.</p>'
        ].join('\n')
      },
      // theorieblok 2: Basisfuncties
      {
        keyTerms: ['Word', 'document', 'afbeelding', 'bronregel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Fatima schrijft over voetbal en plakt er een foto van een kat bij, zonder te vertellen waar die vandaan komt. Wat gaat er mis?</p>',
          '<p><strong>Antwoord.</strong> Twee dingen. De afbeelding past niet bij haar tekst, en er staat geen bronregel bij. Kies een foto over voetbal en zet eronder waar je hem gevonden hebt.</p>'
        ].join('\n')
      }
    ]
  },

  // 2.2 Word-verslag met koppen en bronnen
  '2.2': {
    learningGoals: [
      'Je weet waarom koppen een verslag overzichtelijk maken.',
      'Je kunt een tekst in je eigen woorden opschrijven.',
      'Je weet wat plagiaat is en hoe je een bron netjes noemt.'
    ],
    theorie: [
      // theorieblok 1: Koppen geven structuur
      {
        keyTerms: ['koppen', 'stijlen', 'Kop', 'verslag'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Milan levert een verslag in van twee volle bladzijden zonder een enkele kop. Wat merkt de lezer daarvan?</p>',
          '<p><strong>Antwoord.</strong> De lezer ziet niet waar een nieuw onderdeel begint en raakt de draad kwijt. Met stijlen als Kop 1 boven het onderwerp en Kop 2 boven de delen is het meteen te volgen.</p>'
        ].join('\n')
      },
      // theorieblok 2: Eigen woorden en bronnen
      {
        keyTerms: ['plagiaat', 'bron', 'website'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sara zet een hele alinea van een website in haar verslag en verandert alleen het eerste woord. Mag dat?</p>',
          '<p><strong>Antwoord.</strong> Nee, dat is plagiaat. Lees de tekst, sluit hem en schrijf in je eigen woorden op wat je onthouden hebt. Zet er daarna de bron bij, met de naam van de site en de datum.</p>'
        ].join('\n')
      }
    ]
  },

  // 2.3 PowerPoint: duidelijk presenteren
  '2.3': {
    learningGoals: [
      'Je weet waarom er weinig tekst op een dia hoort.',
      'Je kunt een dia maken die achter in het lokaal leesbaar is.',
      'Je kunt beeld en kleur kiezen die je verhaal helpen.'
    ],
    theorie: [
      // theorieblok 1: Een dia is geen werkstuk
      {
        keyTerms: ['PowerPoint-dia', 'tekst', 'boodschap', 'dia'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Op de dia van Bo staan zeven zinnen in kleine letters. Ze leest ze allemaal voor. Wat kan beter?</p>',
          '<p><strong>Antwoord.</strong> Zet er maximaal drie korte regels op in grote letters, met een boodschap per dia. De rest vertelt Bo zelf, dan luistert de klas naar haar in plaats van mee te lezen.</p>'
        ].join('\n')
      },
      // theorieblok 2: Beeld helpt je verhaal
      {
        keyTerms: ['afbeelding', 'kleuren', 'contrast', 'presentatie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yusuf zet gele letters op een witte achtergrond. Van dichtbij leest hij het prima. Waarom klaagt de klas toch?</p>',
          '<p><strong>Antwoord.</strong> Er is te weinig contrast tussen de letters en de achtergrond. Donkere letters op een rustige lichte achtergrond kan iedereen lezen, ook achter in het lokaal.</p>'
        ].join('\n')
      }
    ]
  },

  // 2.4 PowerPoint: uitleg in 5 dia's
  '2.4': {
    learningGoals: [
      'Je weet hoe een korte presentatie is opgebouwd.',
      'Je kunt kernwoorden op je dia zetten en de uitleg zelf vertellen.',
      'Je weet waarom je een bron ook in een presentatie noemt.'
    ],
    theorie: [
      // theorieblok 1: Begin, midden en einde
      {
        keyTerms: ['opbouw', 'onderwerp', 'samenvatting', 'luisteraar'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Lisa begint haar presentatie met een dia vol tips en zegt daarna pas waar het over gaat. Wat is er mis met die volgorde?</p>',
          '<p><strong>Antwoord.</strong> De luisteraar weet nog niet waar de tips bij horen. Begin met je onderwerp, leg dan drie punten uit en sluit af met een tip of samenvatting.</p>'
        ].join('\n')
      },
      // theorieblok 2: Kort presenteren
      {
        keyTerms: ['kernwoorden', 'hardop', 'tempo', 'bron'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Dani heeft zijn hele tekst op de dia gezet en leest hem in dertig seconden voor. Waarom werkt dat niet?</p>',
          '<p><strong>Antwoord.</strong> Zijn tempo is te hoog en niemand luistert nog, want de klas leest mee. Beter: alleen kernwoorden op de dia, de rest in eigen woorden, en van tevoren hardop geoefend.</p>'
        ].join('\n')
      }
    ]
  },

  // 2.5 Samenwerken via OneDrive en Outlook
  '2.5': {
    learningGoals: [
      'Je weet het verschil tussen kijkrechten en bewerkrechten.',
      'Je kunt een bestand delen met de rechten die erbij passen.',
      'Je kunt een nette mail schrijven met een werkende link erin.'
    ],
    theorie: [
      // theorieblok 1: Delen met rechten
      {
        keyTerms: ['OneDrive', 'bestand', 'delen', 'Bewerkrechten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Amber deelt haar werkstuk met de hele klas en zet het op bewerken. De volgende dag staat er onzin in. Wat had ze anders moeten doen?</p>',
          '<p><strong>Antwoord.</strong> Alleen haar duopartner had het bestand hoeven bewerken. De rest had genoeg aan kijken. Bij twijfel kies je de veiligste optie.</p>'
        ].join('\n')
      },
      // theorieblok 2: Nette mail met link
      {
        keyTerms: ['onderwerp', 'aanhef', 'link', 'rechten'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi mailt zijn docent alleen de tekst hier is die dan. Wat ontbreekt er in deze mail?</p>',
          '<p><strong>Antwoord.</strong> Een onderwerp, een aanhef, een zin die uitlegt waar het over gaat en een afsluiting met zijn naam. En hij moet zelf de link openen om te zien of de rechten kloppen.</p>'
        ].join('\n')
      }
    ]
  },

  // 2.6 Checkpoint: Microsoft tools
  '2.6': {
    learningGoals: [
      'Je weet welk Microsoft-programma bij welke taak hoort.',
      'Je kunt een document, presentatie, gedeelde link en mail maken.',
      'Je kunt kort opschrijven wat zelfstandig lukte en waar je hulp nodig had.'
    ],
    theorie: [
      // theorieblok 1: Microsoft als gereedschapskist
      {
        keyTerms: ['Word', 'PowerPoint', 'OneDrive', 'Outlook'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je moet de klas in drie minuten uitleggen hoe je veilig een wachtwoord kiest. Welk programma pak je, en welk juist niet?</p>',
          '<p><strong>Antwoord.</strong> PowerPoint, want je legt iets uit aan een groep. Word is hier niet handig: dat gebruik je als je een verslag schrijft dat iemand alleen leest.</p>'
        ].join('\n')
      },
      // theorieblok 2: Mini-portfolio
      {
        keyTerms: ['checkpoint', 'bewijs', 'presentatie', 'zelfstandig'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Kim schrijft bij haar reflectie alleen ging goed. Is dat genoeg?</p>',
          '<p><strong>Antwoord.</strong> Nee. Schrijf op wat je zelfstandig kon en waar je hulp bij nodig had, bijvoorbeeld: het delen lukte alleen, maar bij de rechten heb ik het aan mijn buurman gevraagd.</p>'
        ].join('\n')
      }
    ]
  }
};
