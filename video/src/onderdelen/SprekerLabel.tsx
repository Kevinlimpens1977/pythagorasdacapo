import React from 'react';
import { Img, staticFile } from 'remotion';
import { KLEUR } from '../theme';
import { TEKSTFONT } from '../fonts';

type Props = { uitdrukking: string; zonderBeeld: boolean };
const RAND = 4;
const DOORSNEDE = 64; // buitenmaat van de cirkel, rand inbegrepen
const BINNEN = DOORSNEDE - 2 * RAND; // zichtbaar vlak binnen de rand
const rondje = {
  width: DOORSNEDE, height: DOORSNEDE, borderRadius: DOORSNEDE / 2, background: KLEUR.geel,
  border: `${RAND}px solid ${KLEUR.paper}`, boxSizing: 'border-box',
} as const;

// Het portret is 768 px met het gezicht in het midden; in 64 px zou het gezicht te klein zijn.
// Daarom staat het portret uitvergroot in de cirkel, verschoven zodat het gezicht
// (ongeveer x 0,45 en y 0,45 van het portret) in het midden van het zichtbare vlak valt.
const GEZICHT_SCHAAL = 2.0; // keer het zichtbare vlak (ongeveer 1,8 keer de buitenmaat)
const PORTRET = BINNEN * GEZICHT_SCHAAL;
const GEZICHT_X = 0.45;
const GEZICHT_Y = 0.45;

export const SprekerLabel: React.FC<Props> = ({ uitdrukking, zonderBeeld }) => (
  <div style={{
    // Binnen het paneel of de kaart eronder (binnenrand onderaan op y = 828), niet over de rand heen.
    position: 'absolute', left: 128, top: 720, height: 84, padding: '0 30px 0 10px', borderRadius: 42,
    background: KLEUR.ink, display: 'flex', alignItems: 'center', gap: 16,
  }}>
    {zonderBeeld
      ? <div style={rondje} />
      : (
        <div style={{ ...rondje, position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          <Img
            src={staticFile(`sami/${uitdrukking}.png`)}
            style={{ position: 'absolute', width: PORTRET, height: PORTRET, left: BINNEN / 2 - GEZICHT_X * PORTRET, top: BINNEN / 2 - GEZICHT_Y * PORTRET }}
          />
        </div>
      )}
    <div style={{ fontFamily: TEKSTFONT, fontWeight: 700, fontSize: 32, color: KLEUR.paper }}>SAMI</div>
  </div>
);

export const SamiGroot: React.FC<Props> = ({ uitdrukking, zonderBeeld }) => (zonderBeeld ? null : (
  // Onderkant gelijk aan de binnenrand van het paneel (y = 828); het portret is onderaan recht afgesneden.
  <Img src={staticFile(`sami/${uitdrukking}.png`)} style={{ position: 'absolute', left: 1360, top: 322, width: 460, height: 506, objectFit: 'contain', objectPosition: 'bottom' }} />
));
