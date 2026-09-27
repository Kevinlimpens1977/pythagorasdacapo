import { forwardRef, useEffect, useRef, useState } from 'react';
import { formatGetal } from '../../volumeBerekenen/volumeLogic';
import { wilMinderBeweging } from './beweging';

const INK = '#0B0D0F';
const DUUR = 450;

// Het display telt kort op naar de massa, zoals een echte weegschaal die even zoekt.
function useDisplay(doel) {
  const [waarde, setWaarde] = useState(doel);
  const frame = useRef(null);
  const vorige = useRef(doel);
  useEffect(() => {
    const van = vorige.current;
    vorige.current = doel;
    if (van === doel) return undefined;
    const duur = wilMinderBeweging() ? 0 : DUUR;
    const begin = performance.now();
    const stap = (nu) => {
      const t = duur === 0 ? 1 : Math.min(1, (nu - begin) / duur);
      setWaarde(van + (doel - van) * (1 - (1 - t) ** 3));
      if (t < 1) frame.current = window.requestAnimationFrame(stap);
    };
    frame.current = window.requestAnimationFrame(stap);
    return () => window.cancelAnimationFrame(frame.current);
  }, [doel]);
  return waarde;
}

// Digitale weegschaal. `massa` null = leeg (0,0 g). `children` ligt op de schaal.
// De ref wijst naar de weegplaat: daar sleep je iets naartoe.
const Weegschaal = forwardRef(function Weegschaal({ massa = null, children, actief = false, className = '' }, ref) {
  const getoond = useDisplay(massa === null ? 0 : massa);
  const tekst = formatGetal(Math.max(0, Math.round(getoond * 10) / 10), 1);
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        ref={ref}
        className={`flex min-h-[120px] w-full items-end justify-center rounded-t-xl border-2 border-dashed px-2 pb-1 transition-colors ${actief ? 'border-[#087EB5] bg-[#E1F0F8]/70' : 'border-transparent'}`}
      >
        {children}
      </div>
      <svg viewBox="0 0 260 120" className="h-auto w-full max-w-[260px]" role="img" aria-label={`Weegschaal. Display: ${tekst} gram`}>
        <rect x="20" y="4" width="220" height="14" rx="5" fill="#C9CED3" stroke={INK} strokeWidth="3" />
        <path d="M 30 18 L 230 18 L 246 104 Q 246 114 236 114 L 24 114 Q 14 114 14 104 Z" fill="#F4F4F2" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <rect x="46" y="36" width="168" height="44" rx="6" fill="#16261C" stroke={INK} strokeWidth="3" />
        <text x="198" y="68" textAnchor="end" fontFamily="ui-monospace, Consolas, monospace" fontSize="30" fontWeight="700" fill="#7CF29C">{tekst}</text>
        <text x="206" y="68" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="700" fill="#7CF29C">g</text>
        <text x="46" y="102" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill={INK}>max 500 g</text>
        {/* de nulknop: de weegschaal staat al op nul (spelopzet §6) */}
        <rect x="170" y="88" width="44" height="18" rx="9" fill="#ffffff" stroke={INK} strokeWidth="2" />
        <text x="192" y="101" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill={INK}>NUL</text>
      </svg>
    </div>
  );
});

export default Weegschaal;
