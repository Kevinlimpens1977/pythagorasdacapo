// Level 1 - Het digitale klaslokaal.
// De hele zoekplaat zit in de achtergrondafbeelding; objecten zijn onzichtbare
// hotspots. Posities in procenten van het 16:9-vlak; x/y = middelpunt.
export const LEVEL_1_KLASLOKAAL = {
  id: 'klaslokaal',
  nummer: 1,
  titel: 'Het digitale klaslokaal',
  subtitel: 'Vind alle apparaten en digitale symbolen in het lokaal.',
  achtergrond: 'level1/achtergrond.webp',
  fallbackKleur: 'from-sky-100 to-amber-50',
  objecten: [
    {
      id: 'laptop',
      naam: 'Laptop',
      emoji: '💻',
      x: 17, y: 52, breedte: 13, hoogte: 15,
      hint: 'Hij staat open op een bureau, links vooraan.',
      ariaLabel: 'Laptop op een bureau links'
    },
    {
      id: 'tablet',
      naam: 'Tablet',
      emoji: '📱',
      x: 50, y: 57, breedte: 10, hoogte: 8,
      hint: 'Hij ligt plat op de grote tafel in het midden.',
      ariaLabel: 'Tablet op de middelste tafel'
    },
    {
      id: 'smartphone',
      naam: 'Smartphone',
      emoji: '📲',
      x: 62, y: 49, breedte: 7, hoogte: 7,
      hint: 'Hij ligt boven op een stapel boeken.',
      ariaLabel: 'Smartphone op een stapel boeken'
    },
    {
      id: 'koptelefoon',
      naam: 'Koptelefoon',
      emoji: '🎧',
      x: 78, y: 68, breedte: 10, hoogte: 13,
      hint: 'Hij hangt aan een stoel, rechts vooraan.',
      ariaLabel: 'Koptelefoon aan een stoel rechts'
    },
    {
      id: 'usb-stick',
      naam: 'USB-stick',
      emoji: '💾',
      x: 72.5, y: 93, breedte: 8, hoogte: 7,
      hint: 'Klein en rood, helemaal rechts onderin op een tafel.',
      ariaLabel: 'Rode USB-stick rechtsonder'
    },
    {
      id: 'wifi',
      naam: 'Wifi-symbool',
      emoji: '📶',
      x: 20, y: 21, breedte: 6, hoogte: 10,
      hint: 'Een bordje aan de muur, links naast de deur.',
      ariaLabel: 'Wifi-bordje aan de muur links'
    },
    {
      id: 'hashtag',
      naam: 'Hashtag',
      emoji: '#️⃣',
      x: 85, y: 19, breedte: 7, hoogte: 13,
      hint: 'Een poster bij het raam, rechts bovenin.',
      ariaLabel: 'Hashtag-poster bij het raam'
    },
    {
      id: 'emoji',
      naam: 'Emoji',
      emoji: '😄',
      x: 48.5, y: 22, breedte: 9, hoogte: 15,
      hint: 'Een vrolijk gezicht, groot op het whiteboard.',
      ariaLabel: 'Vrolijke emoji op het whiteboard'
    },
    {
      id: 'laadkabel',
      naam: 'Laadkabel',
      emoji: '🔌',
      x: 34, y: 80, breedte: 12, hoogte: 10,
      hint: 'Hij ligt opgerold op de vloer, midden vooraan.',
      ariaLabel: 'Opgerolde laadkabel op de vloer'
    }
  ],
  vraag: {
    tekst: 'Je loopt even weg bij je laptop of telefoon. Wat doe je?',
    opties: [
      { id: 'a', tekst: 'Ik vergrendel het scherm', correct: true },
      { id: 'b', tekst: 'Ik laat alles gewoon open staan' },
      { id: 'c', tekst: 'Ik vraag niemand om op te letten en ga weg' }
    ],
    uitlegGoed: 'Precies! Vergrendel je scherm altijd, dan kan niemand bij jouw account.',
    uitlegFout: 'Niet slim: iemand anders kan dan bij jouw bestanden en berichten. Vergrendel altijd je scherm.'
  }
};
