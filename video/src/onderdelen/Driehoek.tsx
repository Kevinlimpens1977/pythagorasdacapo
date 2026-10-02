import React from 'react';
import { useCurrentFrame } from 'remotion';
import { KLEUR, LIJN } from '../theme';
import { TEKSTFONT } from '../fonts';

// De drie symbolen en formules komen uit het draaiboek. `formules` staat in de
// volgorde: linksOnder afgedekt, boven afgedekt, rechtsOnder afgedekt.
type Props = { start: number; boven: string; linksOnder: string; rechtsOnder: string; formules: string[] };

const PLEK = { boven: { x: 310, y: 250 }, linksOnder: { x: 215, y: 420 }, rechtsOnder: { x: 405, y: 420 } } as const;
const VOLGORDE = ['linksOnder', 'boven', 'rechtsOnder'] as const;

// Formuledriehoek: steeds één symbool afgedekt met een geel kaartje, eronder
// de formule die overblijft. Elke stap duurt anderhalve seconde.
export const Driehoek: React.FC<Props> = ({ start, boven, linksOnder, rechtsOnder, formules }) => {
  const frame = useCurrentFrame();
  const index = Math.max(0, Math.floor((frame - start) / 45)) % VOLGORDE.length;
  const plek = PLEK[VOLGORDE[index]];
  const symbolen = { boven, linksOnder, rechtsOnder };
  return (
    <svg viewBox="0 0 620 660" width={620} height={660}>
      <polygon points="310,110 520,500 100,500" fill={KLEUR.wit} stroke={KLEUR.ink} strokeWidth={LIJN} strokeLinejoin="round" />
      <line x1={190} x2={430} y1={340} y2={340} stroke={KLEUR.ink} strokeWidth={6} />
      <line x1={310} x2={310} y1={340} y2={500} stroke={KLEUR.ink} strokeWidth={6} />
      {(['boven', 'linksOnder', 'rechtsOnder'] as const).map((plaats) => (
        <text key={plaats} x={PLEK[plaats].x} y={PLEK[plaats].y + 20} textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={72} fill={KLEUR.ink}>{symbolen[plaats]}</text>
      ))}
      <rect x={plek.x - 52} y={plek.y - 48} width={104} height={96} rx={14} fill={KLEUR.geel} stroke={KLEUR.ink} strokeWidth={6} />
      <text x={310} y={600} textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={56} fill={KLEUR.blauw}>{formules[index]}</text>
    </svg>
  );
};
