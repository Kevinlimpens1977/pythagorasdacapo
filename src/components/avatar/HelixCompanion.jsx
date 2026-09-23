import { useId } from 'react';
import { COMPANION_KLEUREN, normaliseerCompanion } from '../../lib/companion';

// De companion (fase 5) in de 3D-cartoonstijl van de avatar: zachte verlopen,
// grote ogen. Stadium 1 is een ei; daarna groeit het maatje in vier stappen.

function mix(hex, doel, t) {
  const naarRgb = (waarde) => [1, 3, 5].map((start) => parseInt(waarde.slice(start, start + 2), 16));
  const [a, b] = [naarRgb(hex), naarRgb(doel)];
  return `#${a.map((kanaal, i) => Math.round(kanaal + (b[i] - kanaal) * t).toString(16).padStart(2, '0')).join('')}`;
}
const licht = (kleur, t) => mix(kleur, '#ffffff', t);
const donker = (kleur, t) => mix(kleur, '#000000', t);

function Ogen({ y = 50, afstand = 9, grootte = 6 }) {
  return (
    <g>
      {[-1, 1].map((kant) => {
        const x = 50 + kant * afstand;
        return (
          <g key={kant}>
            <ellipse cx={x} cy={y} rx={grootte} ry={grootte * 1.12} fill="#FFFFFF" />
            <circle cx={x + 0.6} cy={y + 0.8} r={grootte * 0.62} fill="#241812" />
            <circle cx={x + 2} cy={y - 1.4} r={grootte * 0.26} fill="#FFFFFF" />
            <circle cx={x - 1} cy={y + 2.2} r={grootte * 0.12} fill="#FFFFFF" opacity="0.8" />
          </g>
        );
      })}
    </g>
  );
}

function Mond({ y = 60, breed = 6 }) {
  return (
    <path d={`M${50 - breed} ${y} C ${50 - breed / 2} ${y + breed * 0.9}, ${50 + breed / 2} ${y + breed * 0.9}, ${50 + breed} ${y} Z`} fill="#5A1E1E" />
  );
}

function Blos({ y = 57, afstand = 15 }) {
  return (
    <g opacity="0.35">
      <ellipse cx={50 - afstand} cy={y} rx="4" ry="2.5" fill="#FF6F8A" />
      <ellipse cx={50 + afstand} cy={y} rx="4" ry="2.5" fill="#FF6F8A" />
    </g>
  );
}

function Ei({ soort, kleur, id }) {
  return (
    <g>
      <ellipse cx="50" cy="56" rx="24" ry="30" fill={`url(#${id}-lijf)`} stroke={donker(kleur, 0.35)} strokeWidth="1.2" />
      {soort === 'robot' && [[42, 44], [58, 50], [46, 66], [60, 70]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.4" fill={licht(kleur, 0.5)} stroke={donker(kleur, 0.3)} strokeWidth="0.8" />
      ))}
      {soort === 'draak' && [[42, 46], [56, 42], [50, 60], [40, 68], [60, 66]].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x - 4} ${y + 2} Q ${x} ${y - 4} ${x + 4} ${y + 2}`} fill={licht(kleur, 0.45)} />
      ))}
      {soort === 'atoom' && (
        <ellipse cx="50" cy="58" rx="32" ry="9" fill="none" stroke={licht(kleur, 0.55)} strokeWidth="2" transform="rotate(-18 50 58)" />
      )}
      <ellipse cx="42" cy="40" rx="6" ry="9" fill="#FFFFFF" opacity="0.35" transform="rotate(-20 42 40)" />
    </g>
  );
}

function Robot({ kleur, stadium, id }) {
  return (
    <g>
      {stadium >= 3 && (
        <g>
          <path d="M50 26 V 16" stroke={donker(kleur, 0.3)} strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="14" r="3.5" fill={stadium >= 5 ? '#FFD33D' : licht(kleur, 0.4)} />
          {stadium >= 5 && <circle cx="50" cy="14" r="7" fill="#FFD33D" opacity="0.3" />}
        </g>
      )}
      {stadium >= 3 && (
        <g fill={`url(#${id}-lijf)`} stroke={donker(kleur, 0.35)} strokeWidth="1.2">
          <rect x="18" y="58" width="9" height="18" rx="4.5" transform="rotate(12 22 60)" />
          <rect x="73" y="58" width="9" height="18" rx="4.5" transform="rotate(-12 78 60)" />
        </g>
      )}
      <rect x="26" y="26" width="48" height="56" rx="16" fill={`url(#${id}-lijf)`} stroke={donker(kleur, 0.35)} strokeWidth="1.2" />
      <rect x="31" y="34" width="38" height="28" rx="10" fill="#1B2330" />
      <Ogen y={47} afstand={9} grootte={5.5} />
      <path d="M45 56 Q 50 59 55 56" stroke="#7FE3FF" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {stadium >= 4 && <circle cx="50" cy="72" r="4" fill={stadium >= 5 ? '#FF6F8A' : licht(kleur, 0.5)} stroke={donker(kleur, 0.3)} strokeWidth="0.8" />}
      <ellipse cx="36" cy="32" rx="6" ry="3" fill="#FFFFFF" opacity="0.3" />
    </g>
  );
}

