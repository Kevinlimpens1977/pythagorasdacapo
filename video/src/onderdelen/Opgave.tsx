import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { KLEUR, LIJN, MAAT } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { vraag: string[]; antwoord: string[]; aftelStart: number; aftelSeconden: number; antwoordStart: number };

export const Opgave: React.FC<Props> = ({ vraag, antwoord, aftelStart, aftelSeconden, antwoordStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const klem = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
  const rest = interpolate(frame, [aftelStart, aftelStart + aftelSeconden * fps], [1, 0], klem);
  const aftelZicht = frame >= aftelStart && frame < antwoordStart ? 1 : 0;
  const antwoordZicht = interpolate(frame, [antwoordStart, antwoordStart + 10], [0, 1], klem);
  return (
    <div style={{ position: 'absolute', left: 96, top: MAAT.vlakBoven, width: 1728, height: MAAT.vlakHoogte, display: 'flex', gap: 48, fontFamily: TEKSTFONT }}>
      <div style={{ flex: 1, background: KLEUR.wit, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, padding: 56, display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
          {vraag.map((regel) => <div key={regel} style={{ fontSize: 64, color: KLEUR.ink }}>{regel}</div>)}
        </div>
        <div style={{ opacity: aftelZicht, display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={KLEUR.ink} strokeWidth={2.5} strokeLinecap="round"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          <div style={{ fontSize: 34, color: KLEUR.ink }}>Zet op pauze en reken</div>
          <div style={{ flex: 1, height: 22, border: `4px solid ${KLEUR.ink}`, borderRadius: 11, overflow: 'hidden' }}>
            <div style={{ width: `${rest * 100}%`, height: '100%', background: KLEUR.blauw }} />
          </div>
        </div>
      </div>
      <div style={{ width: 760, opacity: antwoordZicht, background: KLEUR.groen, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, padding: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28 }}>
        {antwoord.map((regel, index) => <div key={regel} style={{ fontSize: index === 0 ? 48 : 36, fontWeight: index === 0 ? 700 : 400, color: KLEUR.wit }}>{regel}</div>)}
      </div>
    </div>
  );
};
