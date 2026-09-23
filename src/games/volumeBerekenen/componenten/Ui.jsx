import { CheckCircle2, CircleHelp, XCircle } from 'lucide-react';
import { EENHEDEN } from '../volumeLogic';

// Bouwstenen in de stijl van het 2.2-deck en het Helix Slide Design System v2:
// geel titelanker, crème canvas, zwarte contour, blauw = actie, groen = goed, rood = fout, oranje = hulp.

const FASE_KLEUR = {
  KIJK: 'bg-[#087EB5] text-white',
  DOE: 'bg-[#0B0D0F] text-[#FFD33D]',
  CHECK: 'bg-[#2E9D63] text-white',
  KLAAR: 'bg-[#2E9D63] text-white'
};

export function Schil({ titel, fase, voortgang, children }) {
  return (
    <div className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFF7E8] text-[#0B0D0F] shadow-[6px_6px_0_#0B0D0F]">
      <header className="ds-anchor flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <h2 className="ds-display text-[26px] sm:text-[34px]">{titel}</h2>
        <div className="flex items-center gap-3">
          {voortgang && <span className="text-sm font-bold">{voortgang}</span>}
          {fase && (
            <span className={`rounded-full border-2 border-[#0B0D0F] px-3 py-1 text-sm font-extrabold tracking-wide ${FASE_KLEUR[fase] || ''}`}>
              {fase}
            </span>
          )}
        </div>
      </header>
      <div className="flex-1 p-3 sm:p-5">{children}</div>
    </div>
  );
}

// SPLIT: beeld links (ongeveer 60-65%), paneel rechts. Op een telefoon onder elkaar.
export function Split({ beeld, paneel }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border-[3px] border-[#0B0D0F] bg-[#DCEFFA] bg-cover bg-bottom p-3" style={{ backgroundImage: "url('/games/volume-berekenen/achtergrond.webp')" }}>
        <div className="relative z-10 flex w-full items-center justify-center">{beeld}</div>
      </div>
      <div className="flex flex-col gap-3 rounded-2xl border-[3px] border-[#0B0D0F] bg-white p-4 sm:p-5">{paneel}</div>
    </div>
  );
}

