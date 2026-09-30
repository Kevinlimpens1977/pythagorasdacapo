// Voorwerpen voor de onderdompelmethode, in de comicstijl van het deck:
// dikke zwarte contour, warme vlakken. (x, y) is het midden van de onderkant.

const INK = '#0B0D0F';

// Gegenereerde voorwerpen (Higgsfield, gpt_image_2_5, deckstijl). Zonder beeld valt de SVG-vorm terug.
const BEELD_PAD = '/games/volume-berekenen';
const BEELDEN = {
  steen: { b: 72, h: 72 },
  sleutel: { b: 56, h: 56 },
  knikker: { b: 34, h: 34 },
  schroef: { b: 50, h: 50 },
  dobbelsteen: { b: 40, h: 40 },
  poppetje: { b: 70, h: 104 },
  kurk: { b: 40, h: 40 }
};

function Vorm({ vorm }) {
  const beeld = BEELDEN[vorm];
  if (beeld) {
    return <image href={`${BEELD_PAD}/${vorm}.png`} x={-beeld.b / 2} y={-beeld.h} width={beeld.b} height={beeld.h} preserveAspectRatio="xMidYMax meet" />;
  }
  switch (vorm) {
    case 'steen':
      return (
        <g>
          <path d="M -24 0 L -28 -14 L -18 -30 L 2 -34 L 20 -26 L 27 -10 L 20 0 Z" fill="#8C8C8C" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M -14 -22 L -2 -26 M 6 -12 L 16 -16" stroke="#5f5f5f" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case 'sleutel':
      return (
        <g>
          <circle cx="0" cy="-44" r="11" fill="#E0B43A" stroke={INK} strokeWidth="3" />
          <circle cx="0" cy="-44" r="4.5" fill="#FFF7E8" stroke={INK} strokeWidth="2" />
          <rect x="-3.5" y="-34" width="7" height="34" fill="#E0B43A" stroke={INK} strokeWidth="2.5" />
          <path d="M 3 -10 h 8 v 4 h -4 v 4 h -4" fill="#E0B43A" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
    case 'knikker':
      return (
        <g>
          <circle cx="0" cy="-13" r="13" fill="#5BB3E6" stroke={INK} strokeWidth="3" />
          <path d="M -8 -18 q 6 6 0 12 M 4 -22 q -6 8 2 16" fill="none" stroke="#1d5f8a" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="-5" cy="-19" r="3" fill="#fff" opacity="0.8" />
        </g>
      );
    case 'schroef':
      return (
        <g>
          <rect x="-12" y="-44" width="24" height="7" rx="2" fill="#B8B8B8" stroke={INK} strokeWidth="2.5" />
          <path d="M -5 -37 L -5 -6 L 0 0 L 5 -6 L 5 -37 Z" fill="#B8B8B8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M -5 -30 l 10 -3 M -5 -23 l 10 -3 M -5 -16 l 10 -3" stroke={INK} strokeWidth="1.5" />
        </g>
      );
    case 'dobbelsteen':
      return (
        <g>
          <rect x="-16" y="-32" width="32" height="32" rx="5" fill="#ffffff" stroke={INK} strokeWidth="3" />
          {[[-8, -24], [8, -24], [0, -16], [-8, -8], [8, -8]].map(([cx, cy]) => (
            <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3" fill={INK} />
          ))}
        </g>
      );
    case 'poppetje':
      return (
        <g>
          <circle cx="0" cy="-96" r="11" fill="#F4C095" stroke={INK} strokeWidth="3" />
          <rect x="-13" y="-84" width="26" height="42" rx="6" fill="#D83A2E" stroke={INK} strokeWidth="3" />
          <rect x="-12" y="-44" width="10" height="44" rx="3" fill="#087EB5" stroke={INK} strokeWidth="2.5" />
          <rect x="2" y="-44" width="10" height="44" rx="3" fill="#087EB5" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'kurk':
      return (
        <g>
          <path d="M -15 -26 L 15 -26 L 12 0 L -12 0 Z" fill="#C8955A" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="-4" cy="-16" r="1.8" fill="#8a5a2b" />
          <circle cx="6" cy="-8" r="1.5" fill="#8a5a2b" />
          <circle cx="2" cy="-19" r="1.2" fill="#8a5a2b" />
        </g>
      );
    case 'druif':
      return (
        <g>
          <ellipse cx="0" cy="-13" rx="11" ry="13" fill="#7B3F8C" stroke={INK} strokeWidth="3" />
          <ellipse cx="-4" cy="-18" rx="3" ry="4" fill="#ffffff" opacity="0.5" />
          <path d="M 0 -26 q 2 -6 6 -8" fill="none" stroke="#3E6B2F" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'ijsblokje':
      return (
        <g>
          <rect x="-14" y="-28" width="28" height="28" rx="5" fill="#E8F6FC" fillOpacity="0.85" stroke={INK} strokeWidth="3" />
          <path d="M -8 -22 l 6 0 M -8 -17 l 3 0" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'gum':
      return (
        <g>
          <rect x="-16" y="-14" width="32" height="14" rx="3" fill="#F29BB5" stroke={INK} strokeWidth="3" />
          <rect x="-16" y="-14" width="12" height="14" rx="3" fill="#6FA8DC" stroke={INK} strokeWidth="3" />
        </g>
      );
    case 'naald':
      return (
        <g>
          <line x1="0" y1="-4" x2="0" y2="-190" stroke="#8C8C8C" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="-4" x2="0" y2="-190" stroke={INK} strokeWidth="1" strokeLinecap="round" />
          <rect x="-7" y="-214" width="14" height="26" rx="4" fill="#D83A2E" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'zinker':
      return (
        <g>
          <rect x="-16" y="-24" width="32" height="24" rx="3" fill="#5B6068" stroke={INK} strokeWidth="3" />
          <path d="M -9 -24 q 9 -12 18 0" fill="none" stroke={INK} strokeWidth="2.5" />
        </g>
      );
    case 'blokje':
      return (
        <g>
          <rect x="-15" y="-30" width="30" height="30" fill="#2E9D63" stroke={INK} strokeWidth="3" />
          <path d="M -15 -30 l 7 -7 h 30 l -7 7 Z M 15 -30 l 7 -7 v 30 l -7 7 Z" fill="#237A4D" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      );
    default:
      return null;
  }
}

export default function Voorwerp({ vorm, x = 110, y = 470, schaal = 1, stijl }) {
  return (
    <g style={stijl}>
      <g transform={`translate(${x} ${y}) scale(${schaal})`}>
        <Vorm vorm={vorm} />
      </g>
    </g>
  );
}

export function VoorwerpIcoon({ vorm, className = 'h-16 w-16' }) {
  const hoog = vorm === 'poppetje' ? 110 : 60;
  return (
    <svg viewBox={`-35 ${-hoog} 70 ${hoog + 6}`} className={className} role="img" aria-label={vorm}>
      <Vorm vorm={vorm} />
    </svg>
  );
}
