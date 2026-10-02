import React from 'react';
import { KLEUR, MAAT } from '../theme';
import { KOPFONT, TEKSTFONT } from '../fonts';

export const TitelVak: React.FC<{ kop: string; fase: string; meta: string }> = ({ kop, fase, meta }) => (
  <div style={{
    position: 'absolute', left: 0, top: 0, width: 1920, height: MAAT.titelHoogte,
    background: KLEUR.geel, borderBottom: `${MAAT.titelRand}px solid ${KLEUR.ink}`,
    display: 'flex', alignItems: 'center', gap: 34, padding: `0 ${MAAT.marge}px`, boxSizing: 'border-box',
  }}>
    <div style={{ background: KLEUR.ink, color: KLEUR.geel, fontFamily: TEKSTFONT, fontWeight: 700, fontSize: 32, borderRadius: 10, padding: '10px 26px' }}>{fase}</div>
    <div style={{ flex: 1, fontFamily: KOPFONT, fontSize: 72, letterSpacing: 2, color: KLEUR.ink, lineHeight: 1 }}>{kop}</div>
    <div style={{ fontFamily: TEKSTFONT, fontSize: 26, color: KLEUR.ink }}>{meta}</div>
  </div>
);
