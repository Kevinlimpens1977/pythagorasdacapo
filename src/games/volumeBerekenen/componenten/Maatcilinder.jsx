import { useRef } from 'react';
import { formatGetal, rondAf } from '../volumeLogic';
import { geometrieVoor, waardeVoorY, yVoorWaarde } from './cilinderGeometrie';
import Voorwerp from './Voorwerp';

// Maatcilinder in SVG. De schaal is exact: elk streepje staat op zijn plek.
// De meniscus buigt omlaag; de onderkant ligt precies op `niveau`.

const INK = '#0B0D0F';
const WATER = '#6FBDE8';
const WATER_RAND = '#087EB5';

function streepjes(schaal) {
  const lijst = [];
  const totaal = Math.round(schaal.max / schaal.stap);
  const perLabel = Math.round(schaal.labelStap / schaal.stap);
  const perMidden = Math.max(1, Math.round(schaal.middenStap / schaal.stap));
  for (let k = 0; k <= totaal; k += 1) {
    const waarde = rondAf(k * schaal.stap, 4);
    const isLabel = k % perLabel === 0;
    const isMidden = !isLabel && k % perMidden === 0;
    lijst.push({ k, waarde, isLabel, isMidden });
  }
  return lijst;
}

// De inhoud (glas, schaal, water) als groep, zodat de loep dezelfde tekening kan inzoomen.
export function CilinderInhoud({ schaal, niveau, markers = [], labelAccenten = [], voorwerp = null, idPrefix = 'mc' }) {
  const g = geometrieVoor(schaal);
  const yNiveau = yVoorWaarde(niveau, schaal);
  const afstand = (g.yNul - g.yMax) / Math.round(schaal.max / schaal.stap);
  const meniscus = Math.max(2.5, Math.min(7, afstand));
  const midden = (g.binnenLinks + g.binnenRechts) / 2;
  const lijnen = streepjes(schaal);
  const decimalenLabel = String(schaal.labelStap).includes('.') ? String(schaal.labelStap).split('.')[1].length : 0;

  const waterPad = [
    `M ${g.binnenLinks} ${yNiveau - meniscus}`,
    `Q ${midden} ${yNiveau + meniscus} ${g.binnenRechts} ${yNiveau - meniscus}`,
    `L ${g.binnenRechts} ${g.yNul + 6}`,
    `L ${g.binnenLinks} ${g.yNul + 6} Z`
  ].join(' ');
  const oppervlak = `M ${g.binnenLinks} ${yNiveau - meniscus} Q ${midden} ${yNiveau + meniscus} ${g.binnenRechts} ${yNiveau - meniscus}`;

  return (
    <g>
      <defs>
        <linearGradient id={`${idPrefix}-glas`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#dff1f8" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* voet */}
      {schaal.soort === 'cilinder' && (
        <path d={`M ${g.binnenLinks - 38} ${g.yNul + 38} L ${g.binnenRechts + 38} ${g.yNul + 38} L ${g.binnenRechts + 20} ${g.yNul + 18} L ${g.binnenLinks - 20} ${g.yNul + 18} Z`} fill="#dff1f8" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      )}
      {schaal.soort === 'spuit' && (
        <g>
          <rect x={midden - 5} y={g.yMax - 70} width="10" height={yNiveau - (g.yMax - 70) - 8} fill="#d9d9d9" stroke={INK} strokeWidth="2" />
          <rect x={midden - 26} y={g.yMax - 80} width="52" height="10" rx="3" fill="#d9d9d9" stroke={INK} strokeWidth="2.5" />
          <rect x={g.binnenLinks - 2} y={yNiveau - 10} width={g.binnenRechts - g.binnenLinks + 4} height="10" fill="#555" stroke={INK} strokeWidth="1.5" />
          <path d={`M ${midden - 4} ${g.yNul + 4} L ${midden - 2} ${g.yNul + 40} L ${midden + 2} ${g.yNul + 40} L ${midden + 4} ${g.yNul + 4} Z`} fill="#dff1f8" stroke={INK} strokeWidth="2" />
        </g>
      )}

      {/* water */}
      {schaal.soort === 'spuit' ? (
        <rect x={g.binnenLinks} y={yNiveau} width={g.binnenRechts - g.binnenLinks} height={g.yNul - yNiveau + 4} fill={WATER} />
      ) : (
        <>
          <path d={waterPad} fill={WATER} />
          <path d={oppervlak} fill="none" stroke={WATER_RAND} strokeWidth="1.6" />
        </>
      )}

      {voorwerp && <Voorwerp {...voorwerp} />}

      {/* schaal */}
      {lijnen.map(({ k, waarde, isLabel, isMidden }) => {
        const y = yVoorWaarde(waarde, schaal);
        if (k === 0 && schaal.soort === 'cilinder') return null;
        const lengte = isLabel ? 34 : isMidden ? 22 : 13;
        return (
          <line key={k} x1={g.binnenLinks + 2} x2={g.binnenLinks + 2 + lengte} y1={y} y2={y} stroke={INK} strokeWidth={isLabel ? 1.8 : 1.1} />
        );
      })}
      {lijnen.filter((l) => l.isLabel && l.k > 0).map(({ k, waarde }) => {
        const y = yVoorWaarde(waarde, schaal);
        const accent = labelAccenten.some((a) => Math.abs(a - waarde) < 1e-6);
        const tekst = formatGetal(waarde, decimalenLabel);
        return (
          <g key={`l${k}`}>
            {accent && <rect x={g.binnenLinks + 38} y={y - 11} width={tekst.length * 9 + 10} height="22" rx="4" fill="#FFD33D" stroke={INK} strokeWidth="1.5" />}
            <text x={g.binnenLinks + 43} y={y + 5} fontSize="14" fontWeight="700" fill={INK} fontFamily="Atkinson Hyperlegible Next Variable, Arial, sans-serif">{tekst}</text>
          </g>
        );
      })}

      {/* markeringen: jouw antwoord (rood) en het goede antwoord (groen) */}
      {markers.map((marker) => {
        const y = yVoorWaarde(marker.waarde, schaal);
        return (
          <g key={`${marker.kleur}-${marker.waarde}`}>
            <line x1={g.binnenLinks - 14} x2={g.binnenRechts + 14} y1={y} y2={y} stroke={marker.kleur} strokeWidth="2.5" strokeDasharray={marker.gestippeld ? '5 3' : undefined} />
            {marker.label && (
              <text x={g.binnenRechts + 16} y={y + 4} fontSize="12" fontWeight="700" fill={marker.kleur} fontFamily="Atkinson Hyperlegible Next Variable, Arial, sans-serif">{marker.label}</text>
            )}
          </g>
        );
      })}

      {/* glas */}
      <path
        d={`M ${g.binnenLinks - 4} ${g.yMax - 40} L ${g.binnenLinks - 4} ${g.yNul + 18} L ${g.binnenRechts + 4} ${g.yNul + 18} L ${g.binnenRechts + 4} ${g.yMax - 40}`}
        fill={`url(#${idPrefix}-glas)`}
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {schaal.soort === 'cilinder' && (
        <path d={`M ${g.binnenLinks - 4} ${g.yMax - 40} q -8 -4 -12 -10`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      )}
      <line x1={g.binnenRechts - 10} x2={g.binnenRechts - 10} y1={g.yMax - 20} y2={g.yNul - 10} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
      <text x={midden} y={g.yMax - 48} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} fontFamily="Atkinson Hyperlegible Next Variable, Arial, sans-serif">
        {schaal.soort === 'spuit' ? '1 ml' : schaal.max >= 1000 ? '1 l' : `${schaal.max} ml`}
      </text>
    </g>
  );
}

export default function Maatcilinder({ schaal, niveau, markers, labelAccenten, voorwerp, onKies, titel = 'Maatcilinder', className = '' }) {
  const svgRef = useRef(null);
  const g = geometrieVoor(schaal);

  const kiesVanuitPunt = (event) => {
    if (!onKies || !svgRef.current) return;
    const svg = svgRef.current;
    const punt = svg.createSVGPoint();
    punt.x = event.clientX;
    punt.y = event.clientY;
    const lokaal = punt.matrixTransform(svg.getScreenCTM().inverse());
    if (lokaal.y < g.yMax - 30 || lokaal.y > g.yNul + 10) return;
    onKies(waardeVoorY(lokaal.y, schaal));
  };

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${g.breedte} ${g.hoogte}`}
      className={`h-[min(60vh,520px)] min-h-[340px] w-auto shrink-0 touch-none select-none ${onKies ? 'cursor-crosshair' : ''} ${className}`}
      role="img"
      aria-label={titel}
      onPointerDown={onKies ? kiesVanuitPunt : undefined}
      onPointerMove={onKies ? (event) => { if (event.buttons === 1) kiesVanuitPunt(event); } : undefined}
    >
      <CilinderInhoud schaal={schaal} niveau={niveau} markers={markers} labelAccenten={labelAccenten} voorwerp={voorwerp} idPrefix="mc" />
    </svg>
  );
}

// Loep: dezelfde tekening, ingezoomd rond de meniscus (Stark Science).
export function Loep({ schaal, niveau, markers, lijnen = [], zoom = 1, className = '' }) {
  const g = geometrieVoor(schaal);
  const y = yVoorWaarde(niveau, schaal);
  const hoogte = 64 / zoom;
  const breedte = 120 / zoom;
  const x0 = (g.binnenLinks + g.binnenRechts) / 2 - breedte / 2 + 8;
  return (
    <div className={`shrink-0 overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-white shadow-[4px_4px_0_#0B0D0F] ${className}`}>
      <div className="flex items-center justify-between border-b-2 border-[#0B0D0F] bg-[#FFD33D] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-[#0B0D0F]">
        <span>Loep</span>
        <span>{schaal.soort === 'spuit' ? 'maatspuit' : schaal.naam.replace('Maatcilinder ', '')}</span>
      </div>
      <svg viewBox={`${x0} ${y - hoogte / 2} ${breedte} ${hoogte}`} className="block h-auto w-full" role="img" aria-label="Ingezoomd beeld van de meniscus">
        <rect x={x0} y={y - hoogte / 2} width={breedte} height={hoogte} fill="#FFF7E8" />
        <CilinderInhoud schaal={schaal} niveau={niveau} markers={markers} idPrefix="loep" />
        {lijnen.map((lijn, i) => {
          const r = 5.5 / zoom;
          const cx = x0 + breedte - r * (2.4 * (lijnen.length - i));
          return (
            <g key={lijn.id}>
              <line x1={x0} x2={cx - r} y1={y + lijn.dy} y2={y + lijn.dy} stroke={lijn.kleur} strokeWidth={1.2 / zoom} strokeDasharray={`${3 / zoom} ${2 / zoom}`} />
              <circle cx={cx} cy={y + lijn.dy} r={r} fill="#FFD33D" stroke={INK} strokeWidth={1 / zoom} />
              <text x={cx} y={y + lijn.dy + r * 0.55} textAnchor="middle" fontSize={7 / zoom} fontWeight="700" fill={INK}>{lijn.id.toUpperCase()}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
