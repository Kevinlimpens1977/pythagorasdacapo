import { useId } from 'react';
import {
  HAARKLEUREN, HUIDSKLEUREN, kleurVan, normaliseerAvatar, STOFKLEUREN
} from '../../lib/avatarDelen';

// De HELIX-avatar als eigen tekenset (Shop 2.0, deel 2B). Stijl: 3D-cartoon,
// zoals een animatiefilm. Zachte verlopen in plaats van dikke contouren, grote
// ogen met lichtpuntjes, glans op haar en stof. De tekening is 200x200; wie hem
// rond wil, zet hem in een ronde container.

function mix(hex, doel, t) {
  const naarRgb = (waarde) => [1, 3, 5].map((start) => parseInt(waarde.slice(start, start + 2), 16));
  const [a, b] = [naarRgb(hex), naarRgb(doel)];
  return `#${a.map((kanaal, i) => Math.round(kanaal + (b[i] - kanaal) * t).toString(16).padStart(2, '0')).join('')}`;
}
const licht = (kleur, t) => mix(kleur, '#ffffff', t);
const donker = (kleur, t) => mix(kleur, '#000000', t);

// Een bol verloop: licht links boven, donker aan de rand.
function Bol({ id, kleur, cx = '38%', cy = '30%', r = '75%' }) {
  return (
    <radialGradient id={id} cx={cx} cy={cy} r={r}>
      <stop offset="0" stopColor={licht(kleur, 0.28)} />
      <stop offset="0.5" stopColor={kleur} />
      <stop offset="1" stopColor={donker(kleur, 0.3)} />
    </radialGradient>
  );
}

// Een vorm met verloop en een zachte, iets donkerdere rand.
const vorm = (gradientId, kleur) => ({
  fill: `url(#${gradientId})`,
  stroke: donker(kleur, 0.35),
  strokeWidth: 1.5,
  strokeLinejoin: 'round'
});

