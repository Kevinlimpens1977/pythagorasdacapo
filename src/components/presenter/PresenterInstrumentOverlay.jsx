import { useEffect, useId, useRef } from 'react';

const instruments = {
  ruler: 'Liniaal',
  triangle: 'Geodriehoek',
  compass: 'Passer',
  protractor: 'Gradenboog'
};

const tickClass = 'absolute top-0 w-px bg-slate-700';

const RulerVisual = () => (
  <div className="relative h-24 w-[min(72vw,680px)] rounded-md border-2 border-amber-900/60 bg-amber-200/86 shadow-xl">
    {Array.from({ length: 25 }).map((_, index) => (
      <span
        aria-hidden="true"
        className={`${tickClass} ${index % 4 === 0 ? 'h-14' : index % 2 === 0 ? 'h-10' : 'h-7'}`}
        key={index}
        style={{ left: `${(index / 24) * 100}%` }}
      />
    ))}
    <div className="absolute inset-x-4 bottom-4 h-2 rounded-full bg-amber-900/20" />
  </div>
);

const TriangleVisual = () => (
  <svg
    aria-hidden="true"
    className="h-[min(50vw,360px)] w-[min(72vw,520px)] drop-shadow-xl"
    viewBox="0 0 520 360"
  >
    <path d="M 42 318 L 478 318 L 42 42 Z" fill="rgba(186, 230, 253, 0.64)" stroke="#0f172a" strokeWidth="10" />
    <path d="M 128 268 L 348 268 L 128 128 Z" fill="rgba(248, 250, 252, 0.72)" stroke="#0f172a" strokeWidth="7" />
    <path d="M 62 294 L 104 294 L 104 252" fill="none" stroke="#0f172a" strokeLinecap="round" strokeWidth="6" />
    {Array.from({ length: 12 }).map((_, index) => (
      <line
        key={index}
        stroke="#334155"
        strokeLinecap="round"
        strokeWidth="4"
        x1={82 + index * 32}
        x2={82 + index * 32}
        y1="318"
        y2={index % 2 === 0 ? 292 : 302}
      />
    ))}
  </svg>
);

const CompassVisual = () => (
  <svg
    aria-hidden="true"
    className="h-[min(56vw,430px)] w-[min(64vw,430px)] drop-shadow-xl"
    viewBox="0 0 420 420"
  >
    <circle cx="210" cy="58" fill="#f8fafc" r="34" stroke="#0f172a" strokeWidth="10" />
    <path d="M 204 91 L 138 358" fill="none" stroke="#0f172a" strokeLinecap="round" strokeWidth="18" />
    <path d="M 218 91 L 294 358" fill="none" stroke="#0f172a" strokeLinecap="round" strokeWidth="18" />
    <path d="M 137 358 L 116 398 L 160 366 Z" fill="#0f172a" />
    <path d="M 294 358 L 308 398 L 272 366 Z" fill="#475569" />
    <path d="M 156 264 Q 210 230 276 264" fill="none" stroke="#2563eb" strokeDasharray="10 12" strokeLinecap="round" strokeWidth="8" />
    <circle cx="210" cy="112" fill="#2563eb" r="12" />
  </svg>
);

const ProtractorVisual = () => (
  <svg
    aria-hidden="true"
    className="h-[min(44vw,320px)] w-[min(76vw,620px)] drop-shadow-xl"
    viewBox="0 0 620 320"
  >
    <path
      d="M 58 286 A 252 252 0 0 1 562 286 L 468 286 A 158 158 0 0 0 152 286 Z"
      fill="rgba(186, 230, 253, 0.68)"
      stroke="#0f172a"
      strokeWidth="10"
    />
    <line x1="58" x2="562" y1="286" y2="286" stroke="#0f172a" strokeLinecap="round" strokeWidth="10" />
    {Array.from({ length: 19 }).map((_, index) => {
      const angle = Math.PI - (Math.PI * index) / 18;
      const outerRadius = 235;
      const innerRadius = index % 3 === 0 ? 188 : 206;
      const centerX = 310;
      const centerY = 286;

      return (
        <line
          key={index}
          stroke="#334155"
          strokeLinecap="round"
          strokeWidth={index % 3 === 0 ? 5 : 3}
          x1={centerX + Math.cos(angle) * innerRadius}
          x2={centerX + Math.cos(angle) * outerRadius}
          y1={centerY - Math.sin(angle) * innerRadius}
          y2={centerY - Math.sin(angle) * outerRadius}
        />
      );
    })}
    <circle cx="310" cy="286" fill="#0f172a" r="9" />
  </svg>
);

const instrumentVisuals = {
  ruler: RulerVisual,
  triangle: TriangleVisual,
  compass: CompassVisual,
  protractor: ProtractorVisual
};

export default function PresenterInstrumentOverlay({ instrument, onClose }) {
  const label = instruments[instrument];
  const Visual = instrumentVisuals[instrument];
  const titleId = useId();
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!instrument || !label || !Visual) return undefined;

    const previousActiveElement = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = Array.from(
        overlayRef.current?.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter((element) => element.offsetParent !== null);

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;
      const focusTarget = event.shiftKey ? lastElement : firstElement;

      if (!overlayRef.current?.contains(activeElement)) {
        event.preventDefault();
        focusTarget.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (typeof previousActiveElement?.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [instrument, label, onClose, Visual]);

  if (!instrument || !label || !Visual) return null;

  return (
    <div
      ref={overlayRef}
      className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center bg-slate-950/15 px-4 py-8"
    >
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="flex max-w-[min(92vw,760px)] flex-col items-center gap-4 rounded-lg border border-slate-500/70 bg-slate-100/88 p-4 shadow-2xl backdrop-blur-sm sm:p-5"
        role="dialog"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <h2 className="text-base font-black text-slate-950 sm:text-lg" id={titleId}>{label}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-slate-700 bg-slate-950 px-4 text-sm font-black text-slate-50 transition hover:bg-slate-800"
            onClick={onClose}
          >
            Sluit tool
          </button>
        </div>
        <div className="flex min-h-44 w-full items-center justify-center overflow-hidden rounded-md bg-slate-50/70 p-4 ring-1 ring-slate-300">
          <Visual />
        </div>
      </div>
    </div>
  );
}
