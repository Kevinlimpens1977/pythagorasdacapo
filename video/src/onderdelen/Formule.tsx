import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { KLEUR } from '../theme';
import { TEKSTFONT } from '../fonts';

export const Formule: React.FC<{ regels: Array<{ tekst: string; start: number }> }> = ({ regels }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 34, height: '100%', padding: '0 20px', fontFamily: TEKSTFONT }}>
      {regels.map((regel, index) => {
        const zicht = interpolate(frame, [regel.start, regel.start + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        const eerste = index === 0;
        return (
          <div key={regel.tekst} style={{
            opacity: zicht, fontSize: eerste ? 64 : 34, fontWeight: eerste ? 700 : 400,
            color: eerste ? KLEUR.blauw : KLEUR.ink, textAlign: eerste ? 'center' : 'left',
          }}>{regel.tekst}</div>
        );
      })}
    </div>
  );
};
