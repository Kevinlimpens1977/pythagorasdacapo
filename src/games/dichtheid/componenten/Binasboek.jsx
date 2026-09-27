import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Search, X } from 'lucide-react';
import { fRho, STOFFEN } from '../dichtheidLogic';
import { BoekContext, useBoek } from './boekContext';

// Het boekje met dichtheden, zoals Binas: klein icoon rechtsboven, klik en het
// klapt open. In een stap "welke stof is het?" kiest de leerling hier de stof.

export function BoekProvider({ children }) {
  const [staat, setStaat] = useState({ open: false, onKies: null });
  const waarde = useMemo(() => ({
    open: (onKies = null) => setStaat({ open: true, onKies }),
    sluit: () => setStaat({ open: false, onKies: null }),
    isOpen: staat.open,
    onKies: staat.onKies
  }), [staat]);
  return <BoekContext.Provider value={waarde}>{children}</BoekContext.Provider>;
}

export function BoekKnop() {
  const boek = useBoek();
  return (
    <button
      type="button"
      onClick={() => boek.open()}
      className="flex h-11 items-center gap-1.5 rounded-xl border-[2.5px] border-[#0B0D0F] bg-white px-2.5 text-sm font-extrabold shadow-[2px_2px_0_#0B0D0F]"
      aria-label="Open het boekje met dichtheden"
      title="Boekje met dichtheden"
    >
      <BookOpen size={22} aria-hidden="true" /> <span className="hidden sm:inline">Boekje</span>
    </button>
  );
}

function Kolom({ stoffen, onKies }) {
  return (
    <table className="w-full border-collapse text-[15px]">
      <thead>
        <tr className="border-b-2 border-[#0B0D0F] text-left">
          <th className="py-1 pr-2 font-extrabold">Stof</th>
          <th className="py-1 text-right font-extrabold">ρ (g/cm³)</th>
          {onKies && <th className="w-16" aria-label="Kiezen" />}
        </tr>
      </thead>
      <tbody>
        {stoffen.map((stof) => (
          <tr key={stof.id} className="border-b border-[#E8DCC3]">
            <td className="py-1 pr-2 font-semibold">{stof.naam}</td>
            <td className="py-1 text-right font-mono font-bold">{fRho(stof.rho)}</td>
            {onKies && (
              <td className="py-0.5 pl-2 text-right">
                <button type="button" onClick={() => onKies(stof.id)} className="rounded-md border-2 border-[#0B0D0F] bg-[#087EB5] px-2 py-0.5 text-xs font-extrabold text-white" aria-label={`${stof.naam} is het`}>
                  Deze
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Binasboek() {
  const boek = useBoek();
  const [zoek, setZoek] = useState('');
  const [sortering, setSortering] = useState('rho');
  const sluitRef = useRef(null);

  useEffect(() => {
    if (!boek.isOpen) return undefined;
    sluitRef.current?.focus();
    const toets = (event) => { if (event.key === 'Escape') boek.sluit(); };
    window.addEventListener('keydown', toets);
    return () => window.removeEventListener('keydown', toets);
  }, [boek]);

  if (!boek.isOpen) return null;

  const lijst = STOFFEN
    .filter((stof) => stof.naam.toLowerCase().includes(zoek.trim().toLowerCase()))
    .sort((a, b) => (sortering === 'rho' ? a.rho - b.rho : a.naam.localeCompare(b.naam, 'nl')));
  const helft = Math.ceil(lijst.length / 2);
  const kies = boek.onKies ? (id) => { boek.onKies(id); boek.sluit(); } : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D0F]/40 p-3" onClick={boek.sluit} role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Boekje met dichtheden"
        onClick={(event) => event.stopPropagation()}
        className="dichtheid-boek flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFFDF6] text-[#0B0D0F] shadow-[6px_6px_0_#0B0D0F] [color-scheme:light]"
      >
        <div className="flex items-center justify-between gap-2 border-b-[3px] border-[#0B0D0F] bg-[#087EB5] px-4 py-2 text-white">
          <p className="flex items-center gap-2 text-lg font-extrabold"><BookOpen size={22} aria-hidden="true" /> Dichtheid van stoffen</p>
          <button ref={sluitRef} type="button" onClick={boek.sluit} className="rounded-lg border-2 border-white p-1" aria-label="Boekje sluiten"><X size={20} /></button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b-2 border-[#E8DCC3] px-4 py-2">
          <label className="flex items-center gap-2 rounded-lg border-2 border-[#0B0D0F] bg-white px-2">
            <Search size={16} aria-hidden="true" />
            <input value={zoek} onChange={(event) => setZoek(event.target.value)} placeholder="Zoek een stof" className="w-36 bg-white py-1.5 font-semibold text-[#0B0D0F] outline-none placeholder:text-[#8A8373]" aria-label="Zoek een stof" />
          </label>
          <div className="flex gap-1" role="group" aria-label="Sorteren">
            {[['rho', 'op dichtheid'], ['naam', 'op naam']].map(([id, tekst]) => (
              <button key={id} type="button" aria-pressed={sortering === id} onClick={() => setSortering(id)} className={`rounded-lg border-2 border-[#0B0D0F] px-2 py-1 text-sm font-extrabold ${sortering === id ? 'bg-[#0B0D0F] text-[#FFD33D]' : 'bg-white'}`}>
                {tekst}
              </button>
            ))}
          </div>
          {kies && <p className="w-full text-sm font-bold text-[#066A99]">Kies de stof die bij jouw dichtheid hoort.</p>}
        </div>
        <div className="grid gap-x-6 overflow-y-auto px-4 py-2 sm:grid-cols-2">
          <Kolom stoffen={lijst.slice(0, helft)} onKies={kies} />
          <Kolom stoffen={lijst.slice(helft)} onKies={kies} />
          {lijst.length === 0 && <p className="py-4 font-bold">Geen stof gevonden.</p>}
        </div>
      </div>
      <style>{`
        .dichtheid-boek { animation: dichtheid-boek-open 380ms cubic-bezier(.2,.8,.3,1); transform-origin: top right; }
        @keyframes dichtheid-boek-open { from { transform: perspective(900px) rotateY(-70deg) scale(.4); opacity: 0; } to { transform: none; opacity: 1; } }
        @media (prefers-reduced-motion: reduce) { .dichtheid-boek { animation: none; } }
      `}</style>
    </div>
  );
}