function Draak({ kleur, stadium, id }) {
  const buik = licht(kleur, 0.55);
  return (
    <g>
      {stadium >= 4 && (
        <g fill={licht(kleur, 0.2)} stroke={donker(kleur, 0.35)} strokeWidth="1.2" strokeLinejoin="round">
          <path d={`M30 52 C ${stadium >= 5 ? 6 : 14} 34, ${stadium >= 5 ? 4 : 12} 56, 26 64 Z`} />
          <path d={`M70 52 C ${stadium >= 5 ? 94 : 86} 34, ${stadium >= 5 ? 96 : 88} 56, 74 64 Z`} />
        </g>
      )}
      <path d="M70 76 C 84 78, 88 70, 90 62 C 86 68, 80 70, 72 70 Z" fill={`url(#${id}-lijf)`} stroke={donker(kleur, 0.35)} strokeWidth="1.2" />
      {stadium >= 3 && (
        <g fill="#F4E3B5" stroke="#B89A55" strokeWidth="1">
          <path d="M36 30 L 32 16 L 42 26 Z" />
          <path d="M64 30 L 68 16 L 58 26 Z" />
        </g>
      )}
      <ellipse cx="50" cy="58" rx="27" ry="28" fill={`url(#${id}-lijf)`} stroke={donker(kleur, 0.35)} strokeWidth="1.2" />
      <ellipse cx="50" cy="68" rx="15" ry="14" fill={buik} opacity="0.9" />
      {[62, 68, 74].map((y) => <path key={y} d={`M40 ${y} Q 50 ${y + 2.5} 60 ${y}`} stroke={donker(buik, 0.15)} strokeWidth="0.8" fill="none" />)}
      <Ogen y={48} afstand={10} grootte={6.5} />
      <Blos y={56} afstand={17} />
      <Mond y={57} breed={5} />
      <ellipse cx="38" cy="38" rx="7" ry="4" fill="#FFFFFF" opacity="0.3" transform="rotate(-25 38 38)" />
    </g>
  );
}

function Atoom({ kleur, stadium, id }) {
  const ringen = Math.max(1, stadium - 1);
  return (
    <g>
      {stadium >= 5 && <circle cx="50" cy="54" r="40" fill={`url(#${id}-gloed)`} />}
      <circle cx="50" cy="54" r="24" fill={`url(#${id}-lijf)`} stroke={donker(kleur, 0.35)} strokeWidth="1.2" />
      <Ogen y={51} afstand={8.5} grootte={5.5} />
      <Blos y={59} afstand={14} />
      <Mond y={60} breed={4.5} />
      {Array.from({ length: ringen }, (_, i) => {
        const hoek = [-25, 30, 85, 145][i];
        return (
          <g key={hoek} transform={`rotate(${hoek} 50 54)`}>
            <ellipse cx="50" cy="54" rx="40" ry="11" fill="none" stroke={licht(kleur, 0.35)} strokeWidth="2" opacity="0.9" />
            <circle cx="90" cy="54" r="3.5" fill={licht(kleur, 0.7)} stroke={donker(kleur, 0.2)} strokeWidth="0.8" />
          </g>
        );
      })}
      <ellipse cx="42" cy="42" rx="6" ry="3.5" fill="#FFFFFF" opacity="0.35" transform="rotate(-25 42 42)" />
    </g>
  );
}

const SCHAAL = { 2: 0.62, 3: 0.76, 4: 0.9, 5: 1 };

// companion: { soort, kleur }; stadium 1-5 (zie companionStadium).
export default function HelixCompanion({ companion, stadium = 1, className = '', titel = 'Companion' }) {
  const id = useId().replace(/:/g, '');
  const c = normaliseerCompanion(companion);
  const kleur = (COMPANION_KLEUREN.find((optie) => optie.id === c.kleur) || COMPANION_KLEUREN[0]).kleur;
  const soort = c.soort || 'robot';
  const schaal = SCHAAL[stadium] || 1;
  const Figuur = { robot: Robot, draak: Draak, atoom: Atoom }[soort];

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={titel}>
      <defs>
        <radialGradient id={`${id}-lijf`} cx="38%" cy="30%" r="75%">
          <stop offset="0" stopColor={licht(kleur, 0.35)} />
          <stop offset="0.55" stopColor={kleur} />
          <stop offset="1" stopColor={donker(kleur, 0.3)} />
        </radialGradient>
        <radialGradient id={`${id}-gloed`}>
          <stop offset="0" stopColor={licht(kleur, 0.5)} stopOpacity="0.6" />
          <stop offset="1" stopColor={kleur} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="91" rx={22 * (stadium === 1 ? 1 : schaal)} ry="4" fill="#000000" opacity="0.15" />
      {stadium <= 1 ? (
        <Ei soort={soort} kleur={kleur} id={id} />
      ) : (
        <g transform={`translate(${50 - 50 * schaal} ${88 - 88 * schaal}) scale(${schaal})`}>
          <Figuur kleur={kleur} stadium={stadium} id={id} />
        </g>
      )}
      {stadium === 2 && (
        <path d="M34 90 L 36 82 L 41 86 L 45 80 L 50 86 L 55 80 L 59 86 L 64 82 L 66 90 Z" fill="#F7F1E3" stroke="#CFC4A8" strokeWidth="1" strokeLinejoin="round" />
      )}
    </svg>
  );
}
