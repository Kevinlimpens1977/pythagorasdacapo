// Inhoud van de helpknop voor beheer. Eén bestand, zodat de uitleg met de app
// meegroeit. Status per optie: 'nu' = werkt nu, 'straks' = na de bouw van het
// plan in docs/PLAN-INCLUSIEVARIANTEN.md. Zet een optie op 'nu' zodra die fase af is.

export const HELP_STATUS = {
  NU: 'nu',
  STRAKS: 'straks'
};

export const HELP_ONDERWERPEN = [
  {
    id: 'inclusie',
    titel: 'Inclusie klaarzetten',
    samenvatting:
      'Eén basisroute voor iedereen. Een inclusieklas (nu H1i1) volgt diezelfde route en krijgt alleen op sommige plekken een aangepaste versie.',
    secties: [
      {
        titel: 'Het idee',
        tekst: [
          'Je onderhoudt elk hoofdstuk één keer. Voor een inclusieklas leg je alleen vast wat afwijkt.',
          'Maak geen kopie van een hele route: dan moet je elke verbetering twee keer doen.'
        ]
      },
      {
        titel: 'Wat je kunt doen',
        opties: [
          {
            status: HELP_STATUS.NU,
            titel: 'Blokken weglaten voor een klas',
            tekst: 'Klaarzetten > kies de klas > open de paragraaf > zet blokken uit. De klas ziet dan alleen de gekozen blokken.',
            letOp: 'Zodra je één blok kiest, geldt een vaste lijst. Een blok dat je later aan de paragraaf toevoegt, komt er dan niet vanzelf bij. Met "Selectie wissen" ziet de klas weer alles.'
          },
          {
            status: HELP_STATUS.NU,
            titel: 'Een eigen versie van een hele paragraaf',
            tekst: 'Maak in de lesstofeditor een tweede paragraaf met dezelfde code, bijvoorbeeld "2.1 ... (inclusie)". Zet die alleen bij de inclusieklas klaar en haal de gewone paragraaf bij die klas weg.',
            letOp: 'Zo is de korte nulmeting van H1i1 gemaakt (paragraaf-dv-h1i1-nulmeting-kort). Het script plaats-nulmeting-h1i1.mjs overschrijft alle paragrafen van H1i1; draai het niet opnieuw zonder dat te weten.'
          },
          {
            status: HELP_STATUS.NU,
            titel: 'Iets extra voor één leerling',
            tekst: 'Klaarzetten > tab "Per leerling" > kies de leerling. Extra paragrafen of blokken gelden alleen voor die leerling.'
          },
          {
            status: HELP_STATUS.NU,
            titel: 'Inleiding van een toets meteen ingeklapt',
            tekst: 'Blokinstelling op een toets of quiz. Handig voor leerlingen die snel afgeleid zijn: ze zien meteen vraag 1.'
          },
          {
            status: HELP_STATUS.STRAKS,
            titel: 'Leerprofiel "Inclusie" op de klas',
            tekst: 'Klassen > kies de klas > Leerprofiel: Inclusie. Vanaf dan ziet die klas overal de inclusievarianten in plaats van de gewone blokken.'
          },
          {
            status: HELP_STATUS.STRAKS,
            titel: 'Een inclusievariant van één blok',
            tekst: 'Lesstofeditor > knop "Maak inclusievariant" bij een blok. Je krijgt een kopie op dezelfde plek; pas die aan (kortere tekst, minder vragen, extra tussenstappen). Een standaardklas ziet het gewone blok, een inclusieklas de variant.'
          },
          {
            status: HELP_STATUS.STRAKS,
            titel: 'Hoofdstuk in één keer goed klaarzetten',
            tekst: 'Zet je een hoofdstuk klaar voor een inclusieklas, dan kiest HELIX vanzelf de variantparagrafen. Per paragraaf zie je "2 aanpassingen voor inclusie".'
          },
          {
            status: HELP_STATUS.STRAKS,
            titel: 'Inclusieleerling in een gewone klas',
            tekst: 'Leerprofiel per leerling, via de tab "Per leerling".'
          },
          {
            status: HELP_STATUS.STRAKS,
            titel: 'Varianten laten bouwen met de hoofdstukskill',
            tekst: 'Bij /helix-hoofdstuk-bouwen geef je per blok aan of er een inclusieversie moet komen. De skill bouwt beide.'
          }
        ]
      },
      {
        titel: 'Stappenplan: nieuw hoofdstuk voor de inclusieklas (nu)',
        stappen: [
          'Bouw het hoofdstuk één keer, voor iedereen.',
          'Bepaal per paragraaf: gelijk, iets weglaten, of een eigen versie.',
          'Iets weglaten: zet bij de inclusieklas die blokken uit (Klaarzetten).',
          'Eigen versie: maak een tweede paragraaf "(inclusie)", zet die bij de inclusieklas klaar en haal de gewone weg.',
          'Controleer als testleerling in die klas (/admin/testen) wat de leerling echt ziet.'
        ]
      },
      {
        titel: 'Let op',
        tekst: [
          'Een eigen blokselectie wint altijd, ook straks van het leerprofiel.',
          'Voortgang en tokens horen bij het blok dat de leerling echt maakte. Een variant heeft een eigen voortgang.',
          'De blauwe en paarse route bij Digitale vaardigheden bestaan alleen nog voor de oude nulmeting. Niet verwijderen: daar hangt voortgang aan.'
        ]
      }
    ],
    bron: 'docs/PLAN-INCLUSIEVARIANTEN.md'
  },
  {
    id: 'tokens',
    titel: 'Tokens, XP en weekdoel',
    samenvatting:
      'Leerlingen verdienen XP (niveau, voor inzet) en tokens (shop, voor beheersing). Bij Digitale vaardigheden is het hoofdstuk van de week het weekdoel.',
    secties: [
      {
        titel: 'Wat een leerling verdient',
        tekst: [
          'Elk afgerond blok: XP. Theorie 10, toets of quiz 20-30, spel 15.',
          'Tokens naar beheersing: onder 60% niets, 60-74% 40%, 75-89% 70%, 90% of meer alles. De eerste keer 100%: een ster en 25% extra.',
          'Een betere tweede poging levert alleen het verschil op.',
          'Maximaal 200 tokens per vak per week (spellen tellen mee). Niveau omhoog: 25 tokens extra.'
        ]
      },
      {
        titel: 'Het weekdoel (alleen Digitale vaardigheden)',
        opties: [
          {
            status: HELP_STATUS.NU,
            titel: 'Geef het hoofdstuk van de week vrij',
            tekst: 'Zet het hoofdstuk vooruit klaar met een slot, en haal het slot eraf op de dag van de les (Vrijgeven). Vanaf dat moment is dat hoofdstuk het weekdoel van die week.',
            letOp: 'Alleen vrijgeven via het slot zet de datum. Een hoofdstuk dat je zonder slot klaarzet, telt niet als weekdoel.'
          },
          {
            status: HELP_STATUS.NU,
            titel: 'Weekkist en weekreeks',
            tekst: 'Alle toegewezen blokken van het hoofdstuk af = de weekkist (30-60 tokens). Elke week achter elkaar telt voor de weekreeks; bij 3, 5, 10 en 20 weken komt er een bonus bij.',
            letOp: 'Een week zonder vrijgave (vakantie, toetsweek) breekt de reeks niet. Eén gemiste week per 6 weken wordt overgeslagen.'
          },
          {
            status: HELP_STATUS.NU,
            titel: 'Huiswerkbonus',
            tekst: 'Werkt een leerling op een tweede dag in dezelfde week aan DV, dan krijgt hij één keer 20 tokens.'
          }
        ]
      },
      {
        titel: 'Let op',
        tekst: [
          'Binask heeft geen weekdoel; daar verdienen leerlingen per blok.',
          'Het niveau is voor de hele klas zichtbaar. XP beloont inzet, zodat wie meedoet ook stijgt.',
          'Per klas zie je niveau, sterren, badges, weekdoel en weekreeks onder Voortgang > kies een klas.',
          'Twaalf badges (sterren, weekdoelen, weekreeks, huiswerk, niveau) staan op het profiel van de leerling.',
          'Instellingen per spel (maximum, opnieuw spelen): Spellen > kies het spel.'
        ]
      }
    ],
    bron: 'SPELOPZET-TOKENS-EN-SHOP.md'
  }
];

export function helpOnderwerp(id) {
  return HELP_ONDERWERPEN.find((onderwerp) => onderwerp.id === id) || HELP_ONDERWERPEN[0];
}

// Open het helppaneel vanaf elke plek, bijvoorbeeld een knop op de klaarzetpagina.
export const HELP_EVENT = 'helix-help-openen';

export function openHelp(onderwerpId) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(HELP_EVENT, { detail: { onderwerp: onderwerpId } }));
}
