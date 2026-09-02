import { ArrowRight, Check } from 'lucide-react';

// Zwevende bevestiging nadat de leerling een leesstap zelf heeft afgerond.
// Klein, maar het moet voelen als een afgevinkte stap.
export default function StudyConfirmBar({ open, message = '', actionLabel = 'Volgende', onAction }) {
  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="study-confirm-bar pointer-events-none absolute inset-x-0 bottom-full z-30 flex justify-center px-4 pb-3"
    >
      <div className="pointer-events-auto flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[rgba(34,197,94,0.32)] bg-white px-4 py-3 shadow-[0_18px_44px_rgba(11,19,43,0.16)] sm:gap-4 sm:px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(34,197,94,0.14)] text-[#237A4D]">
          <Check size={18} strokeWidth={3.2} />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-black text-[var(--helix-navy)]">{message}</p>
        <button type="button" onClick={onAction} className="helix-btn-solid shrink-0 px-4 py-2.5 text-sm">
          {actionLabel}
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
