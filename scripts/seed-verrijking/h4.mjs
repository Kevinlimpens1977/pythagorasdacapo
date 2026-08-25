// Verrijkingslaag hoofdstuk 4 - Data en Bronnen.
//
// Per paragraafcode:
//   learningGoals: 2 of 3 korte zinnen die beginnen met "Je weet ..." of "Je kunt ...".
//   theorie: array met exact twee items, in dezelfde volgorde als de twee
//            theorieblokken van die paragraaf in de generator.
//     keyTerms:    2 tot 4 woorden die LETTERLIJK als los woord in die
//                  theorietekst staan; de leesopmaak zet ze vet.
//     exampleHtml: een uitgewerkt voorbeeld als vraag + antwoord. Het paneel
//                  zet zelf al het label "Voorbeeld" erboven.

export default {
  // 4.1 Excel: tabellen maken
  '4.1': {
    learningGoals: [
      'Je weet wat data zijn en waarom je ze netjes opschrijft.',
      'Je kunt een tabel in Excel maken met rijen en kolommen.',
      'Je kunt een kolomtitel kiezen die later nog duidelijk is.'
    ],
    theorie: [
      // theorieblok 1: Data netjes verzamelen
      {
        keyTerms: ['data', 'gegevens', 'Excel', 'sorteren'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam vraagt aan tien klasgenoten hoe lang ze naar school reizen. Hij typt alles achter elkaar in één vakje. Waarom is dat later lastig?</p>',
          '<p><strong>Antwoord.</strong> Zo staan de gegevens niet apart en kan Excel er niets mee. Zet elke leerling op een eigen rij, dan kun je later sorteren en een grafiek maken.</p>'
        ].join('\n')
      },
      // theorieblok 2: Rij, kolom en cel
      {
        keyTerms: ['cel', 'rij', 'kolom', 'Kolomtitels'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Boven een kolom staat alleen het woord Tijd. Een week later weet niemand meer of dat minuten of vertrektijden zijn. Hoe los je dat op?</p>',
          '<p><strong>Antwoord.</strong> Geef de kolom een titel die alles vertelt, bijvoorbeeld Reistijd in minuten. In cel B1 zet je die titel, daaronder komen de getallen.</p>'
        ].join('\n')
      }
    ]
  },

  // 4.2 Excel: rekenen met formules
  '4.2': {
    learningGoals: [
      'Je weet dat een formule in Excel altijd met = begint.',
      'Je kunt een som en een gemiddelde laten berekenen.',
      'Je kunt controleren of een formule de juiste cellen pakt.'
    ],
    theorie: [
      // theorieblok 1: Excel rekent, jij controleert
      {
        keyTerms: ['Formules', 'controleren', 'bereik', 'uitkomst'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iris telt de kantineverkoop van vijf dagen op, maar haar formule begint pas bij de tweede dag. De uitkomst ziet er netjes uit. Klopt hij?</p>',
          '<p><strong>Antwoord.</strong> Nee, er mist een dag. Het bereik is te klein gekozen. Klik op de cel met de formule en kijk welke vakjes Excel blauw maakt.</p>'
        ].join('\n')
      },
      // theorieblok 2: Formules lezen
      {
        keyTerms: ['formule', 'SOM', 'GEMIDDELDE', 'Excel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In B2 tot en met B6 staan de cijfers van vijf toetsen. Je wilt weten hoe hoog je er gemiddeld voor staat. Welke formule typ je?</p>',
          '<p><strong>Antwoord.</strong> Je typt =GEMIDDELDE(B2:B6). Met =SOM(B2:B6) krijg je alle cijfers bij elkaar opgeteld, en dat is geen rapportcijfer.</p>'
        ].join('\n')
      }
    ]
  },

  // 4.3 Grafieken die iets vertellen
  '4.3': {
    learningGoals: [
      'Je weet welke onderdelen een grafiek nodig heeft.',
      'Je kunt een staafdiagram of lijngrafiek kiezen bij je vraag.',
      'Je weet hoe een grafiek je kan misleiden.'
    ],
    theorie: [
      // theorieblok 1: Van tabel naar verhaal
      {
        keyTerms: ['grafiek', 'titel', 'labels', 'conclusie'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Op het bord staan gekleurde staven zonder tekst eromheen. De klas snapt niet waar het over gaat. Wat mist er?</p>',
          '<p><strong>Antwoord.</strong> Er is geen titel en er zijn geen labels bij de assen. Zet erboven waar de grafiek over gaat en schrijf eronder in één zin wat je ziet.</p>'
        ].join('\n')
      },
      // theorieblok 2: Eerlijk kijken
      {
        keyTerms: ['schaal', 'staafdiagram', 'lijngrafiek', 'grafieksoort'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je wilt laten zien hoeveel schermtijd je elke dag van de week had. Kies je een staafdiagram of een lijngrafiek?</p>',
          '<p><strong>Antwoord.</strong> Een lijngrafiek, want die laat verandering in tijd zien. Let ook op de schaal: begin je niet bij nul, dan lijkt een klein verschil ineens enorm.</p>'
        ].join('\n')
      }
    ]
  },

  // 4.4 Data om je heen en data/privacy
  '4.4': {
    learningGoals: [
      'Je weet welke gegevens apps en schoolsystemen van je bewaren.',
      'Je kunt bij een app uitleggen wat het doel en het risico is.',
      'Je kunt een instelling kiezen die je privacy beter beschermt.'
    ],
    theorie: [
      // theorieblok 1: Jouw dataspuren
      {
        keyTerms: ['gegevens', 'klikgedrag', 'locatie', 'data'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een spelletje op je telefoon vraagt of het je locatie mag gebruiken. Het spel is een puzzel. Waarom is die vraag raar?</p>',
          '<p><strong>Antwoord.</strong> Een puzzel heeft je locatie niet nodig om te werken. De maker verzamelt dan gegevens voor iets anders, bijvoorbeeld reclame. Je mag rustig nee zeggen.</p>'
        ].join('\n')
      },
      // theorieblok 2: Privacykeuzes
      {
        keyTerms: ['Privacy', 'gedeeld', 'persoonlijk', 'instellingen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Yara zet in haar profiel haar school, haar klas en haar woonplaats. Haar account staat open voor iedereen. Wat kan er misgaan?</p>',
          '<p><strong>Antwoord.</strong> Samen is dat genoeg om haar op te zoeken. Die informatie is persoonlijk, dus zet ze haar account op privé en laat ze de woonplaats weg.</p>'
        ].join('\n')
      }
    ]
  },

  // 4.5 Bronnen beoordelen met data en bewijs
  '4.5': {
    learningGoals: [
      'Je weet het verschil tussen een claim en bewijs.',
      'Je kunt bij een bericht nagaan wie het zegt en wanneer.',
      'Je kunt benoemen welke gegevens in een bericht ontbreken.'
    ],
    theorie: [
      // theorieblok 1: Een claim is nog geen bewijs
      {
        keyTerms: ['claim', 'bewering', 'bron', 'betrouwbaar'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> In een filmpje hoor je: 9 van de 10 leerlingen slapen te weinig door hun telefoon. Geloof je dat meteen?</p>',
          '<p><strong>Antwoord.</strong> Nog niet. Dit is een bewering. Zoek eerst wie het onderzoek deed, hoeveel leerlingen zijn gevraagd en waar het is gepubliceerd.</p>'
        ].join('\n')
      },
      // theorieblok 2: Data controleren
      {
        keyTerms: ['datum', 'afzender', 'steekproef', 'cijfers'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een website meldt dat 80 procent van de jongeren een bepaald merk energiedrank het lekkerst vindt. De site is van dat merk zelf. Wat controleer je?</p>',
          '<p><strong>Antwoord.</strong> Kijk naar de afzender: die verdient aan de uitkomst. Zoek ook de datum en de steekproef. Vijftig mensen op een festival zegt weinig over alle jongeren.</p>'
        ].join('\n')
      }
    ]
  },

  // 4.6 Checkpoint: data-dashboard en bronkeuze
  '4.6': {
    learningGoals: [
      'Je weet welke onderdelen in een mini-dashboard horen.',
      'Je kunt tabel, formule, grafiek en conclusie samenbrengen op één overzicht.',
      'Je kunt uitleggen waar je data vandaan komt en hoe je met privacy omgaat.'
    ],
    theorie: [
      // theorieblok 1: Mini-dashboard
      {
        keyTerms: ['dashboard', 'overzicht', 'conclusie', 'doel'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Ravi maakt een kleurig dashboard met drie grafieken, maar er staat nergens een zin bij. Zijn docent snapt het niet. Wat voegt hij toe?</p>',
          '<p><strong>Antwoord.</strong> Zijn onderzoeksvraag bovenaan en onder elke grafiek een korte conclusie. Mooi is niet het doel; de lezer moet meteen het antwoord zien.</p>'
        ].join('\n')
      },
      // theorieblok 2: Bronkeuze uitleggen
      {
        keyTerms: ['bruikbaar', 'privacyzin', 'bronnen', 'veiligheid'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je dashboard gaat over de kantine en je hebt zelf twintig klasgenoten gevraagd. Wat schrijf je erbij over je data?</p>',
          '<p><strong>Antwoord.</strong> Dat je de gegevens zelf hebt verzameld bij twintig leerlingen uit één klas, dus alleen bruikbaar voor die klas. In je privacyzin zet je dat er geen namen in staan.</p>'
        ].join('\n')
      }
    ]
  }
};
