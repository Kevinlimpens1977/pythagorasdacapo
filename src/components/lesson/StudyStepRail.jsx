import { ArrowLeft, ArrowRight, BookOpen, Check, Star, Target } from 'lucide-react';
import { nederlandseTaalhulp } from '../../hooks/useLesstofTaal';
import Label from '../leeromgeving/Label';

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
  exitLabel = '',
  chapterId = '',
  onOpenChapter = null,
  vorigeParagraaf = null,
  volgendeParagraaf = null,
  onOpenParagraaf = null,
  taal = nederlandseTaalhulp
}) {
  const { tekst } = taal;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-[var(--lo-lijn)] px-5 py-5">
        {/* De uitgang staat bovenaan en heet wat hij doet. Hij heette eerder
            "Stop met oefenen" en stond onderin: een leerling die gewoon terug
            wilde naar zijn overzicht las daar "stoppen" en durfde niet. */}
        <button
          type="button"
          onClick={onExit}
          className="lo-knop-tweede px-3 py-2 text-sm"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {exitLabel || tekst('knop.terugNaarOverzicht')}
        </button>

        <p className="lo-eyebrow mt-4">{tekst('rubriek.paragraaf')}</p>
        <h2 className="mt-1 text-lg font-extrabold leading-6 text-[var(--lo-inkt)]">
          {paragraafTitle || tekst('les.kop')}
        </h2>
        {hoofdstukTitle && (
          chapterId && onOpenChapter ? (
            <button
              type="button"
              onClick={() => onOpenChapter(chapterId)}
              className="lo-onderregel mt-1 inline-flex items-center gap-1 text-left underline decoration-dotted underline-offset-2 transition hover:text-[var(--lo-blauw-inkt)]"
            >
              {hoofdstukTitle}
            </button>
          ) : (
            <p className="lo-onderregel mt-1">{hoofdstukTitle}</p>
          )
        )}

        {optioneel && (
          <Label kleur="paars" icoon={Star} className="mt-2" title={tekst('plus.uitleg')}>
            {tekst('plus.label')}
          </Label>
        )}

        <span className="lo-voortgang mt-4" aria-hidden="true">
          <i style={{ width: `${summary.percentage}%` }} />
        </span>
        {/* De balk hierboven gaat over déze paragraaf, niet over het hoofdstuk.
            Bij plusstof zegt de regel eronder er meteen bij dat het extra is,
            zodat een halve balk nooit als achterstand leest. */}
        <p className="lo-onderregel mt-2">
          {tekst('onderdeel.af', { done: summary.done, total: summary.total })}
          {optioneel && ' · extra werk'}
        </p>
      </div>

      <nav aria-label="Onderdelen in deze paragraaf" className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <ol className="lo-lijst study-stappen">
          {hasIntro && (
            <li>
              <button
                type="button"
                onClick={onOpenIntro}
                aria-current={isIntroActive ? 'step' : undefined}
                className={`study-step${isIntroActive ? ' study-step-active' : ''}`}
              >
                <span className="study-step-nummer">
                  <Target size={15} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="study-step-title">{tekst('les.leerdoelen')}</span>
                </span>
                {isIntroDone && (
                  <span className="study-step-check">
                    <Check size={13} strokeWidth={3.5} />
                  </span>
                )}
              </button>
            </li>
          )}

          {steps.map((step, index) => {
            const Icon = iconForType(step.type);
            // Zolang het leerdoelenscherm openstaat wijst de balk daarnaar, en
            // niet tegelijk ook naar de eerste stap. Eén actieve regel per moment.
            const isActive = step.isActive && !isIntroActive;
            // Onder de staptitel staat alleen hoe de leerling de stap heeft
            // afgerond. Het nummer staat in het blokje ervoor.
            const metaLabel = step.isDone ? step.statusLabel || tekst('status.afgerond') : '';

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onSelectStep?.(step)}
                  aria-current={isActive ? 'step' : undefined}
                  className={`study-step${isActive ? ' study-step-active' : ''}`}
                >
                  <span className="study-step-nummer">{index + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="study-step-title">{step.title}</span>
                    {metaLabel && <span className="study-step-meta">{metaLabel}</span>}
                  </span>
                  <Icon size={16} className="study-step-type" aria-hidden="true" />
                  {/* Elke stap is bereikbaar; het vinkje of het open rondje laat
                      zien wat al af is en wat nog niet. */}
                  {step.isDone ? (
                    <span className="study-step-check">
                      <Check size={13} strokeWidth={3.5} />
                      <span className="sr-only">{tekst('status.afgerond')}</span>
                    </span>
                  ) : (
                    <span className="study-step-todo">
                      <span className="sr-only">{tekst('status.nogNietAf')}</span>
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* De buren van deze paragraaf. Zonder deze twee moest een leerling na
          elke paragraaf terug naar het overzicht en het hoofdstuk opnieuw
          opzoeken om verder te kunnen. */}
      {(vorigeParagraaf || volgendeParagraaf) && onOpenParagraaf && (
        <div className="shrink-0 border-t border-[var(--lo-lijn)] p-3">
          <p className="lo-onderregel px-1 pb-2 font-bold">
            {tekst('les.inDitHoofdstuk')}
          </p>
          <div className="space-y-1">
            {vorigeParagraaf && (
              <button
                type="button"
                onClick={() => onOpenParagraaf(vorigeParagraaf.id)}
                className="flex w-full items-center gap-2 rounded-[var(--lo-hoek-m)] px-3 py-2 text-left transition hover:bg-[var(--lo-papier)]"
              >
                <ArrowLeft size={15} className="shrink-0 text-[var(--lo-grijs)]" aria-hidden="true" />
                <span className="lo-rij-titel min-w-0 flex-1 truncate">
                  {vorigeParagraaf.number ? `${vorigeParagraaf.number} ` : ''}
                  {taal.paragraafInfo(vorigeParagraaf.id)?.titel || vorigeParagraaf.title}
                </span>
              </button>
            )}
            {volgendeParagraaf && (
              <button
                type="button"
                onClick={() => onOpenParagraaf(volgendeParagraaf.id)}
                className="flex w-full items-center gap-2 rounded-[var(--lo-hoek-m)] px-3 py-2 text-left transition hover:bg-[var(--lo-papier)]"
              >
                <span className="lo-rij-titel min-w-0 flex-1 truncate">
                  {volgendeParagraaf.number ? `${volgendeParagraaf.number} ` : ''}
                  {taal.paragraafInfo(volgendeParagraaf.id)?.titel || volgendeParagraaf.title}
                </span>
                <ArrowRight size={15} className="shrink-0 text-[var(--lo-grijs)]" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