export function Knop({ children, onClick, variant = 'actie', disabled = false, type = 'button', autoFocus = false, className = '' }) {
  const stijl = {
    actie: 'bg-[#087EB5] text-white hover:bg-[#066A99]',
    rustig: 'bg-white text-[#0B0D0F] hover:bg-[#FFF7E8]',
    hulp: 'bg-[#FDE7D6] text-[#B4520E] hover:bg-[#FBD7BA]',
    goed: 'bg-[#2E9D63] text-white hover:bg-[#237A4D]'
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border-[2.5px] border-[#0B0D0F] px-4 py-2 text-base font-extrabold shadow-[3px_3px_0_#0B0D0F] transition active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${stijl} ${className}`}
    >
      {children}
    </button>
  );
}

export function Opdracht({ children }) {
  return <p className="text-lg font-bold leading-snug">{children}</p>;
}

export function GetalVeld({ waarde, onChange, label, eenheid, onEnter, autoFocus = false, breed = false, fout = false, disabled = false }) {
  return (
    <label className="flex flex-wrap items-center gap-2 text-base font-bold">
      {label && <span className="min-w-[5.5rem]">{label}</span>}
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={waarde}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter') onEnter?.(); }}
        className={`${breed ? 'w-36' : 'w-24'} rounded-lg border-[2.5px] px-3 py-2 text-lg font-bold outline-none focus:ring-4 focus:ring-[#087EB5]/30 ${fout ? 'border-[#D83A2E] bg-[#FADDDA]' : 'border-[#0B0D0F] bg-white'} disabled:bg-[#FBEBD0]`}
      />
      {eenheid && <span>{eenheid}</span>}
    </label>
  );
}

export function EenheidKeuze({ waarde, onChange, disabled = false }) {
  return (
    <div className="flex gap-2" role="radiogroup" aria-label="Eenheid">
      {EENHEDEN.map((eenheid) => (
        <button
          key={eenheid}
          type="button"
          role="radio"
          aria-checked={waarde === eenheid}
          disabled={disabled}
          onClick={() => onChange(eenheid)}
          className={`min-h-[44px] min-w-[3.5rem] rounded-lg border-[2.5px] border-[#0B0D0F] px-3 text-lg font-extrabold ${waarde === eenheid ? 'bg-[#0B0D0F] text-[#FFD33D]' : 'bg-white text-[#0B0D0F]'}`}
        >
          {eenheid}
        </button>
      ))}
    </div>
  );
}

// CHECK na een goed antwoord: STATUS-scherm zoals "Controleer je antwoord" in het deck.
export function CheckGoed({ groot, klein, punten, onVolgende, knopTekst = 'Volgende' }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-[3px] border-[#2E9D63] bg-[#DFF2E7] p-4 text-center">
      <CheckCircle2 size={40} className="text-[#237A4D]" aria-hidden="true" />
      <p className="text-[34px] font-extrabold leading-none text-[#237A4D] [text-shadow:0_0_16px_#bff0d4]">{groot}</p>
      {klein && <p className="text-base font-bold">{klein}</p>}
      {punten !== undefined && <p className="text-sm font-bold text-[#237A4D]">Goed. +{punten} punten</p>}
      <Knop variant="goed" onClick={onVolgende} autoFocus>{knopTekst}</Knop>
    </div>
  );
}

// Uitleg na een fout: kruis + tekst (kleur is nooit de enige drager).
export function FoutKaart({ titel = 'Nog niet goed', tekst, stappen }) {
  return (
    <div className="rounded-2xl border-[3px] border-[#D83A2E] bg-[#FADDDA] p-3" role="alert">
      <p className="flex items-center gap-2 font-extrabold text-[#B42F25]">
        <XCircle size={22} aria-hidden="true" /> {titel}
      </p>
      {tekst && <p className="mt-1 font-bold">{tekst}</p>}
      {stappen && (
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[15px] font-semibold">
          {stappen.map((stap) => <li key={stap}>{stap}</li>)}
        </ol>
      )}
    </div>
  );
}

export function HintKaart({ stappen }) {
  return (
    <div className="rounded-2xl border-[3px] border-[#F47A20] bg-[#FDE7D6] p-3">
      <p className="flex items-center gap-2 font-extrabold text-[#B4520E]">
        <CircleHelp size={20} aria-hidden="true" /> Hint
      </p>
      <ol className="mt-1 list-decimal space-y-1 pl-5 text-[15px] font-semibold">
        {stappen.map((stap) => <li key={stap}>{stap}</li>)}
      </ol>
    </div>
  );
}

export function Keuzes({ opties, gekozen, goed, onKies, disabled }) {
  return (
    <div className="flex flex-col gap-2">
      {opties.map((optie, index) => {
        const label = String.fromCharCode(65 + index);
        const isGekozen = gekozen === optie.id;
        const toonGoed = disabled && optie.id === goed;
        const toonFout = isGekozen && optie.id !== goed;
        return (
          <button
            key={optie.id}
            type="button"
            disabled={disabled}
            onClick={() => onKies(optie.id)}
            className={`flex min-h-[48px] items-start gap-3 rounded-xl border-[2.5px] border-[#0B0D0F] px-3 py-2 text-left text-base font-bold transition ${toonGoed ? 'bg-[#DFF2E7]' : toonFout ? 'bg-[#FADDDA]' : 'bg-white hover:bg-[#E1F0F8]'}`}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0B0D0F] bg-[#FFD33D] text-sm font-extrabold">{label}</span>
            <span className="pt-0.5">{optie.tekst}</span>
            {toonGoed && <CheckCircle2 size={20} className="ml-auto shrink-0 text-[#237A4D]" aria-label="goed" />}
            {toonFout && <XCircle size={20} className="ml-auto shrink-0 text-[#B42F25]" aria-label="fout" />}
          </button>
        );
      })}
    </div>
  );
}

export function Stappen({ stappen, actief }) {
  return (
    <ol className="flex flex-col gap-2">
      {stappen.map((stap, index) => (
        <li
          key={stap}
          className={`flex items-start gap-3 rounded-xl border-2 px-3 py-2 text-[15px] font-bold transition ${index === actief ? 'border-[#0B0D0F] bg-[#FFF0B8]' : index < actief ? 'border-[#E8DCC3] bg-white text-[#5B5648]' : 'border-transparent opacity-40'}`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[#0B0D0F] bg-[#FFD33D] text-sm font-extrabold text-[#0B0D0F]">{index + 1}</span>
          <span className="pt-0.5">{stap}</span>
        </li>
      ))}
    </ol>
  );
}
