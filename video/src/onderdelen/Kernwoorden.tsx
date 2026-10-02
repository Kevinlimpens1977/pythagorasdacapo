import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, KOLOM, LIJN, MAAT } from '../theme';
import { TEKSTFONT } from '../fonts';
import type { Kernwoord, Klok } from '../types';

export const Kernwoorden: React.FC<{ items: Kernwoord[]; klok: Klok }> = ({ items, klok }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute', left: KOLOM.rechts.x, top: MAAT.vlakBoven, width: KOLOM.rechts.w, height: MAAT.vlakHoogte,
      background: KLEUR.wit, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, padding: 36, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', gap: 22, fontFamily: TEKSTFONT,
    }}>
      <div style={{ fontWeight: 700, fontSize: 32, color: KLEUR.ink }}>Kernwoorden</div>
      {items.map((item) => {
        const start = klok.begin(item.bij);
        const zicht = interpolate(frame, [start, start + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={item.tekst} style={{
            opacity: zicht, transform: `translateY(${(1 - zicht) * 12}px)`, fontSize: 30, lineHeight: 1.25,
            color: item.accent ? KLEUR.wit : KLEUR.ink, background: item.accent ? KLEUR.blauw : 'transparent',
            borderRadius: 14, padding: item.accent ? '14px 18px' : 0, fontWeight: item.accent ? 700 : 400,
          }}>{item.tekst}</div>
        );
      })}
    </div>
  );
};
