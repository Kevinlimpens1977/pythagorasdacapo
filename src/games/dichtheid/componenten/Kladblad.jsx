import { NotebookPen } from 'lucide-react';

// Het kladblaadje met de zes rekenstappen van dia 13. Elke regel is een tekst;
// '…' staat voor wat nog open is. De regel waar de leerling nu is, licht op.
const REGELS = [
  ['gegeven', 'Gegeven'],
  ['gevraagd', 'Gevraagd'],
  ['formule', 'Formule'],
  ['invullen', 'Invullen'],
  ['berekenen', 'Berekenen'],
  ['eenheid', 'Eenheid']
];

export default function Kladblad({ regels, actief = null }) {
  return (
    <div className="rounded-xl border-[2.5px] border-[#0B0D0F] bg-[repeating-linear-gradient(#FFFDF6,#FFFDF6_27px,#DCEFFA_28px)] px-3 pb-2 pt-1.5">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-[#066A99]">
        <NotebookPen size={14} aria-hidden="true" /> Kladblad
      </p>
      <dl className="grid grid-cols-[6.2rem_1fr] gap-x-2 text-[15px] leading-7">
        {REGELS.map(([id, naam]) => (
          <div key={id} className={`contents ${actief === id ? '[&>*]:bg-[#FFF0B8]' : ''}`}>
            <dt className="rounded-l-md pl-1 font-extrabold">{naam}:</dt>
            <dd className={`whitespace-pre-line rounded-r-md pr-1 font-mono font-bold ${regels[id] ? '' : 'text-[#B9B09C]'}`}>{regels[id] ? regels[id].replace(/\s{3,}/g, '\n') : '…'}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
