// Bonuslevel - Het grote mediafestival. Extra druk, met 12 bonuswoorden.
export const LEVEL_4_BONUSFESTIVAL = {
  id: 'bonusfestival',
  nummer: 4,
  bonus: true,
  titel: 'Het grote mediafestival',
  subtitel: 'Bonusronde! Twaalf bonuswoorden verstopt in een festivaldrukte.',
  achtergrond: 'level4/achtergrond.webp',
  fallbackKleur: 'from-amber-100 to-sky-50',
  objecten: [
    {
      id: 'smartwatch',
      naam: 'Smartwatch',
      emoji: '⌚',
      x: 8.6, y: 69.5, breedte: 10, hoogte: 17,
      hint: 'Hij ligt in een glazen vitrine, links vooraan.',
      ariaLabel: 'Smartwatch in een vitrine links'
    },
    {
      id: 'vr-bril',
      naam: 'VR-bril',
      emoji: '🥽',
      x: 28, y: 87.5, breedte: 12, hoogte: 13,
      hint: 'De witte bril ligt op de gele tafel, vooraan.',
      ariaLabel: 'VR-bril op een gele tafel'
    },
    {
      id: 'drone',
      naam: 'Drone',
      emoji: '🛸',
      x: 67, y: 9.5, breedte: 10, hoogte: 11,
      hint: 'Kijk omhoog: hij vliegt in de lucht.',
      ariaLabel: 'Vliegende drone in de lucht'
    },
    {
      id: 'powerbank',
      naam: 'Powerbank',
      emoji: '🔋',
      x: 48, y: 84, breedte: 9, hoogte: 16,
      hint: 'Zwart met een bliksem, op een standaard vooraan.',
      ariaLabel: 'Powerbank op een standaard'
    },
    {
      id: 'router',
      naam: 'Router',
      emoji: '📡',
      x: 68, y: 88.5, breedte: 12, hoogte: 13,
      hint: 'Het kastje met antennes en wifi-strepen, op de oranje tafel.',
      ariaLabel: 'Wifi-router op een tafel'
    },
    {
      id: 'spelcontroller',
      naam: 'Spelcontroller',
      emoji: '🎮',
      x: 89, y: 78, breedte: 9, hoogte: 13,
      hint: 'De échte controller staat op de verlichte standaard rechts vooraan (niet die op de poster!).',
      ariaLabel: 'Spelcontroller op een standaard rechts'
    },
    {
      id: 'selfiestick',
      naam: 'Selfiestick',
      emoji: '🤳',
      x: 52.5, y: 20, breedte: 9, hoogte: 17,
      hint: 'Iemand steekt hem hoog in de lucht, midden in beeld.',
      ariaLabel: 'Selfiestick met telefoon in de lucht'
    },
    {
      id: 'cloud',
      naam: 'Cloud',
      emoji: '☁️',
      x: 67.5, y: 30, breedte: 8, hoogte: 12,
      hint: 'Een witte wolk op het blauwe spandoek.',
      ariaLabel: 'Wolk-symbool op een spandoek'
    },
    {
      id: 'cookie',
      naam: 'Cookie',
      emoji: '🍪',
      x: 87, y: 29.5, breedte: 9, hoogte: 11,
      hint: 'Een reuzenkoek op het bord van de kraam rechts bovenin.',
      ariaLabel: 'Cookie op een bord bij de kraam'
    },
    {
      id: 'robot',
      naam: 'Robot (AI)',
      emoji: '🤖',
      x: 60, y: 67, breedte: 7, hoogte: 15,
      hint: 'Een klein wit robotje staat tussen de mensen.',
      ariaLabel: 'Kleine robot tussen de mensen'
    },
    {
      id: 'envelop',
      naam: 'E-mail',
      emoji: '✉️',
      x: 78, y: 60.5, breedte: 8, hoogte: 11,
      hint: 'Een witte envelop op een paaltje, rechts van het midden.',
      ariaLabel: 'Envelop op een paaltje'
    },
    {
      id: 'oordopjes',
      naam: 'Oordopjes',
      emoji: '🎧',
      x: 93.5, y: 65, breedte: 7, hoogte: 11,
      hint: 'Oranje oordopjes op een display, helemaal rechts.',
      ariaLabel: 'Oordopjes op een display rechts'
    }
  ],
  vraag: {
    tekst: 'Je zag een cookie op het festival. Wat is een cookie op internet?',
    opties: [
      { id: 'a', tekst: 'Een klein bestandje dat onthoudt wat jij op een website doet', correct: true },
      { id: 'b', tekst: 'Een koekje dat je bij de computer eet' },
      { id: 'c', tekst: 'Een computervirus dat je telefoon kapotmaakt' }
    ],
    uitlegGoed: 'Klopt! Daarom vragen websites of je cookies accepteert: ze onthouden wat jij doet. Kies bewust wat je toestaat.',
    uitlegFout: 'Een internetcookie is een klein bestandje dat onthoudt wat jij op een website doet. Daarom mag je zelf kiezen of je ze accepteert.'
  }
};