function Achtergrond({ soort, kleur, id }) {
  switch (soort) {
    case 'achtergrond-strepen':
      return (
        <g>
          <defs><Bol id={`${id}-bg`} kleur="#FFC21A" cx="50%" cy="45%" r="70%" /></defs>
          <rect width="200" height="200" fill={`url(#${id}-bg)`} />
          {Array.from({ length: 16 }, (_, i) => {
            const hoek = (i / 16) * Math.PI * 2;
            return <path key={i} d={`M100 90 L${100 + Math.cos(hoek) * 160} ${90 + Math.sin(hoek) * 160} L${100 + Math.cos(hoek + 0.13) * 160} ${90 + Math.sin(hoek + 0.13) * 160} Z`} fill="#FFFFFF" opacity="0.22" />;
          })}
        </g>
      );
    case 'achtergrond-sterren':
      return (
        <g>
          <defs>
            <radialGradient id={`${id}-bg`} cx="70%" cy="20%" r="100%">
              <stop offset="0" stopColor="#3A4C9A" />
              <stop offset="1" stopColor="#0E1433" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill={`url(#${id}-bg)`} />
          {[[24, 30, 1], [60, 18, 0.7], [170, 26, 0.6], [150, 70, 0.8], [30, 80, 0.9], [178, 110, 0.6], [16, 140, 0.7], [60, 50, 0.5], [130, 20, 0.8]].map(([x, y, s], i) => (
            <g key={i} opacity={0.5 + s * 0.5}>
              <circle cx={x} cy={y} r={6 * s} fill="#FFE9A8" opacity="0.25" />
              <circle cx={x} cy={y} r={1.8 * s + 0.6} fill="#FFFFFF" />
            </g>
          ))}
          <circle cx="160" cy="40" r="18" fill="#FFF4D6" opacity="0.18" />
          <circle cx="160" cy="40" r="11" fill="#FFF4D6" />
          <circle cx="164" cy="37" r="10" fill="#1F2A5E" />
        </g>
      );
    case 'achtergrond-zonsondergang':
      return (
        <g>
          <defs>
            <linearGradient id={`${id}-bg`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#5B2E9E" />
              <stop offset="0.5" stopColor="#E0619E" />
              <stop offset="1" stopColor="#FF9A3C" />
            </linearGradient>
            <radialGradient id={`${id}-zon`}>
              <stop offset="0" stopColor="#FFF3B0" />
              <stop offset="0.6" stopColor="#FFD33D" />
              <stop offset="1" stopColor="#FFD33D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill={`url(#${id}-bg)`} />
          <circle cx="100" cy="150" r="60" fill={`url(#${id}-zon)`} />
        </g>
      );
    case 'achtergrond-lab':
      return (
        <g>
          <defs>
            <linearGradient id={`${id}-bg`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#EAF8F8" />
              <stop offset="1" stopColor="#B8E0E0" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill={`url(#${id}-bg)`} />
          <rect y="58" width="200" height="5" fill="#8CC2C2" opacity="0.7" />
          <rect y="118" width="200" height="5" fill="#8CC2C2" opacity="0.7" />
          {[[22, 58, '#2E9D63'], [48, 58, '#087EB5'], [160, 58, '#E86AA6'], [182, 118, '#FFB400'], [18, 118, '#793AC7']].map(([x, y, kleur], i) => (
            <g key={i} opacity="0.85">
              <path d={`M${x - 5} ${y - 26} h10 v8 l8 16 a3 3 0 0 1 -3 4 h-20 a3 3 0 0 1 -3 -4 l8 -16 Z`} fill="#FFFFFF" fillOpacity="0.55" stroke={donker(kleur, 0.2)} strokeWidth="1.2" />
              <path d={`M${x - 10} ${y - 8} h20 l3 6 a3 3 0 0 1 -3 4 h-20 a3 3 0 0 1 -3 -4 Z`} fill={kleur} opacity="0.85" />
              <path d={`M${x - 2} ${y - 24} v8`} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </g>
          ))}
        </g>
      );
    case 'achtergrond-code':
      return (
        <g>
          <defs>
            <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="80%">
              <stop offset="0" stopColor="#15301F" />
              <stop offset="1" stopColor="#050C07" />
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill={`url(#${id}-bg)`} />
          {Array.from({ length: 9 }, (_, kolom) => (
            <text key={kolom} x={10 + kolom * 22} y={16 + (kolom % 3) * 9} fill="#3DDC84" fontSize="11" fontFamily="monospace" opacity={0.35 + (kolom % 3) * 0.2}>
              {Array.from({ length: 14 }, (__, rij) => (
                <tspan key={rij} x={10 + kolom * 22} dy={rij === 0 ? 0 : 14}>{(kolom * 7 + rij * 3) % 2}</tspan>
              ))}
            </text>
          ))}
        </g>
      );
    default:
      return (
        <g>
          <defs><Bol id={`${id}-bg`} kleur={kleur} cx="50%" cy="35%" r="80%" /></defs>
          <rect width="200" height="200" fill={`url(#${id}-bg)`} />
          <circle cx="36" cy="40" r="16" fill="#FFFFFF" opacity="0.12" />
          <circle cx="170" cy="60" r="10" fill="#FFFFFF" opacity="0.1" />
          <circle cx="160" cy="160" r="22" fill="#FFFFFF" opacity="0.08" />
        </g>
      );
  }
}

function HaarAchter({ soort, haar, id }) {
  const vul = vorm(`${id}-haar`, haar);
  switch (soort) {
    case 'kapsel-lang':
      return <path d="M56 92 C 48 44, 152 44, 144 92 C 150 120, 156 146, 152 170 C 128 178, 72 178, 48 170 C 44 146, 50 120, 56 92 Z" {...vul} />;
    case 'kapsel-staart':
      return <path d="M136 84 C 172 78, 176 128, 158 150 C 154 132, 150 112, 136 104 Z" {...vul} />;
    case 'kapsel-afro':
      return <circle cx="100" cy="80" r="62" {...vul} />;
    case 'kapsel-vlechten':
      return (
        <g>
          {[58, 142].map((x) => (
            <g key={x}>
              {[100, 118, 136, 154].map((y) => <ellipse key={y} cx={x} cy={y} rx="9" ry="10" {...vul} />)}
              <circle cx={x} cy="168" r="4" fill="#FFD33D" stroke={donker('#FFD33D', 0.3)} strokeWidth="1" />
            </g>
          ))}
        </g>
      );
    default:
      return null;
  }
}

function Kleding({ soort, kleur, id }) {
  const romp = 'M26 200 C 30 164, 60 148, 100 148 C 140 148, 170 164, 174 200 Z';
  const plooien = (
    <path d="M58 172 C 62 182, 60 192, 58 200 M142 172 C 138 182, 140 192, 142 200" fill="none" stroke="#000000" strokeWidth="3" opacity="0.1" strokeLinecap="round" />
  );
  const stof = vorm(`${id}-kleding`, kleur);
  switch (soort) {
    case 'kleding-hoodie':
      return (
        <g>
          <path d={romp} {...stof} />
          {plooien}
          <path d="M68 150 C 72 178, 128 178, 132 150 C 124 160, 76 160, 68 150 Z" fill={donker(kleur, 0.18)} />
          <path d="M92 168 C 91 176, 92 184, 91 190 M108 168 C 109 176, 108 184, 109 190" stroke="#F4F1EA" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="91" cy="191" r="2.2" fill="#F4F1EA" />
          <circle cx="109" cy="191" r="2.2" fill="#F4F1EA" />
        </g>
      );
    case 'kleding-trui':
      return (
        <g>
          <path d={romp} {...stof} />
          {plooien}
          <path d="M38 176 C 70 172, 130 172, 162 176 L 166 188 C 130 184, 70 184, 34 188 Z" fill="#F4F1EA" opacity="0.92" />
          <path d="M82 149 C 88 162, 112 162, 118 149" fill="none" stroke={donker(kleur, 0.25)} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case 'kleding-sport':
      return (
        <g>
          <path d={romp} {...stof} />
          {plooien}
          <path d="M84 150 L 100 172 L 116 150 Z" fill="#F4F1EA" />
          <path d="M44 172 L 56 200 M156 172 L 144 200" stroke="#F4F1EA" strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'kleding-jas':
      return (
        <g>
          <path d={romp} {...stof} />
          {[168, 182, 196].map((y) => (
            <path key={y} d={`M${34 + (y - 168) * 0.2} ${y} C 70 ${y - 5}, 130 ${y - 5}, ${166 - (y - 168) * 0.2} ${y}`} fill="none" stroke={donker(kleur, 0.3)} strokeWidth="1.5" opacity="0.7" />
          ))}
          <path d="M100 152 V200" stroke={donker(kleur, 0.35)} strokeWidth="2" />
          <path d="M76 146 C 84 162, 116 162, 124 146 L 126 158 C 112 170, 88 170, 74 158 Z" {...stof} />
        </g>
      );
    case 'kleding-labjas':
      return (
        <g>
          <path d={romp} {...vorm(`${id}-wit`, '#F7F7F2')} />
          {plooien}
          <path d="M84 150 L 100 176 L 116 150 Z" fill="#2B90C8" />
          <path d="M84 150 L 76 200 M116 150 L 124 200" fill="none" stroke="#C9CBC4" strokeWidth="2" />
          <rect x="130" y="176" width="20" height="14" rx="3" fill="#EDEDE6" stroke="#C9CBC4" strokeWidth="1.2" />
          <path d="M136 171 v8" stroke="#D83A2E" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'kleding-hacker':
      return (
        <g>
          <path d={romp} {...vorm(`${id}-donker`, '#26292E')} />
          {plooien}
          <path d="M68 150 C 72 178, 128 178, 132 150 C 124 160, 76 160, 68 150 Z" fill="#17191C" />
          <text x="100" y="194" textAnchor="middle" fill="#3DDC84" fontSize="15" fontWeight="700" fontFamily="monospace">{'</>'}</text>
        </g>
      );
    default:
      return (
        <g>
          <path d={romp} {...stof} />
          {plooien}
          <path d="M82 149 C 88 160, 112 160, 118 149" fill="none" stroke={donker(kleur, 0.22)} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
  }
}

function HaarVoor({ soort, haar, id }) {
  const vul = vorm(`${id}-haar`, haar);
  const glans = (d) => <path d={d} fill="none" stroke={licht(haar, 0.45)} strokeWidth="3" strokeLinecap="round" opacity="0.7" />;
  const kort = 'M60 90 C 56 56, 78 40, 100 40 C 124 40, 146 56, 140 92 C 132 70, 118 62, 100 64 C 84 64, 68 70, 60 90 Z';
  switch (soort) {
    case 'kapsel-kort':
    case 'kapsel-staart':
      return <g><path d={kort} {...vul} />{glans('M78 52 C 88 46, 100 45, 110 47')}</g>;
    case 'kapsel-lang':
      return <g><path d="M58 96 C 52 54, 80 40, 100 40 C 122 40, 150 54, 142 96 C 134 72, 116 60, 100 62 C 90 70, 74 76, 58 96 Z" {...vul} />{glans('M76 54 C 86 46, 98 45, 108 46')}</g>;
    case 'kapsel-knot':
      return (
        <g>
          <circle cx="100" cy="36" r="16" {...vul} />
          <path d={kort} {...vul} />
          {glans('M94 28 C 98 25, 104 25, 107 28')}
          {glans('M78 52 C 88 46, 100 45, 110 47')}
        </g>
      );
    case 'kapsel-stekels':
      return <g><path d="M60 90 L 60 62 L 72 70 L 76 44 L 90 58 L 100 34 L 110 56 L 124 42 L 128 66 L 142 60 L 140 92 C 128 70, 72 70, 60 90 Z" {...vul} />{glans('M96 46 L 100 38 M80 54 L 78 48')}</g>;
    case 'kapsel-krullen':
      return (
        <g>
          {[[64, 74], [70, 58], [84, 48], [100, 44], [116, 48], [130, 58], [136, 74], [78, 64], [100, 58], [122, 64]].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="13" {...vul} />
              <path d={`M${x - 6} ${y - 5} a7 7 0 0 1 8 -3`} fill="none" stroke={licht(haar, 0.45)} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </g>
          ))}
        </g>
      );
    case 'kapsel-kuif':
      return <g><path d="M58 92 C 50 54, 84 26, 122 30 C 156 34, 152 70, 142 92 C 134 66, 110 56, 86 64 C 72 70, 62 80, 58 92 Z" {...vul} />{glans('M88 40 C 100 33, 116 32, 128 36')}</g>;
    case 'kapsel-afro':
      return <path d="M60 92 C 58 70, 70 58, 100 56 C 130 58, 142 70, 140 92 C 128 76, 72 76, 60 92 Z" {...vul} />;
    case 'kapsel-vlechten':
      return (
        <g>
          <path d="M58 94 C 52 56, 80 40, 100 40 C 120 40, 148 56, 142 94 C 132 72, 110 62, 100 60 C 90 62, 68 72, 58 94 Z" {...vul} />
          <path d="M100 42 V60" stroke={donker(haar, 0.35)} strokeWidth="1.5" />
          {glans('M78 54 C 84 48, 92 46, 96 46')}
        </g>
      );
    case 'kapsel-buzz':
      return (
        <g>
          <path d="M62 84 C 62 58, 80 46, 100 46 C 120 46, 138 58, 138 84 C 128 70, 72 70, 62 84 Z" {...vul} opacity="0.92" />
          <path d="M72 64 L 84 58" stroke="#F4F1EA" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

function Accessoire({ soort, stof, id }) {
  const glasGlans = (x, y) => <path d={`M${x - 6} ${y - 3} l5 -5`} stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />;
  switch (soort) {
    case 'accessoire-bril':
      return (
        <g>
          <g fill="#FFFFFF" fillOpacity="0.15" stroke="#2A2D31" strokeWidth="2.8">
            <circle cx="84" cy="96" r="13" />
            <circle cx="116" cy="96" r="13" />
          </g>
          <path d="M97 95 C 99 92, 101 92, 103 95 M71 94 L 60 90 M129 94 L 140 90" fill="none" stroke="#2A2D31" strokeWidth="2.8" strokeLinecap="round" />
          {glasGlans(82, 92)}{glasGlans(114, 92)}
        </g>
      );
    case 'accessoire-zonnebril':
      return (
        <g>
          <defs>
            <linearGradient id={`${id}-zon`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#3B4048" />
              <stop offset="1" stopColor="#0E1013" />
            </linearGradient>
          </defs>
          <path d="M67 88 H97 V100 C 97 110, 69 110, 67 100 Z M103 88 H133 V100 C 131 110, 103 110, 103 100 Z" fill={`url(#${id}-zon)`} stroke="#0E1013" strokeWidth="2" strokeLinejoin="round" />
          <path d="M97 91 h6 M67 90 L 60 88 M133 90 L 140 88" stroke="#0E1013" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M72 92 l8 -2 M108 92 l8 -2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>
      );
    case 'accessoire-pet':
      return (
        <g>
          <defs><Bol id={`${id}-pet`} kleur={stof} /></defs>
          <path d="M60 78 C 58 44, 142 44, 140 78 Z" {...vorm(`${id}-pet`, stof)} />
          <path d="M58 78 C 80 72, 150 70, 166 82 C 150 88, 90 86, 58 82 Z" fill={donker(stof, 0.15)} stroke={donker(stof, 0.35)} strokeWidth="1.5" />
          <circle cx="100" cy="47" r="3.5" fill={donker(stof, 0.3)} />
          <path d="M78 58 C 86 52, 96 50, 104 50" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        </g>
      );
    case 'accessoire-koptelefoon':
      return (
        <g>
          <defs><Bol id={`${id}-kop`} kleur="#E0412F" /></defs>
          <path d="M58 98 C 50 40, 150 40, 142 98" fill="none" stroke="#2A2D31" strokeWidth="7" strokeLinecap="round" />
          <path d="M60 94 C 54 44, 146 44, 140 94" fill="none" stroke="#4A4F57" strokeWidth="2" strokeLinecap="round" />
          <rect x="46" y="86" width="20" height="30" rx="9" {...vorm(`${id}-kop`, '#E0412F')} />
          <rect x="134" y="86" width="20" height="30" rx="9" {...vorm(`${id}-kop`, '#E0412F')} />
        </g>
      );
    case 'accessoire-veiligheidsbril':
      return (
        <g>
          <path d="M56 92 L 144 92" stroke="#0D8F93" strokeWidth="5" strokeLinecap="round" />
          <rect x="65" y="83" width="70" height="24" rx="11" fill="#BDEBF2" fillOpacity="0.55" stroke="#5FB7C4" strokeWidth="2.2" />
          <path d="M72 90 l10 -4 M106 90 l10 -4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
        </g>
      );
    case 'accessoire-headset':
      return (
        <g>
          <path d="M60 96 C 54 44, 146 44, 140 96" fill="none" stroke="#2A2D31" strokeWidth="5" strokeLinecap="round" />
          <rect x="131" y="86" width="18" height="26" rx="8" fill="#3A3E45" stroke="#1B1D21" strokeWidth="1.5" />
          <path d="M140 110 C 136 128, 120 132, 108 128" fill="none" stroke="#2A2D31" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="106" cy="128" r="4.5" fill="#3DDC84" stroke="#1E7A45" strokeWidth="1" />
        </g>
      );
    case 'accessoire-kroon':
      return (
        <g>
          <defs>
            <linearGradient id={`${id}-goud`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#FFF0A0" />
              <stop offset="0.5" stopColor="#FFCB2E" />
              <stop offset="1" stopColor="#C98A00" />
            </linearGradient>
          </defs>
          <path d="M68 58 L 74 30 L 88 46 L 100 24 L 112 46 L 126 30 L 132 58 Z" fill={`url(#${id}-goud)`} stroke="#A06E00" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="100" cy="48" r="4" fill="#D83A2E" />
          <circle cx="82" cy="51" r="3" fill="#087EB5" />
          <circle cx="118" cy="51" r="3" fill="#2E9D63" />
        </g>
      );
    case 'accessoire-erlenmeyer':
      return (
        <g transform="translate(136 168)">
          <path d="M-5 -16 h10 v7 l9 16 a3 3 0 0 1 -3 4 h-22 a3 3 0 0 1 -3 -4 l9 -16 Z" fill="#FFE066" stroke="#B88A00" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M-11 2 h22 l2 4 a3 3 0 0 1 -3 4 h-20 a3 3 0 0 1 -3 -4 Z" fill="#FFB400" />
          <path d="M-2 -13 v8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.9" />
        </g>
      );
    case 'accessoire-code-bril':
      return (
        <g>
          <rect x="67" y="85" width="30" height="21" rx="5" fill="#0B1A10" stroke="#1B1D21" strokeWidth="2" />
          <rect x="103" y="85" width="30" height="21" rx="5" fill="#0B1A10" stroke="#1B1D21" strokeWidth="2" />
          <path d="M97 93 h6" stroke="#1B1D21" strokeWidth="2.5" />
          <path d="M71 92 h12 M71 98 h18 M107 92 h16 M107 98 h10" stroke="#3DDC84" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

function Oog({ x, id }) {
  return (
    <g>
      <ellipse cx={x} cy="97" rx="11" ry="12.5" fill="#FFFFFF" />
      <circle cx={x + 1} cy="98.5" r="8" fill={`url(#${id}-iris)`} />
      <circle cx={x + 1} cy="98.5" r="4" fill="#120A06" />
      <circle cx={x + 4} cy="94.6" r="2.8" fill="#FFFFFF" />
      <circle cx={x - 2} cy="102" r="1.3" fill="#FFFFFF" opacity="0.8" />
      <path d={`M${x - 11.5} 94 C ${x - 7} 84, ${x + 7} 84, ${x + 11.5} 94`} fill="none" stroke="#1E1410" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  );
}

// De avatar. `avatar` bevat huid, haarkleur, kapsel, kleding, kledingkleur,
// accessoire, achtergrond, achtergrondkleur en stofkleur (zie avatarDelen.js).
export default function HelixAvatar({ avatar, className = '', titel = 'Avatar' }) {
  const id = useId().replace(/:/g, '');
  const a = normaliseerAvatar(avatar);
  const huid = HUIDSKLEUREN.find((optie) => optie.id === a.huid) || HUIDSKLEUREN[0];
  const haar = kleurVan(HAARKLEUREN, a.haarkleur);
  const stof = kleurVan(STOFKLEUREN, a.stofkleur);
  const kledingkleur = kleurVan(STOFKLEUREN, a.kledingkleur);
  const hoofddoek = a.kapsel === 'kapsel-hoofddoek';
  const wenkbrauw = a.kapsel === 'kapsel-geen' || hoofddoek ? donker(huid.kleur, 0.55) : donker(haar, 0.1);
  const huidVorm = vorm(`${id}-huid`, huid.kleur);

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={titel}>
      <defs>
        <Bol id={`${id}-huid`} kleur={huid.kleur} cx="40%" cy="35%" r="70%" />
        <Bol id={`${id}-haar`} kleur={haar} cx="40%" cy="20%" r="80%" />
        <Bol id={`${id}-stof`} kleur={stof} cx="40%" cy="25%" r="80%" />
        <Bol id={`${id}-kleding`} kleur={kledingkleur} cx="45%" cy="10%" r="95%" />
        <Bol id={`${id}-wit`} kleur="#F7F7F2" cx="45%" cy="10%" r="95%" />
        <Bol id={`${id}-donker`} kleur="#33373D" cx="45%" cy="10%" r="95%" />
        <radialGradient id={`${id}-iris`} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#C58A4E" />
          <stop offset="0.6" stopColor="#6B3E1E" />
          <stop offset="1" stopColor="#3A200E" />
        </radialGradient>
        <radialGradient id={`${id}-wang`}>
          <stop offset="0" stopColor="#FF7A7A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FF7A7A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-nek`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={donker(huid.kleur, 0.28)} />
          <stop offset="0.5" stopColor={huid.kleur} />
        </linearGradient>
        <clipPath id={`${id}-hoofd`}>
          <ellipse cx="100" cy="94" rx="41" ry="47" />
        </clipPath>
        <radialGradient id={`${id}-schaduw`}>
          <stop offset="0" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="1" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <Achtergrond soort={a.achtergrond} kleur={kleurVan(STOFKLEUREN, a.achtergrondkleur)} id={id} />
      <ellipse cx="100" cy="200" rx="90" ry="22" fill={`url(#${id}-schaduw)`} />
      {!hoofddoek && <HaarAchter soort={a.kapsel} haar={haar} id={id} />}
      <Kleding soort={a.kleding} kleur={kledingkleur} id={id} />

      {/* Nek */}
      <path d="M85 116 L 85 150 C 94 158, 106 158, 115 150 L 115 116 Z" fill={`url(#${id}-nek)`} stroke={donker(huid.kleur, 0.35)} strokeWidth="1.5" />

      {hoofddoek && (
        <path d="M54 96 C 50 42, 150 42, 146 96 C 150 128, 162 150, 152 172 C 128 186, 72 186, 48 172 C 38 150, 50 128, 54 96 Z" {...vorm(`${id}-stof`, stof)} />
      )}

      {/* Oren */}
      {!hoofddoek && (
        <g>
          <ellipse cx="60" cy="100" rx="9" ry="11.5" {...huidVorm} />
          <ellipse cx="140" cy="100" rx="9" ry="11.5" {...huidVorm} />
          <path d="M58 96 C 61 98, 61 104, 58 106 M142 96 C 139 98, 139 104, 142 106" fill="none" stroke={donker(huid.kleur, 0.3)} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}

      {/* Hoofd */}
      <ellipse cx="100" cy="94" rx="41" ry="47" {...huidVorm} />
      <g clipPath={`url(#${id}-hoofd)`}>
        {/* Schaduw van het haar op het voorhoofd, en licht op de wang */}
        {a.kapsel !== 'kapsel-geen' && <ellipse cx="100" cy="68" rx="44" ry="14" fill={donker(huid.kleur, 0.25)} opacity="0.45" />}
        <ellipse cx="84" cy="80" rx="16" ry="10" fill="#FFFFFF" opacity="0.12" />
      </g>

      {/* Gezicht */}
      <ellipse cx="76" cy="114" rx="10" ry="7" fill={`url(#${id}-wang)`} />
      <ellipse cx="124" cy="114" rx="10" ry="7" fill={`url(#${id}-wang)`} />
      <path d="M73 79 C 78 74, 88 74, 94 78 M106 78 C 112 74, 122 74, 127 79" fill="none" stroke={wenkbrauw} strokeWidth="4" strokeLinecap="round" />
      <Oog x={84} id={id} />
      <Oog x={116} id={id} />
      <path d="M97 104 C 95 110, 97 113, 101 113 C 104 113, 106 111, 104 108" fill="none" stroke={donker(huid.kleur, 0.28)} strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="99" cy="106" rx="2" ry="3" fill="#FFFFFF" opacity="0.25" />
      <path d="M86 119 C 92 130, 108 130, 114 119 Z" fill="#5A1E1E" stroke={donker(huid.kleur, 0.45)} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M88 120 C 94 123, 106 123, 112 120 L 111 122.5 C 104 124.5, 96 124.5, 89 122.5 Z" fill="#FFFFFF" />
      <ellipse cx="100" cy="126.5" rx="6" ry="2.5" fill="#E77A86" />

      {hoofddoek ? (
        <path d="M60 94 C 58 56, 142 56, 140 94 C 132 70, 68 70, 60 94 Z" {...vorm(`${id}-stof`, stof)} />
      ) : (
        <HaarVoor soort={a.kapsel} haar={haar} id={id} />
      )}
      <Accessoire soort={a.accessoire} stof={stof} id={id} />
    </svg>
  );
}
