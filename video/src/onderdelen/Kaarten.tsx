import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { KLEUR, LIJN, MAAT } from '../theme';
import { KOPFONT, TEKSTFONT } from '../fonts';

export const Kaarten: React.FC<{ kaarten: Array<{ kop: string; regels: string[] }>; start: number }> = ({ kaarten, start }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 96, top: MAAT.vlakBoven, width: 1728, height: MAAT.vlakHoogte, display: 'flex', gap: 48 }}>
      {kaarten.map((kaart, index) => {
        const begin = start + index * 8;
        const zicht = interpolate(frame, [begin, begin + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={kaart.kop} style={{ flex: 1, display: 'flex', flexDirection: 'column', opacity: zicht, transform: `translateY(${(1 - zicht) * 20}px)`, background: KLEUR.wit, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, overflow: 'hidden' }}>
            <div style={{ background: KLEUR.geel, borderBottom: `${LIJN}px solid ${KLEUR.ink}`, padding: '22px 36px', fontFamily: KOPFONT, fontSize: 64, color: KLEUR.ink }}>{kaart.kop}</div>
            <div style={{ flex: 1, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, fontFamily: TEKSTFONT, fontSize: 52, color: KLEUR.ink }}>
              {kaart.regels.map((regel) => <div key={regel}>{regel}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
