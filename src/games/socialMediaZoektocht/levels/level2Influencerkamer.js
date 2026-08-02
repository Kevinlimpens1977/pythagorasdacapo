// Level 2 - De slaapkamer van een influencer.
export const LEVEL_2_INFLUENCERKAMER = {
  id: 'influencerkamer',
  nummer: 2,
  titel: 'De slaapkamer van een influencer',
  subtitel: 'Zoek alles wat met filmen, delen en accountveiligheid te maken heeft.',
  achtergrond: 'level2/achtergrond.webp',
  fallbackKleur: 'from-fuchsia-100 to-sky-50',
  objecten: [
    {
      id: 'ringlamp',
      naam: 'Ringlamp',
      emoji: '💡',
      x: 39.5, y: 40, breedte: 11, hoogte: 24,
      hint: 'De grote ronde lamp op een statief, midden in de kamer.',
      ariaLabel: 'Ringlamp op statief'
    },
    {
      id: 'selfiecamera',
      naam: 'Camera',
      emoji: '📷',
      x: 14.8, y: 64.5, breedte: 9, hoogte: 10,
      hint: 'Hij staat op het bureau, links.',
      ariaLabel: 'Camera op het bureau'
    },
    {
      id: 'microfoon',
      naam: 'Microfoon',
      emoji: '🎙️',
      x: 22.5, y: 51, breedte: 10, hoogte: 14,
      hint: 'Hij hangt aan een arm boven het bureau.',
      ariaLabel: 'Microfoon aan een arm boven het bureau'
    },
    {
      id: 'telefoonstandaard',
      naam: 'Telefoon in standaard',
      emoji: '📱',
      x: 29.5, y: 55, breedte: 6, hoogte: 11,
      hint: 'De telefoon staat rechtop op het bureau, klaar om te filmen.',
      ariaLabel: 'Telefoon in een standaard op het bureau'
    },
    {
      id: 'locatiepin',
      naam: 'Locatiepin',
      emoji: '📍',
      x: 19, y: 28, breedte: 9, hoogte: 16,
      hint: 'Een grote rode druppel op een poster, links bovenin.',
      ariaLabel: 'Locatiepin op een poster'
    },
    {
      id: 'like',
      naam: 'Like-symbool',
      emoji: '👍',
      x: 28.5, y: 42, breedte: 7, hoogte: 13,
      hint: 'Een blauw duimpje omhoog op een poster aan de muur.',
      ariaLabel: 'Like-duimpje op een poster'
    },
    {
      id: 'meldingenbel',
      naam: 'Meldingenbel',
      emoji: '🔔',
      x: 85, y: 30.5, breedte: 8, hoogte: 13,
      hint: 'Een gele bel-sticker op de kledingkast, rechts.',
      ariaLabel: 'Meldingenbel-sticker op de kledingkast'
    },
    {
      id: 'wachtwoordsleutel',
      naam: 'Sterk wachtwoord',
      emoji: '🔑',
      x: 63.5, y: 36, breedte: 6, hoogte: 7,
      hint: 'Een gouden sleutel in de boekenkast.',
      ariaLabel: 'Gouden sleutel in de boekenkast'
    },
    {
      id: 'chatbericht',
      naam: 'Chatbericht',
      emoji: '💬',
      x: 75, y: 49.5, breedte: 8, hoogte: 10,
      hint: 'Een wit tekstwolkje aan de muur, rechts van de boekenkast.',
      ariaLabel: 'Chatbericht-wolkje aan de muur'
    }
  ],
  vraag: {
    tekst: 'Waarom moet je voorzichtig zijn met het delen van je locatie?',
    opties: [
      { id: 'a', tekst: 'Vreemden kunnen dan zien waar ik ben', correct: true },
      { id: 'b', tekst: 'Mijn batterij gaat er sneller van leeg' },
      { id: 'c', tekst: 'Mijn foto’s worden er minder mooi van' }
    ],
    uitlegGoed: 'Klopt! Deel je locatie alleen met mensen die je echt kent en vertrouwt.',
    uitlegFout: 'Denk aan veiligheid: als vreemden zien waar je bent, kan dat gevaarlijk zijn. Deel je locatie alleen met mensen die je echt kent.'
  }
};
