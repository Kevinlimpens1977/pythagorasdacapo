// Verrijkingslaag hoofdstuk 1 - Starten en Account & Veilig.
//
// Per paragraafcode:
//   learningGoals: 2 of 3 korte zinnen die beginnen met "Je weet ..." of "Je kunt ...".
//   theorie: array met exact twee items, in dezelfde volgorde als de twee
//            theorieblokken van die paragraaf in de generator.
//     keyTerms:    2 tot 4 woorden die LETTERLIJK als los woord in die
//                  theorietekst staan; de leesopmaak zet ze vet.
//     exampleHtml: een uitgewerkt voorbeeld als vraag + antwoord. Het paneel
//                  zet zelf al het label "Voorbeeld" erboven.
//   samenvatting: de laatste leestekst voor de quiz of toets.
//     html:     2 of 3 zinnen die de begrippen van die paragraaf herhalen, elk
//               begrip letterlijk genoemd. Taalniveau B1, brugklas.
//     keyTerms: verplicht zodra html gevuld is; elk woord staat letterlijk in
//               die samenvatting. Een kernbegrip mag in de hele seed in
//               maximaal twee blokken staan (validator bewaakt dat).

export default {
  '1.1': {
    learningGoals: [
      'Je weet waarvoor je HELIX, OneDrive en Outlook gebruikt.',
      'Je kunt met je schoolaccount inloggen en je schoolwerk terugvinden.',
      'Je kunt bewijs van je werk opslaan in een eigen map.'
    ],
    theorie: [
      {
        keyTerms: ['schoolaccount', 'HELIX', 'OneDrive', 'Outlook'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Noa krijgt een bericht van haar mentor. Daarna moet ze de opdracht van vandaag openen. Welke twee plekken heeft ze nodig?</p>',
          '<p><strong>Antwoord.</strong> Eerst Outlook, want daar komt het bericht binnen. Daarna HELIX, want daar staan de lessen en opdrachten. Met haar schoolaccount komt ze op allebei binnen.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['vaste map', 'Word-bestand', 'schoolwerk'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Tim slaat zijn eerste opdracht op met de naam nieuw. Een week later kan hij hem niet meer vinden. Wat ging er mis?</p>',
          '<p><strong>Antwoord.</strong> De naam zegt niets over de opdracht, en het bestand staat niet in een vaste map. Beter: een map voor dit vak, met daarin les1-schooltas-tim-1a.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Met je schoolaccount kom je binnen bij HELIX, OneDrive en Outlook. Elke plek heeft een eigen taak: mail in Outlook, bestanden in OneDrive en je lessen in HELIX. Je schoolwerk zet je in een vaste map, zodat je het volgende week nog terugvindt.</p>',
      keyTerms: ['schoolaccount', 'HELIX', 'schoolwerk']
    }
  },

  '1.2': {
    learningGoals: [
      'Je weet waarom een lang en uniek wachtwoord veiliger is.',
      'Je kunt een sterke wachtwoordzin bedenken zonder je eigen gegevens.',
      'Je weet wat je doet als je wachtwoord gelekt of vergeten is.'
    ],
    theorie: [
      {
        keyTerms: ['wachtwoord', 'wachtwoordzin', 'uniek', 'gehackt'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Welke is sterker: Rex2011! of paarse fiets zoekt kaas?</p>',
          '<p><strong>Antwoord.</strong> De tweede. Rex2011! lijkt moeilijk, maar het is de naam van een huisdier met een jaartal erachter. Dat kan iemand raden. De vier woorden zijn veel langer en horen niet bij jou.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['wachtwoord', 'gelekt', 'herstelroute', 'nepwachtwoorden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Iemand mailt: ik ben van de ICT-helpdesk, stuur je wachtwoord even terug. Wat doe je?</p>',
          '<p><strong>Antwoord.</strong> Niet terugsturen. De school vraagt nooit om je echte wachtwoord. Je meldt het bericht bij je docent of mentor. Moet je zelf een nieuw wachtwoord, dan gebruik je de officiële herstelroute.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een sterk wachtwoord is vooral lang en uniek: een wachtwoordzin van meerdere woorden is beter dan een kort moeilijk woord. Je deelt je wachtwoord nooit, ook niet met een vriend, en je gebruikt niet overal hetzelfde. Is het gelekt of vergeten, dan neem je de herstelroute van school.</p>',
      keyTerms: ['uniek', 'wachtwoordzin', 'herstelroute']
    }
  },

  '1.3': {
    learningGoals: [
      'Je weet het verschil tussen hardware en software.',
      'Je kunt uitleggen waarom updates je device veiliger maken.',
      'Je weet welke instellingen je zelf aanpast en welke niet.'
    ],
    theorie: [
      {
        keyTerms: ['hardware', 'software', 'Windows', 'browser'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je muis beweegt niet meer. Je klasgenoot zegt: dan moet je de browser opnieuw opstarten. Klopt dat?</p>',
          '<p><strong>Antwoord.</strong> Nee. Een muis is hardware, dus je controleert eerst de kabel, de batterij of de verbinding. De browser is software en heeft hier niets mee te maken.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['instellingen', 'updates', 'wifi', 'device'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je laptop vraagt al twee weken om een update. Je klikt steeds op later, want je hebt haast. Wat is daar het risico van?</p>',
          '<p><strong>Antwoord.</strong> Updates lossen fouten op en dichten gaten in de beveiliging. Blijf je uitstellen, dan wordt je device onveiliger. Plan de update op een moment dat je niet aan het werk bent, bijvoorbeeld in de pauze.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Hardware is alles wat je kunt vastpakken, software is het programma dat erop draait. Een update repareert gaten in de software, daarom stel je hem niet steeds uit.</p>',
      keyTerms: ['hardware', 'software', 'update']
    }
  },

  '1.4': {
    learningGoals: [
      'Je weet het verschil tussen een bestand op je apparaat en in de cloud.',
      'Je kunt een mappenstructuur maken voor vak, hoofdstuk en opdracht.',
      'Je kunt bestandsnamen kiezen waarmee je je werk terugvindt.'
    ],
    theorie: [
      {
        keyTerms: ['lokaal', 'cloud', 'cloudopslag'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Sam maakt op school zijn opdracht af en slaat hem lokaal op het bureaublad op. Thuis wil hij verder werken. Lukt dat?</p>',
          '<p><strong>Antwoord.</strong> Nee, het bestand staat alleen op die ene schoolcomputer. Had hij het in OneDrive gezet, dan kon hij er thuis gewoon bij.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['structuur', 'bestandsnamen', 'lesnummer'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Verbeter deze bestandsnaam: versie2echtklaar.docx.</p>',
          '<p><strong>Antwoord.</strong> Zet erin wat het is en van wie: les4-mappen-sam-1c.docx. Nu weten jij en je docent na een maand nog steeds welke opdracht dit is.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Een bestand staat lokaal op je apparaat of in de cloud. Zet je het in OneDrive, dan vind je je werk op school en thuis terug, maar alleen met een vaste structuur van vak, hoofdstuk en opdracht. Duidelijke bestandsnamen zorgen dat je na een maand nog weet welk bestand je nodig hebt.</p>',
      keyTerms: ['cloud', 'structuur', 'bestandsnamen']
    }
  },

  '1.5': {
    learningGoals: [
      'Je weet wat phishing is en waarom het werkt.',
      'Je kunt rode vlaggen in een verdacht bericht aanwijzen.',
      'Je weet wat je doet bij twijfel en wie je om hulp vraagt.'
    ],
    theorie: [
      {
        keyTerms: ['phishing', 'afzenders', 'haast', 'bijlagen'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je krijgt een bericht: je schoolaccount wordt binnen 24 uur gesloten, klik hier om dit te voorkomen. Welke twee rode vlaggen zie je?</p>',
          '<p><strong>Antwoord.</strong> De haast (binnen 24 uur) en de dreiging (je account gaat dicht). Zo willen ze dat je snel klikt zonder na te denken. Dit is phishing.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['afzender', 'link', 'screenshot', 'melden'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Het bericht lijkt van school, maar het mailadres eindigt op -school-support.info. Wat doe je?</p>',
          '<p><strong>Antwoord.</strong> Niet klikken en de bijlage niet openen. Je maakt een screenshot en laat het bericht zien aan je docent of mentor. Melden is slim, geen blunder.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>Phishing is een truc om jouw gegevens of geld te krijgen. Je herkent het aan haast, dreiging, spelfouten en een afzender die niet klopt. Klik niet op de link, open geen bijlage en ga melden bij je docent of mentor.</p>',
      keyTerms: ['phishing', 'haast', 'melden']
    }
  },

  '1.6': {
    learningGoals: [
      'Je kunt zelfstandig inloggen, opslaan en mailen met je schoolaccount.',
      'Je kunt bewijs van je werk verzamelen en inleveren.',
      'Je weet wanneer je stopt en hulp vraagt bij iets verdachts.'
    ],
    theorie: [
      {
        keyTerms: ['account', 'device', 'veiligheid', 'digitaal vaardig'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Een klasgenoot zegt: ik kan alles vinden, maar ik weet niet meer waar mijn opdracht van vorige week staat. Is hij digitaal vaardig?</p>',
          '<p><strong>Antwoord.</strong> Nog niet helemaal. Inloggen lukt, maar terugvinden hoort er ook bij. Met een vaste map in OneDrive en duidelijke namen lost hij dat op.</p>'
        ].join('\n')
      },
      {
        keyTerms: ['checkpoint', 'bewijs', 'Outlook-mail'],
        exampleHtml: [
          '<p><strong>Vraag.</strong> Je levert een screenshot in van een leeg scherm met alleen het woord Checkpoint1. Is dat genoeg bewijs?</p>',
          '<p><strong>Antwoord.</strong> Nee. Op de screenshot moet te zien zijn dat de map bestaat en welk bestand erin staat. Anders kan je docent niet controleren of je het echt gedaan hebt.</p>'
        ].join('\n')
      }
    ],
    samenvatting: {
      html: '<p>In deze checkpoint laat je zien dat je zelfstandig kunt inloggen, opslaan, mailen en veilig kiezen. Je levert bewijs in: een map, een Word-bestand, een screenshot en een nette Outlook-mail. Weet je iets niet zeker, dan stop je en vraag je hulp.</p>',
      keyTerms: ['checkpoint', 'zelfstandig', 'Outlook-mail']
    }
  }
};
