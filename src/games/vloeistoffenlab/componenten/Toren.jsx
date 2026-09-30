import { forwardRef } from 'react';
import Voorwerp from '../../volumeBerekenen/componenten/Voorwerp';
import { vloeistof } from '../vloeistofLogic';
import { B, BINNEN, H, LAAG, laagBoven, laagOnder, yVoorPlek } from './torenGeometrie';

const INK = '#0B0D0F';

// Een hoog glas met lagen vloeistof. `lagen`: ids van onder naar boven (mag
// korter dan vijf zijn). `vakken`: toon lege vakken met een nummer (voorspellen).
// `voorwerpen`: [{ vorm, plek, x }] die in het glas liggen.
const Toren = forwardRef(function Toren({ lagen = [], vakken = false, voorwerpen = [], namen = false, className = '' }, ref) {
  return (
    <svg ref={ref} viewBox={`0 0 ${B} ${H}`} className={`h-[min(62vh,440px)] w-auto ${className}`} role="img" aria-label={`Dichtheidstoren met ${lagen.length} lagen`}>
      {lagen.map((id, i) => {
        const v = vloeistof(id);
        return (
          <g key={`${id}-${i}`} style={{ transition: 'opacity 400ms' }}>
            <rect x={BINNEN.links} y={laagBoven(i)} width={BINNEN.rechts - BINNEN.links} height={LAAG} fill={v?.kleur || '#ccc'} />
            <line x1={BINNEN.links} x2={BINNEN.rechts} y1={laagBoven(i)} y2={laagBoven(i)} stroke={INK} strokeOpacity="0.35" strokeWidth="1.5" />
            {namen && (
              <text x={BINNEN.links + 8} y={laagOnder(i) - 8} fontSize="14" fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">
                {v?.naam} {v ? v.rho.toFixed(2).replace('.', ',') : ''}
              </text>
            )}
          </g>
        );
      })}
      {vakken && [0, 1, 2, 3, 4].map((i) => (
        <g key={`vak-${i}`}>
          <rect x={BINNEN.links + 6} y={laagBoven(i) + 4} width={BINNEN.rechts - BINNEN.links - 12} height={LAAG - 8} rx="6" fill="none" stroke={INK} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 5" />
          <text x={BINNEN.rechts + 16} y={(laagOnder(i) + laagBoven(i)) / 2 + 6} fontSize="16" fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">{i + 1}</text>
        </g>
      ))}
      {voorwerpen.map((ding) => (
        <Voorwerp key={ding.vorm} vorm={ding.vorm} x={ding.x} y={yVoorPlek(ding.plek)} schaal={0.9}
          stijl={{ transition: 'transform 900ms cubic-bezier(.3,.7,.4,1)' }} />
      ))}
      <path d={`M ${BINNEN.links - 6} 36 L ${BINNEN.links - 6} ${BINNEN.onder + 8} Q ${BINNEN.links - 6} ${BINNEN.onder + 20} ${BINNEN.links + 8} ${BINNEN.onder + 20} L ${BINNEN.rechts - 8} ${BINNEN.onder + 20} Q ${BINNEN.rechts + 6} ${BINNEN.onder + 20} ${BINNEN.rechts + 6} ${BINNEN.onder + 8} L ${BINNEN.rechts + 6} 36`}
        fill="#EAF6FB" fillOpacity="0.25" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <line x1={BINNEN.rechts - 14} x2={BINNEN.rechts - 14} y1="60" y2={BINNEN.onder - 10} stroke="#ffffff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
      {vakken && <text x={B / 2} y="24" textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily="Arial, sans-serif">onder = 1, boven = 5</text>}
    </svg>
  );
});

export default Toren;
