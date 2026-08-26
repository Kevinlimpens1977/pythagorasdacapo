import { BookOpen, Check, DoorOpen, Star, Target } from 'lucide-react';
import { PLUS_LABEL, PLUS_UITLEG_LEERLING } from '../../lib/paragraphMetadata';

// Linkerbalk van de studeerweergave: de stappen van deze paragraaf, met de actieve
// stap gevuld, een vinkje bij wat af is, en onderin een duidelijke uitgang.
export default function StudyStepRail({
  paragraafTitle = '',
  hoofdstukTitle = '',
  optioneel = false,
  steps = [],
  summary = { total: 0, done: 0, percentage: 0 },
  iconForType = () => BookOpen,
  hasIntro = false,
  isIntroActive = false,
  isIntroDone = false,
  onOpenIntro,
  onSelectStep,
  onExit,
  exitLabel = 'Stop met oefenen'
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-[var(--helix-border)] px-5 py-5">
        <p className="helix-eyebrow">Paragraaf</p>
        <h2 className="mt-1 font-display text-lg font-extrabold leading-6 tracking-tight text-[var(--helix-navy)]">
          {paragraafTitle || 'Les'}
        </h2>
        {hoofdstukTitle && (
          <p className="mt-1 text-xs font-bold text-[var(--helix-muted)]">{hoofdstukTitle}</p>
        )}

        {optioneel && (
          <span
            title={PLUS_UITLEG_LEERLING}
            className="mt-2 inline-flex items-center gap-1 rounded-full border border-[rgba(122,60,255,0.35)] bg-[var(--helix-soft-lavender)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--helix-purple)]"
          >
            <Star size={11} />
            {PLUS_LABEL}
          </span>
        )}

        <div className="helix-progress-track mt-4 h-2">
          <div className="helix-progress-fill" style={{ width: `${summary.percentage}%` }} />
        </div>
        {/* De balk hierboven gaat over déze paragraaf, niet over het hoofdstuk.
            Bij plusstof zegt de regel eronder er meteen bij dat het extra is,
            zodat een halve balk nooit als achterstand leest. */}
        <p className="mt-2 text-xs font-bold text-[var(--helix-muted)]">
          {summary.done} van {summary.total} stappen af
          {optioneel && ' · extra werk'}
        </p>
      </div>

      <nav aria-label="Stappen in deze paragraaf" className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
        {hasIntro && (
          <button
            type="button"
            onClick={onOpenIntro}
            aria-current={isIntroActive ? 'step' : undefined}
            className={`study-step mb-2 ${isIntroActive ? 'study-step-active' : 'study-step-idle'}`}
          >
            <span className="study-step-icon">
              <Target size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="study-step-title">Leerdoelen</span>
            </span>
            {isIntroDone && (
              <span className="study-step-check">
                <Check size={13} strokeWidth={3.5} />
              </span>
            )}
          </button>
        )}

        <ol className="space-y-1.5">
          {steps.map((step) => {
            const Icon = iconForType(step.type);
            // Zolang het leerdoelenscherm openstaat wijst de balk daarnaar, en
            // niet tegelijk ook naar de eerste stap. Eén actieve regel per moment.
            const isActive = step.isActive && !isIntroActive;
            const stateClass = isActive ? 'study-step-active' : 'study-step-idle';
            // Onder de staptitel staat alleen hoe de leerling de stap heeft
            // afgerond. Geen "Stap 3 · Theorie" meer; de bovenbalk telt al.
            const metaLabel = step.isDone ? step.statusLabel || 'Afgerond' : '';

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelectStep?.(step)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`study-step ${stateClass}`}
                >
                  <span className="study-step-icon">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="study-step-title">{step.title}</span>
                    {metaLabel && <span className="study-step-meta">{metaLabel}</span>}
                  </span>
                  {/* Elke stap is bereikbaar; het vinkje of het open rondje laat
                      zien wat al af is en wat nog niet. */}
                  {step.isDone ? (
                    <span className="study-step-check">
                      <Check size={13} strokeWidth={3.5} />
                      <span className="sr-only">Afgerond</span>
                    </span>
                  ) : (
                    <span className="study-step-todo">
                      <span className="sr-only">Nog niet af</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="shrink-0 border-t border-[var(--helix-border)] p-3">
        <button
          type="button"
          onClick={onExit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--helix-border)] bg-white px-4 py-3 text-sm font-black text-[var(--helix-muted)] transition hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)]"
        >
          <DoorOpen size={18} />
          {exitLabel}
        </button>
      </div>
    </div>
  );
}
