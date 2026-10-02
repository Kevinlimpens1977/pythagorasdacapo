import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { KLEUR, LIJN, MAAT } from '../theme';

type Props = { hoofdstukId: string; naam: string; frames: number; startFrame: number; x: number; w: number; zonderBeeld: boolean };

// Een still zoomt langzaam in; een reeks speelt vanaf startFrame en blijft op
// het laatste beeld staan. zonderBeeld: leeg paneel, voor zolang de shots er
// nog niet zijn.
export const ComicPaneel: React.FC<Props> = ({ hoofdstukId, naam, frames, startFrame, x, w, zonderBeeld }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const nummer = frames <= 1 ? 1 : Math.min(frames, Math.max(1, frame - startFrame + 1));
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  const src = staticFile(`hoofdstukken/${hoofdstukId}/shots/${naam}/${String(nummer).padStart(4, '0')}.png`);
  return (
    <div style={{
      position: 'absolute', left: x, top: MAAT.vlakBoven, width: w, height: MAAT.vlakHoogte,
      background: KLEUR.paneel, border: `${LIJN}px solid ${KLEUR.ink}`, borderRadius: 24, overflow: 'hidden', boxSizing: 'border-box',
    }}>
      {!zonderBeeld && <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${frames <= 1 ? zoom : 1})` }} />}
    </div>
  );
};
