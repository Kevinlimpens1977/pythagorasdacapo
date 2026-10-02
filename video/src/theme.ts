// Vaste tokens uit het HELIX-designsysteem (p.6-8). Wijzig hier, niet per scène.
export const KLEUR = {
  ink: '#0B0D0F',
  paper: '#FFF7E8',
  geel: '#FFD33D',
  blauw: '#087EB5',
  groen: '#2E9D63',
  water: '#9FD3EA',
  paneel: '#E9F3F2',
  zacht: '#B9B2A3',
  wit: '#FFFFFF',
  metaal: '#C9CED6',
  donker: '#2E3238',
  display: '#DDEFE3',
} as const;

export const MAAT = {
  marge: 96,
  titelHoogte: 124,
  titelRand: 8,
  vlakBoven: 176,
  vlakHoogte: 660,
  ondertitelGrens: 884,
} as const;

export const LIJN = 8;

export const KOLOM = {
  links: { x: 96, w: 620 },
  midden: { x: 736, w: 620 },
  rechts: { x: 1376, w: 448 },
  breed: { x: 96, w: 1728 },
} as const;
