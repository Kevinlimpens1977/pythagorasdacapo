import { useEffect, useRef } from 'react';
import { ArrowRight, Star, Target } from 'lucide-react';
import { formatStudyDuration } from '../../lib/studyRouteState';
import { PLUS_LABEL, PLUS_UITLEG_LEERLING } from '../../lib/paragraphMetadata';

// Startscherm van een paragraaf: één compact venster met de leerdoelen als losse
// zinnen. Niet de route, niet de stappenlijst - alleen wat je gaat leren, en één
// knop om te beginnen.
export default function LearningGoalsIntro({
  open,
  intro,
  paragraafTitle = '',
  hoofdstukTitle = '',
  optioneel = false,
  onContinue
}) {
  const continueRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    continueRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter') {
        event.preventDefault();
        onContinue?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onContinue, open]);

  if (!open || !intro?.items?.length) return null;

  // Studieduur en bewijsproduct zijn bijzaak: ze staan als één regel onder de
  // doelen, niet als rij badges die het venster hoger maakt.
  const caption = [
    intro.stepCount > 0 ? `${intro.stepCount} ${intro.stepCount === 1 ? 'stap' : 'stappen'}` : '',
    formatStudyDuration(intro.estimatedMinutes),
    intro.evidenceProduct
  ]
    .filter(Boolean)
    .join(' · ');
  const context = [hoofdstukTitle, paragraafTitle].filter(Boolean).join(' · ');

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-[rgba(11,19,43,0.42)] p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leerdoelen-intro-titel"
        className="helix-surface flex max-h-[86vh] w-full max-w-lg flex-col overflow-hidden p-5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="helix-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white">
            <Target size={18} />
          </span>
          <div className="min-w-0">
            <h2
              id="leerdoelen-intro-titel"
              className="font-display text-xl font-extrabold tracking-tight text-[var(--helix-navy)]"
            >
              {intro.heading}
            </h2>
            {context && (
              <p className="truncate text-xs font-bold text-[var(--helix-muted)]">{context}</p>
            )}
          </div>
        </div>

        {/* Een plusparagraaf zegt hier meteen wat hij is. Dit is het eerste dat
            een leerling van de paragraaf ziet, dus hier hoort de belofte te
            staan: je hoeft dit niet, je mag dit - en het levert tokens op. */}
        {optioneel && (
          <div className="mt-4 rounded-[var(--helix-radius-lg)] border border-[rgba(122,60,255,0.35)] bg-[var(--helix-soft-lavender)] p-4">
            <p className="flex items-center gap-2 font-display text-sm font-extrabold text-[var(--helix-purple)]">
              <Star size={15} />
              {PLUS_LABEL}
            </p>
            <p className="mt-1.5 text-sm font-semibold leading-6 text-[var(--helix-navy)]">
              {PLUS_UITLEG_LEERLING}
            </p>
          </div>
        )}

        <ul className="custom-scrollbar mt-4 min-h-0 space-y-2 overflow-y-auto rounded-[var(--helix-radius-lg)] border border-[rgba(122,60,255,0.18)] bg-[var(--helix-soft-lavender)]/70 p-4 sm:p-5">
          {intro.items.map((item, index) => (
            <li key={`${index}-${item}`} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--helix-purple)]"
              />
              <span className="text-[15px] font-semibold leading-6 text-[var(--helix-navy)]">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {caption ? (
            <p className="text-xs font-bold text-[var(--helix-muted)]">{caption}</p>
          ) : (
            <span />
          )}
          <button ref={continueRef} type="button" onClick={onContinue} className="helix-btn-solid">
            Verder
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
