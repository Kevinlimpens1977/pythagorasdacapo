// Level 3 - De chaotische social media studio.
export const LEVEL_3_STUDIO = {
  id: 'studio',
  nummer: 3,
  titel: 'De chaotische social media studio',
  subtitel: 'Spoor alles op wat met veiligheid, nepnieuws en oplichting te maken heeft.',
  achtergrond: 'level3/achtergrond.webp',
  fallbackKleur: 'from-indigo-100 to-rose-50',
  objecten: [
    {
      id: 'studiocamera',
      naam: 'Studiocamera',
      emoji: '🎥',
      x: 11, y: 39, breedte: 16, hoogte: 26,
      hint: 'De grote camera op een statief, helemaal links.',
      ariaLabel: 'Studiocamera op statief links'
    },
    {
      id: 'phishing-envelop',
      naam: 'Phishingbericht',
      emoji: '🎣',
      x: 28, y: 68.5, breedte: 10, hoogte: 12,
      hint: 'Een envelop met een vishaakje, op het bureau links.',
      ariaLabel: 'Envelop met vishaak op het bureau'
    },
    {
      id: 'qr-code',
      naam: 'QR-code',
      emoji: '🔳',
      x: 42, y: 49, breedte: 10, hoogte: 15,
      hint: 'Een zwart-witte scan-code, groot op een scherm.',
      ariaLabel: 'QR-code op een beeldscherm'
    },
    {
      id: 'nepnieuws',
      naam: 'Nepnieuwsbericht',
      emoji: '📰',
      x: 53.5, y: 59, breedte: 12, hoogte: 11,
      hint: 'Een krant op het bureau, in het midden.',
      ariaLabel: 'Krant op het bureau'
    },
    {
      id: 'hangslot',
      naam: 'Hangslot',
      emoji: '🔒',
      x: 66, y: 30.5, breedte: 9, hoogte: 14,
      hint: 'Een gouden slot op een scherm, bovenin.',
      ariaLabel: 'Hangslot op een beeldscherm'
    },
    {
      id: 'verificatievinkje',
      naam: 'Verificatievinkje',
      emoji: '✅',
      x: 80, y: 30.5, breedte: 8, hoogte: 14,
      hint: 'Het blauwe vinkje van een echt account, aan de muur rechts.',
      ariaLabel: 'Blauw verificatievinkje aan de muur'
    },
    {
      id: 'rapporteervlag',
      naam: 'Rapporteervlag',
      emoji: '🚩',
      x: 78, y: 50, breedte: 7, hoogte: 11,
      hint: 'Een rode vlag op het bureau rechts: hiermee meld je iets.',
      ariaLabel: 'Rode rapporteervlag op het bureau'
    },
    {
      id: 'waarschuwing',
      naam: 'Waarschuwing',
      emoji: '⚠️',
      x: 92.5, y: 60.5, breedte: 8, hoogte: 13,
      hint: 'Een gele driehoek, rechts tegen de apparatuur.',
      ariaLabel: 'Gele waarschuwingsdriehoek'
    },
    {
      id: 'advertentie',
      naam: 'Advertentie',
      emoji: '📢',
      x: 78.5, y: 81, breedte: 14, hoogte: 16,
      hint: 'Een kleurige megafoon op het tafeltje, rechts vooraan.',
      ariaLabel: 'Megafoon op een tafeltje'
    }
  ],
  vraag: {
    tekst: 'Je krijgt een bericht: "Klik NU op deze link, anders ben je je prijs kwijt!" Wat doe je?',
    opties: [
      { id: 'a', tekst: 'Niet klikken en het bericht rapporteren', correct: true },
      { id: 'b', tekst: 'Snel klikken, anders ben ik de prijs kwijt' },
      { id: 'c', tekst: 'De link doorsturen naar een vriend' }
    ],
    uitlegGoed: 'Top! Haast en druk zijn dé trucs van oplichters. Niet klikken, wel rapporteren.',
    uitlegFout: 'Pas op: berichten die haast maken zijn bijna altijd nep. Klik niet en rapporteer het bericht.'
  }
};
