import { formatGetal } from '../volumeLogic';

// Balk in schuine projectie (zoals de balken in het deck): voorvlak recht,
// diepte schuin naar achteren. Optioneel opgebouwd uit kubusjes van 1 cm³ (GeoGebra-idee).

const INK = '#0B0D0F';
const DIEPTE = 0.45;
const HOEK = Math.PI / 5;

function punten(lijst) {
  return lijst.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

function Kubus({ p, x, y, z, kleur }) {
  const voor = [p(x, y, z), p(x + 1, y, z), p(x + 1, y, z + 1), p(x, y, z + 1)];
  const boven = [p(x, y, z + 1), p(x + 1, y, z + 1), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)];
  const rechts = [p(x + 1, y, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x + 1, y, z + 1)];
  return (
    <g stroke={INK} strokeWidth="1.4" strokeLinejoin="round">
      <polygon points={punten(voor)} fill={kleur.voor} />
      <polygon points={punten(boven)} fill={kleur.boven} />
      <polygon points={punten(rechts)} fill={kleur.rechts} />
    </g>
  );
}

const KLEUREN = {
  blauw: { voor: '#3FA7DB', boven: '#8FD0F0', rechts: '#1F7DB0' },
  groen: { voor: '#3DB57A', boven: '#8EDDB4', rechts: '#237A4D' },
  hout: { voor: '#D9A066', boven: '#EDC69A', rechts: '#B07A43' }
};

// l, b, h in cm. `lagen`: aantal zichtbare kubuslagen (voor de KIJK-animatie), of null voor een dichte balk.
export default function Balk({ l, b, h, lagen = null, accent = null, toonMaten = false, kleur = 'blauw', className = '' }) {
  const breedtePx = 340;
  const hoogtePx = 250;
  const s = Math.min(breedtePx / (l + b * DIEPTE * Math.cos(HOEK)), hoogtePx / (h + b * DIEPTE * Math.sin(HOEK)));
  const dx = Math.cos(HOEK) * DIEPTE * s;
  const dy = Math.sin(HOEK) * DIEPTE * s;
  const p = (x, y, z) => [x * s + y * dx, -z * s - y * dy];
  const k = KLEUREN[kleur] || KLEUREN.blauw;

  const kubussen = [];
  if (lagen !== null) {
    for (let y = b - 1; y >= 0; y -= 1) {
      for (let z = 0; z < Math.min(h, lagen); z += 1) {
        for (let x = 0; x < l; x += 1) {
          kubussen.push({ x, y, z, kleur: z === Math.min(h, lagen) - 1 ? KLEUREN.groen : k });
        }
      }
    }
  }

  const voor = [p(0, 0, 0), p(l, 0, 0), p(l, 0, h), p(0, 0, h)];
  const boven = [p(0, 0, h), p(l, 0, h), p(l, b, h), p(0, b, h)];
  const rechts = [p(l, 0, 0), p(l, b, 0), p(l, b, h), p(l, 0, h)];

  const ribben = {
    l: [p(0, 0, 0), p(l, 0, 0)],
    b: [p(l, 0, 0), p(l, b, 0)],
    h: [p(0, 0, 0), p(0, 0, h)]
  };

  const minX = -40;
  const minY = -(h * s + b * dy) - 30;
  const vbB = l * s + b * dx + 110;
  const vbH = h * s + b * dy + 80;

  const maatTekst = { l: `lengte = ${formatGetal(l)} cm`, b: `breedte = ${formatGetal(b)} cm`, h: `hoogte = ${formatGetal(h)} cm` };

  return (
    <svg viewBox={`${minX} ${minY} ${vbB} ${vbH}`} className={`h-auto w-full ${className}`} role="img" aria-label={`Balk van ${formatGetal(l)} bij ${formatGetal(b)} bij ${formatGetal(h)} cm`}>
      {lagen !== null ? (
        <>
          {kubussen.map((c) => <Kubus key={`${c.x}-${c.y}-${c.z}`} p={p} {...c} />)}
          <polygon points={punten([...voor])} fill="none" stroke={INK} strokeWidth="3" strokeDasharray="6 4" opacity="0.5" />
          <polygon points={punten(boven)} fill="none" stroke={INK} strokeWidth="3" strokeDasharray="6 4" opacity="0.5" />
          <polygon points={punten(rechts)} fill="none" stroke={INK} strokeWidth="3" strokeDasharray="6 4" opacity="0.5" />
        </>
      ) : (
        <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round">
          <polygon points={punten(voor)} fill={k.voor} />
          <polygon points={punten(boven)} fill={k.boven} />
          <polygon points={punten(rechts)} fill={k.rechts} />
        </g>
      )}

      {Object.entries(ribben).map(([naam, [a, e]]) => (
        accent === naam ? (
          <line key={naam} x1={a[0]} y1={a[1]} x2={e[0]} y2={e[1]} stroke="#FFD33D" strokeWidth="9" strokeLinecap="round" opacity="0.95" />
        ) : null
      ))}
      {accent && ribben[accent] && (
        <line x1={ribben[accent][0][0]} y1={ribben[accent][0][1]} x2={ribben[accent][1][0]} y2={ribben[accent][1][1]} stroke={INK} strokeWidth="3" strokeLinecap="round" />
      )}

      {toonMaten && (
        <g fontFamily="Atkinson Hyperlegible Next Variable, Arial, sans-serif" fontSize="15" fontWeight="700" fill={INK}>
          <text x={(ribben.l[0][0] + ribben.l[1][0]) / 2} y={ribben.l[0][1] + 24} textAnchor="middle">{maatTekst.l}</text>
          <text x={ribben.b[1][0] + 8} y={(ribben.b[0][1] + ribben.b[1][1]) / 2 + 18}>{maatTekst.b}</text>
          <text x={ribben.h[0][0] - 10} y={(ribben.h[0][1] + ribben.h[1][1]) / 2} textAnchor="middle" transform={`rotate(-90 ${ribben.h[0][0] - 10} ${(ribben.h[0][1] + ribben.h[1][1]) / 2})`}>{maatTekst.h}</text>
        </g>
      )}
    </svg>
  );
}
