// Toetsenbordkaart voor Data Koerier: QWERTY (US-International, zoals op
// Nederlandse school-Chromebooks) met vinger- en handtoewijzing.
// Puur data + kleine pure helpers, geen React.

export const HANDEN = { LINKS: 'links', RECHTS: 'rechts', DUIM: 'duim' };

// Vingers per hand, van pink (1) naar wijsvinger (4); duim = 0.
// kleurIndex verwijst naar VINGER_KLEUREN zodat beide handen gespiegeld kleuren.
export const VINGERS = {
  'links-pink': { hand: HANDEN.LINKS, label: 'linkerpink', kleurIndex: 0 },
  'links-ring': { hand: HANDEN.LINKS, label: 'linkerringvinger', kleurIndex: 1 },
  'links-middel': { hand: HANDEN.LINKS, label: 'linkermiddelvinger', kleurIndex: 2 },
  'links-wijs': { hand: HANDEN.LINKS, label: 'linkerwijsvinger', kleurIndex: 3 },
  'rechts-wijs': { hand: HANDEN.RECHTS, label: 'rechterwijsvinger', kleurIndex: 3 },
  'rechts-middel': { hand: HANDEN.RECHTS, label: 'rechtermiddelvinger', kleurIndex: 2 },
  'rechts-ring': { hand: HANDEN.RECHTS, label: 'rechterringvinger', kleurIndex: 1 },
  'rechts-pink': { hand: HANDEN.RECHTS, label: 'rechterpink', kleurIndex: 0 },
  duim: { hand: HANDEN.DUIM, label: 'duim', kleurIndex: 4 }
};

// Zachte, kleurenblind-onderscheidbare tinten (pink -> wijsvinger -> duim).
// Feedback in het spel leunt nooit op kleur alleen (ook labels/vormen).
export const VINGER_KLEUREN = ['#c4b5fd', '#93c5fd', '#6ee7b7', '#fcd34d', '#fda4af'];

// char (kleine letter/cijfer/leesteken) -> vinger-id.
export const TOETS_VINGER = {
  q: 'links-pink', a: 'links-pink', z: 'links-pink', 1: 'links-pink',
  w: 'links-ring', s: 'links-ring', x: 'links-ring', 2: 'links-ring',
  e: 'links-middel', d: 'links-middel', c: 'links-middel', 3: 'links-middel',
  r: 'links-wijs', f: 'links-wijs', v: 'links-wijs', 4: 'links-wijs',
  t: 'links-wijs', g: 'links-wijs', b: 'links-wijs', 5: 'links-wijs',
  y: 'rechts-wijs', h: 'rechts-wijs', n: 'rechts-wijs', 6: 'rechts-wijs',
  u: 'rechts-wijs', j: 'rechts-wijs', m: 'rechts-wijs', 7: 'rechts-wijs',
  i: 'rechts-middel', k: 'rechts-middel', ',': 'rechts-middel', 8: 'rechts-middel',
  o: 'rechts-ring', l: 'rechts-ring', '.': 'rechts-ring', 9: 'rechts-ring',
  p: 'rechts-pink', ';': 'rechts-pink', '/': 'rechts-pink', 0: 'rechts-pink',
  ' ': 'duim'
};

// Tekens die met Shift gemaakt worden -> basistoets waarop ze liggen.
export const SHIFT_TEKENS = { '?': '/', '!': '1', '@': '2' };

// Spreeknamen voor niet-lettertekens (voor hints, tips en voiceover).
export const TOETS_LABELS = {
  ' ': 'de spatiebalk',
  ';': 'de puntkomma',
  ',': 'de komma',
  '.': 'de punt',
  '/': 'de schuine streep',
  '?': 'het vraagteken',
  '!': 'het uitroepteken',
  '@': 'het apenstaartje'
};

export const HOME_TOETSEN = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];
export const VOELRAND_TOETSEN = ['f', 'j'];

// Rijen voor de visuele toetsenbordweergave (basistoetsen, kleine letters).
export const TOETSENBORD_RIJEN = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

// Normaliseert een te typen teken naar de fysieke basistoets (voor highlight).
export const basisToetsVoor = (teken) => {
  const klein = String(teken || '').toLowerCase();
  if (SHIFT_TEKENS[klein]) return SHIFT_TEKENS[klein];
  return klein;
};

// Welke vinger hoort bij dit te typen teken? -> vinger-id of null.
export const vingerVoor = (teken) => {
  const basis = basisToetsVoor(teken);
  return TOETS_VINGER[basis] || null;
};

// Heeft dit teken Shift nodig? Zo ja, met welke hand (altijd de ándere hand
// dan de hand die de lettertoets indrukt)? -> 'links' | 'rechts' | null.
export const shiftHandVoor = (teken) => {
  const origineel = String(teken || '');
  const isHoofdletter = /^[A-Z]$/.test(origineel);
  const isShiftTeken = Object.prototype.hasOwnProperty.call(SHIFT_TEKENS, origineel);
  if (!isHoofdletter && !isShiftTeken) return null;

  const vingerId = vingerVoor(origineel);
  const vinger = vingerId ? VINGERS[vingerId] : null;
  if (!vinger || vinger.hand === HANDEN.DUIM) return null;
  return vinger.hand === HANDEN.LINKS ? HANDEN.RECHTS : HANDEN.LINKS;
};

// Korte vingerinstructie voor de hint-balk, bijv. "de R met je linkerwijsvinger".
export const vingerInstructie = (teken) => {
  const vingerId = vingerVoor(teken);
  if (!vingerId) return null;
  const vinger = VINGERS[vingerId];
  const shiftHand = shiftHandVoor(teken);
  const toetsLabel = TOETS_LABELS[teken] || `de ${String(teken).toUpperCase()}`;
  const basis = `${toetsLabel} met je ${vinger.label}`;
  if (!shiftHand) return basis;
  return `${basis}, Shift met je ${shiftHand === HANDEN.LINKS ? 'linker' : 'rechter'}pink`;
};
