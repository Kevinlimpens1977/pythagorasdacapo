import { useEffect, useRef, useState } from 'react';
import { Droplets, RotateCcw } from 'lucide-react';
import { CilinderInhoud } from '../../volumeBerekenen/componenten/Maatcilinder';
import { GEOMETRIE } from '../../volumeBerekenen/componenten/cilinderGeometrie';
import { Knop } from '../../volumeBerekenen/componenten/Ui';
import { SCHALEN } from '../../volumeBerekenen/volumeLogic';
import { PRACTICUM_SCHAAL } from '../dichtheidLogic';
import Sleepbaar from './Sleepbaar';
import { wilMinderBeweging } from './beweging';

const INK = '#0B0D0F';
const SCHAAL = SCHALEN[PRACTICUM_SCHAAL];
const ML_PER_SECONDE = 14;

// De maatcilinder van het practicum als losse tekening met een vaste hoogte.
export function Cilinder({ niveau, voorwerp = null, zonderSchaal = false, hoogte = 'h-[300px] sm:h-[380px]', idPrefix = 'pc', vloeistofKleur }) {
  return (
    <svg viewBox={`0 0 ${GEOMETRIE.breedte} ${GEOMETRIE.hoogte}`} className={`${hoogte} w-auto shrink-0 select-none`} role="img" aria-label={zonderSchaal ? 'Maatcilinder zonder schaal' : 'Maatcilinder van 100 ml'}>
      <CilinderInhoud schaal={SCHAAL} niveau={niveau} voorwerp={voorwerp} zonderSchaal={zonderSchaal} idPrefix={idPrefix} {...(vloeistofKleur ? { vloeistofKleur } : {})} />
    </svg>
  );
}

function KraanTekening({ open }) {
  return (
    <svg viewBox="0 0 200 110" className="h-auto w-[170px]" aria-hidden="true">
      <rect x="120" y="30" width="80" height="22" fill="#B8BEC4" stroke={INK} strokeWidth="3" />
      <path d="M 120 30 L 70 30 Q 50 30 50 50 L 50 78 L 76 78 L 76 56 Q 76 52 80 52 L 120 52" fill="#C9CED3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="44" y="76" width="38" height="12" rx="3" fill="#9AA1A8" stroke={INK} strokeWidth="3" />
      <g style={{ transform: `rotate(${open ? 70 : 0}deg)`, transformOrigin: '98px 24px', transition: 'transform 250ms' }}>
        <rect x="93" y="8" width="10" height="22" fill="#9AA1A8" stroke={INK} strokeWidth="2.5" />
        <rect x="74" y="2" width="48" height="12" rx="6" fill="#D83A2E" stroke={INK} strokeWidth="3" />
      </g>
    </svg>
  );
}

// Het vullen onder de kraan (spelopzet §5.3). Onder de kraan staan er geen
// cijfers op de cilinder; pas op tafel verschijnt de schaal. Het niveau eindigt
// altijd op een heel streepje. `controle(niveau)` zegt of het genoeg is.
export default function KraanScene({ controle, onKlaar }) {
  const [plek, setPlek] = useState('tafel');
  const [open, setOpen] = useState(false);
  const [niveau, setNiveau] = useState(0);
  const [melding, setMelding] = useState(null);
  const onderRef = useRef(null);
  const niveauRef = useRef(0);

  useEffect(() => {
    if (!open) return undefined;
    let vorige = performance.now();
    let frame = null;
    const stap = (nu) => {
      const nieuw = Math.min(SCHAAL.max - 2, niveauRef.current + ((nu - vorige) / 1000) * ML_PER_SECONDE);
      vorige = nu;
      niveauRef.current = nieuw;
      setNiveau(nieuw);
      if (nieuw >= SCHAAL.max - 2) { setOpen(false); return; }
      frame = window.requestAnimationFrame(stap);
    };
    frame = window.requestAnimationFrame(stap);
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const zetOnder = () => { setPlek('onder'); setMelding(null); };
  const opTafel = () => {
    setOpen(false);
    const afgerond = Math.round(niveauRef.current);
    niveauRef.current = afgerond;
    setNiveau(afgerond);
    setPlek('klaar');
    const uitslag = controle(afgerond);
    setMelding(uitslag.goed ? null : uitslag.tekst);
  };
  const opnieuw = () => {
    niveauRef.current = 0;
    setNiveau(0);
    setMelding(null);
    setPlek('onder');
  };

  const straal = open && plek === 'onder';
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full flex-wrap items-end justify-center gap-4">
        <div className="flex min-h-[320px] w-[150px] flex-col items-center justify-end rounded-2xl border-2 border-dashed border-[#B9B09C] bg-white/50 p-2">
          <span className="mb-auto text-xs font-extrabold uppercase text-[#5B5648]">Tafel</span>
          {plek === 'tafel' && (
            <Sleepbaar doelen={[{ id: 'onder', ref: onderRef }]} onDrop={zetOnder} label="Maatcilinder. Sleep hem onder de kraan.">
              <Cilinder niveau={0} zonderSchaal hoogte="h-[250px]" idPrefix="kr1" />
            </Sleepbaar>
          )}
          {plek === 'klaar' && <Cilinder niveau={niveau} hoogte="h-[250px]" idPrefix="kr2" />}
        </div>
        <div ref={onderRef} className={`relative flex min-h-[320px] w-[190px] flex-col items-center justify-end rounded-2xl border-2 border-dashed p-2 ${plek === 'tafel' ? 'border-[#087EB5] bg-[#E1F0F8]/70' : 'border-[#B9B09C] bg-white/50'}`}>
          <div className="absolute left-1/2 top-1 -translate-x-[31%]"><KraanTekening open={open} /></div>
          {straal && (
            <div
              className={`absolute left-[calc(50%-4px)] top-[78px] w-[7px] rounded-b bg-[#6FBDE8] ${wilMinderBeweging() ? '' : 'animate-pulse'}`}
              style={{ height: 'calc(100% - 120px)' }}
              aria-hidden="true"
            />
          )}
          {plek === 'onder' && <Cilinder niveau={niveau} zonderSchaal hoogte="h-[230px]" idPrefix="kr3" />}
          {plek === 'tafel' && <span className="text-sm font-bold text-[#066A99]">Zet hem hier neer</span>}
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {plek === 'tafel' && <Knop onClick={zetOnder}>Zet de cilinder onder de kraan</Knop>}
        {plek === 'onder' && (
          <>
            <Knop onClick={() => setOpen((oud) => !oud)} variant={open ? 'hulp' : 'actie'}>
              <Droplets size={18} aria-hidden="true" />{open ? 'Kraan dicht' : 'Kraan open'}
            </Knop>
            <Knop variant="goed" onClick={opTafel} disabled={open || niveau < 1}>Klaar: zet hem op tafel</Knop>
          </>
        )}
        {plek === 'klaar' && melding && (
          <Knop variant="rustig" onClick={opnieuw}><RotateCcw size={18} aria-hidden="true" />Leeg gieten en opnieuw vullen</Knop>
        )}
      </div>
      {melding && <p className="rounded-xl border-2 border-[#D83A2E] bg-[#FADDDA] px-3 py-2 text-center font-bold" role="alert">{melding}</p>}
      {plek === 'klaar' && !melding && (
        <Knop variant="goed" onClick={() => onKlaar(niveau)} autoFocus>Goed zo. Verder</Knop>
      )}
    </div>
  );
}
