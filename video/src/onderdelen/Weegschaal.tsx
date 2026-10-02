import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, LIJN } from '../theme';
import { TEKSTFONT } from '../fonts';
import { weegschaalGetal } from '../../lib/weegschaal.mjs';

type Props = { items: Array<{ label: string; waarde: number }>; eenheid: string; start: number };

// Het schermpje telt in een seconde op in hele getallen en eindigt precies op
// de waarde uit het draaiboek, ook als die decimalen heeft.
export const Weegschaal: React.FC<Props> = ({ items, eenheid, start }) => {
  const frame = useCurrentFrame();
  const voortgang = interpolate(frame, [start, start + 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const breedte = items.length === 1 ? 520 : 290;
  return (
    <div style={{ display: 'flex', gap: 30, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      {items.map((item) => (
        <div key={item.label} style={{ width: breedte, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <svg viewBox="0 0 300 200" width={breedte}>
            <rect x="20" y="40" width="260" height="22" rx="8" fill={KLEUR.metaal} stroke={KLEUR.ink} strokeWidth={LIJN} />
            <rect x="130" y="62" width="40" height="30" fill={KLEUR.ink} />
            <rect x="30" y="92" width="240" height="96" rx="16" fill={KLEUR.donker} stroke={KLEUR.ink} strokeWidth={LIJN} />
            <rect x="62" y="110" width="176" height="60" rx="8" fill={KLEUR.display} stroke={KLEUR.ink} strokeWidth={4} />
            <text x="150" y="152" textAnchor="middle" fontFamily={TEKSTFONT} fontWeight={700} fontSize={items.length === 1 ? 36 : 40} fill={KLEUR.ink}>
              {weegschaalGetal(item.waarde, voortgang)} {eenheid}
            </text>
          </svg>
          <div style={{ fontFamily: TEKSTFONT, fontSize: 30, color: KLEUR.ink }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};
