import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, LIJN } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { van: number; naar?: number; max: number; stap: number; eenheid: string; start: number; stijg?: number; voorwerp?: string; labels?: boolean; oog?: boolean };

const ONDER = 570;
const BOVEN = 100;
const X = 130;
const B = 200;

// Getekende maatcilinder. De schaal klopt altijd: het niveau is een getal uit
// het draaiboek, niet uit een AI-beeld. Alleen met `voorwerp: "steen"` valt er
// bij `stijg` een steen in; zonder voorwerp stijgt alleen het water.
export const Maatcilinder: React.FC<Props> = ({ van, naar, max, stap, eenheid, start, stijg, voorwerp, labels, oog }) => {
  const frame = useCurrentFrame();
  const y = (waarde: number) => ONDER - ((ONDER - BOVEN) * waarde) / max;
  const klem = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const vullen = interpolate(frame, [start, start + 30], [0, van], { ...klem, easing: Easing.out(Easing.cubic) });
  const stijgStart = (stijg ?? Number.POSITIVE_INFINITY) + 12;
  const niveau = naar !== undefined && stijg !== undefined
    ? (frame < stijgStart ? vullen : interpolate(frame, [stijgStart, stijgStart + 45], [van, naar], { ...klem, easing: Easing.inOut(Easing.cubic) }))
    : vullen;
  const steenY = stijg !== undefined && voorwerp === 'steen' ? interpolate(frame, [stijg, stijg + 14], [BOVEN - 60, ONDER - 104], { ...klem, easing: Easing.in(Easing.quad) }) : null;
  const streepjes = [];
  for (let w = 0; w <= max; w += stap) streepjes.push(w);
  const beginZicht = interpolate(frame, [start + 30, start + 40], [0, 1], klem);
  const eindZicht = stijg !== undefined ? interpolate(frame, [stijgStart + 45, stijgStart + 55], [0, 1], klem) : 0;

  return (
    <svg viewBox="0 0 620 660" width={620} height={660}>
      <rect x={X} y={y(niveau)} width={B} height={ONDER - y(niveau)} fill={KLEUR.water} />
      <line x1={X} x2={X + B} y1={y(niveau)} y2={y(niveau)} stroke={KLEUR.blauw} strokeWidth={6} />
      {steenY !== null && (
        <path transform={`translate(${X + 60} ${steenY})`} d="M0 20 q30 -40 70 -20 q36 18 22 60 q-12 40 -56 36 q-48 -6 -36 -76z" fill="#8C8577" stroke={KLEUR.ink} strokeWidth={7} />
      )}
      <rect x={X} y={BOVEN - 40} width={B} height={ONDER - BOVEN + 40} rx={14} fill="none" stroke={KLEUR.ink} strokeWidth={LIJN} />
      <rect x={X - 10} y={ONDER} width={B + 20} height={30} rx={8} fill={KLEUR.ink} />
      {streepjes.map((w) => (
        <g key={w}>
          <line x1={X} x2={X + 40} y1={y(w)} y2={y(w)} stroke={KLEUR.ink} strokeWidth={5} />
          <text x={X - 20} y={y(w) + 10} textAnchor="end" fontFamily={TEKSTFONT} fontSize={28} fill={KLEUR.ink}>{w}</text>
        </g>
      ))}
      <text x={X + B / 2} y={ONDER + 64} textAnchor="middle" fontFamily={TEKSTFONT} fontSize={28} fill={KLEUR.ink}>{eenheid}</text>
      {oog && (
        <g opacity={beginZicht} transform={`translate(${X + B + 40} ${y(van)})`}>
          <ellipse cx={30} cy={0} rx={30} ry={18} fill={KLEUR.wit} stroke={KLEUR.ink} strokeWidth={5} />
          <circle cx={30} cy={0} r={9} fill={KLEUR.ink} />
          <line x1={-30} x2={-6} y1={0} y2={0} stroke={KLEUR.ink} strokeWidth={4} strokeDasharray="8 6" />
          <text x={74} y={10} fontFamily={TEKSTFONT} fontWeight={700} fontSize={30} fill={KLEUR.blauw}>{van} {eenheid}</text>
        </g>
      )}
      {labels && (
        <>
          <g opacity={beginZicht}>
            <line x1={X + B + 10} x2={X + B + 70} y1={y(van)} y2={y(van)} stroke={KLEUR.ink} strokeWidth={4} strokeDasharray="10 8" />
            <text x={X + B + 80} y={y(van) + 10} fontFamily={TEKSTFONT} fontSize={28} fill={KLEUR.ink}>begin {van} {eenheid}</text>
          </g>
          {naar !== undefined && (
            <g opacity={eindZicht}>
              <line x1={X + B + 10} x2={X + B + 70} y1={y(naar)} y2={y(naar)} stroke={KLEUR.blauw} strokeWidth={6} />
              <text x={X + B + 80} y={y(naar) + 10} fontFamily={TEKSTFONT} fontWeight={700} fontSize={28} fill={KLEUR.blauw}>eind {naar} {eenheid}</text>
            </g>
          )}
        </>
      )}
    </svg>
  );
};
