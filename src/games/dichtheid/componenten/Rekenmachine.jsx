import { useState } from 'react';
import { Calculator, ChevronDown, Delete } from 'lucide-react';
import { evaluateCalculatorExpression } from '../../../lib/calculatorEvaluator';

// Klein zakrekenmachientje. Rekent met de veilige evaluator (geen eval) en laat
// het hele getal zien: afronden doet de leerling zelf.
const TOETSEN = ['7', '8', '9', ':', '4', '5', '6', '×', '1', '2', '3', '-', '0', ',', '=', '+'];

function rekenUit(som) {
  try {
    const uitkomst = evaluateCalculatorExpression(som);
    if (!Number.isFinite(uitkomst)) return null;
    return String(Math.round(uitkomst * 1e8) / 1e8).replace('.', ',');
  } catch {
    return null;
  }
}

export default function Rekenmachine({ onGebruik = null, beginOpen = false }) {
  const [open, setOpen] = useState(beginOpen);
  // Eén toestand, zodat ook snel achter elkaar tikken goed gaat.
  const [staat, setStaat] = useState({ som: '', uitkomst: null });
  const { som, uitkomst } = staat;

  const druk = (toets) => setStaat((oud) => {
    if (toets === '=') return { som: oud.som, uitkomst: rekenUit(oud.som) ?? 'Fout' };
    if (oud.uitkomst !== null) {
      // Verder rekenen met de uitkomst na een bewerking, anders opnieuw beginnen.
      const verder = /[:×+-]/.test(toets) && oud.uitkomst !== 'Fout';
      return { som: verder ? `${oud.uitkomst}${toets}` : toets, uitkomst: null };
    }
    return { som: `${oud.som}${toets}`.slice(0, 40), uitkomst: null };
  });

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-[44px] items-center gap-2 self-start rounded-xl border-[2.5px] border-[#0B0D0F] bg-white px-3 font-extrabold">
        <Calculator size={18} aria-hidden="true" /> Rekenmachine
      </button>
    );
  }

  return (
    <div className="w-full max-w-[260px] self-start rounded-2xl border-[3px] border-[#0B0D0F] bg-[#2B3036] p-2 shadow-[3px_3px_0_#0B0D0F]">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wide text-[#FFD33D]"><Calculator size={14} aria-hidden="true" /> Rekenmachine</span>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 text-white" aria-label="Rekenmachine inklappen"><ChevronDown size={18} /></button>
      </div>
      <div className="mb-2 rounded-lg border-2 border-[#0B0D0F] bg-[#C9E4C5] px-2 py-1 text-right font-mono" aria-live="polite">
        <div className="min-h-[18px] truncate text-sm text-[#2B3036]">{uitkomst !== null ? som : ' '}</div>
        <div className="truncate text-2xl font-bold text-[#0B0D0F]">{uitkomst ?? (som || '0')}</div>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TOETSEN.map((toets) => (
          <button
            key={toets}
            type="button"
            onClick={() => druk(toets)}
            className={`min-h-[42px] rounded-lg border-2 border-[#0B0D0F] text-lg font-extrabold ${toets === '=' ? 'bg-[#FFD33D]' : /[:×+-]/.test(toets) ? 'bg-[#DCEFFA]' : 'bg-white'}`}
            aria-label={{ ':': 'gedeeld door', '×': 'keer', '-': 'min', '+': 'plus', '=': 'is', ',': 'komma' }[toets] || toets}
          >
            {toets}
          </button>
        ))}
        <button type="button" onClick={() => setStaat({ som: '', uitkomst: null })} className="col-span-2 min-h-[40px] rounded-lg border-2 border-[#0B0D0F] bg-[#FADDDA] font-extrabold">C</button>
        <button type="button" onClick={() => setStaat((oud) => ({ som: oud.som.slice(0, -1), uitkomst: null }))} className="col-span-2 flex min-h-[40px] items-center justify-center rounded-lg border-2 border-[#0B0D0F] bg-white" aria-label="Wis laatste teken"><Delete size={18} /></button>
      </div>
      {onGebruik && uitkomst && uitkomst !== 'Fout' && (
        <button type="button" onClick={() => onGebruik(uitkomst)} className="mt-2 w-full rounded-lg border-2 border-[#0B0D0F] bg-[#087EB5] py-1.5 text-sm font-extrabold text-white">
          Zet {uitkomst} in het vak
        </button>
      )}
    </div>
  );
}
