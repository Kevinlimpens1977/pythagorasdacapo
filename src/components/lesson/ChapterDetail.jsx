import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Compass,
  Link2,
  ListChecks,
  MoreVertical,
  PlayCircle,
  Sparkles,
  Star,
  Target
} from 'lucide-react';
import { formatStudyDuration } from '../../lib/studyRouteState';
import {
  CHAPTER_SECTION_LABELS,
  getShowAllLabel,
  getStartLabel,
  getVisibleParagraphRows,
  shouldOfferShowAll
} from '../../lib/chapterOutline';
import { PLUS_LABEL, PLUS_UITLEG_LEERLING } from '../../lib/paragraphMetadata';

// De binnenkant van een hoofdstuk: de paragrafen met hun onderdelen, en de
// toetsen die niet al in een paragraaf staan. Gedeeld door de hoofdstukpagina
// van de leerling; de lesstofpagina toont alleen de hoofdstukkaarten en heeft
// deze rijen dus niet nodig.

export function ChapterDetailView({
  chapter,
  expandedRowIds,
  showAll,
  onToggleRow,
  onToggleShowAll,
  onStart,
  onCopyLink
}) {
  const visibleParagraphRows = getVisibleParagraphRows(chapter.paragraphRows, showAll);
  const canShowAll = shouldOfferShowAll(chapter.paragraphRows);

  // Een quiz of toets die al als onderdeel van een zichtbare paragraaf op het
  // scherm staat, hoort er niet nog een keer onder te staan. Dat leverde twee
  // deuren naar dezelfde kamer op, met twee tellingen die elkaar tegenspraken:
  // de paragraaf zei "5 onderdelen" en de rij eronder "1 onderdeel · 0 af" over
  // precies dezelfde quiz. Staat de paragraaf nog achter "Toon alles", dan
  // blijft de snelkoppeling wél staan; anders zou de toets onvindbaar zijn.
  const zichtbareOnderdeelIds = new Set(
    visibleParagraphRows.flatMap((row) => (row.onderdelen || []).map((onderdeel) => onderdeel.id))
  );
  const nietAlZichtbaar = (rows = []) => rows.filter((row) => !zichtbareOnderdeelIds.has(row.id));
  const losseOefentoetsRows = nietAlZichtbaar(chapter.oefentoetsRows);
  const losseToetsRows = nietAlZichtbaar(chapter.toetsRows);
  const duration = formatStudyDuration(chapter.estimatedMinutes);
  // De telling in de kop volgt de voortgangsbalk: die gaat over de verplichte
  // stof. De plusparagraaf wordt er apart naast genoemd, als aanbod.
  const verplichteRows = chapter.paragraphRows.filter((row) => !row.optioneel);
  const plusRows = chapter.paragraphRows.filter((row) => row.optioneel);
  const plusDone = plusRows.filter((row) => row.progress.isCompleted).length;

  const renderParagraphRow = (row, label) => (
    <OutlineRow
      key={row.id}
      rowId={row.id}
      label={label}
      title={row.title}
      icon={row.optioneel ? Star : (row.progress.isCompleted ? CheckCircle2 : PlayCircle)}
      isDone={row.progress.isCompleted}
      optioneel={row.optioneel}
      meta={buildParagraphMeta(row)}
      progress={row.progress}
      expanded={expandedRowIds.includes(row.id)}
      onToggle={() => onToggleRow(row.id)}
      startLabel={getStartLabel(row)}
      onStart={() => onStart(row.id, row.resumeOnderdeelId)}
    >
      <ParagraphPanel row={row} onStart={onStart} onCopyLink={onCopyLink} />
    </OutlineRow>
  );

  return (
    <section id={chapter.anchorId} className="helix-surface scroll-mt-28 p-5 md:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--helix-border)] pb-4">
        <div className="min-w-0">
          <p className="helix-eyebrow">
            {chapter.number === null ? 'Hoofdstuk' : `Hoofdstuk ${chapter.number}`}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-[var(--helix-navy)] md:text-2xl">
            {chapter.title}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="helix-badge normal-case tracking-normal">
              {verplichteRows.length} paragra{verplichteRows.length === 1 ? 'af' : 'fen'}
            </span>
            {plusRows.length > 0 && (
              <span
                title={PLUS_UITLEG_LEERLING}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(122,60,255,0.35)] bg-[var(--helix-soft-lavender)] px-2.5 py-1 text-xs font-black normal-case tracking-normal text-[var(--helix-purple)]"
              >
                <Star size={13} />
                {plusRows.length === 1 ? '1 plus' : `${plusRows.length} plus`} · vrijwillig
              </span>
            )}
            {duration && (
              <span className="helix-badge inline-flex items-center gap-1.5 normal-case tracking-normal">
                <Clock3 size={13} />
                {duration}
              </span>
            )}
            {chapter.badge && (
              <span className="helix-badge inline-flex items-center gap-1.5 normal-case tracking-normal">
                <Sparkles size={13} />
                {chapter.badge}
              </span>
            )}
          </div>
        </div>

        {chapter.progress.total > 0 && (
          <div className="w-full max-w-56 sm:w-56">
            <div className="mb-1 flex items-center justify-between text-xs font-bold text-[var(--helix-muted)]">
              <span>Voortgang</span>
              <span>
                {chapter.progress.done} / {chapter.progress.total}
              </span>
            </div>
            <div className="helix-progress-track h-2 w-full">
              <div
                className={
                  chapter.progress.isCompleted
                    ? 'h-full rounded-full bg-[var(--helix-success)] transition-all duration-500'
                    : 'helix-progress-fill'
                }
                style={{ width: `${chapter.progress.percentage}%` }}
              />
            </div>
            {/* De plusstof staat bewust ONDER de balk en niet erin: de balk
                toont wat af moet, deze regel wat je extra deed. */}
            {plusRows.length > 0 && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-[var(--helix-purple)]">
                <Star size={12} />
                {plusDone > 0
                  ? `Plus: ${plusDone} van ${plusRows.length} extra af`
                  : 'Plus staat klaar als je meer wilt'}
              </p>
            )}
          </div>
        )}
      </header>

      <div className="mt-4 space-y-2">
        {chapter.introRow && chapter.introRow.kind === 'chapterIntro' && (
          <OutlineRow
            rowId={chapter.introRow.id}
            label={CHAPTER_SECTION_LABELS.introductie}
            title=""
            icon={Compass}
            meta="Waar dit hoofdstuk over gaat"
            expanded={expandedRowIds.includes(chapter.introRow.id)}
            onToggle={() => onToggleRow(chapter.introRow.id)}
          >
            <p className="lesson-prose text-sm">{chapter.introRow.description}</p>
          </OutlineRow>
        )}

        {chapter.introRow && chapter.introRow.kind !== 'chapterIntro'
          && renderParagraphRow(chapter.introRow, CHAPTER_SECTION_LABELS.introductie)}

        {chapter.voorkennisRows.map((row) => renderParagraphRow(row, CHAPTER_SECTION_LABELS.voorkennis))}

        {visibleParagraphRows.map((row) => renderParagraphRow(row, row.number))}

        {canShowAll && (
          <button
            type="button"
            onClick={() => onToggleShowAll(chapter.id)}
            aria-expanded={showAll}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--helix-radius-md)] border border-dashed border-[var(--helix-border)] bg-white/60 px-4 py-2.5 text-sm font-extrabold text-[var(--helix-purple)] transition-colors hover:border-[var(--helix-purple)] hover:bg-[var(--helix-soft-lavender)]/60"
          >
            {getShowAllLabel(chapter.paragraphRows, showAll)}
            <ChevronDown size={16} className={showAll ? 'rotate-180 transition-transform' : 'transition-transform'} />
          </button>
        )}

        {losseOefentoetsRows.length > 0 && (
          <AssessmentRow
            rowId={`${chapter.id}-oefentoetsen`}
            label={CHAPTER_SECTION_LABELS.oefentoetsen}
            icon={ListChecks}
            rows={losseOefentoetsRows}
            expanded={expandedRowIds.includes(`${chapter.id}-oefentoetsen`)}
            onToggle={onToggleRow}
            onStart={onStart}
            onCopyLink={onCopyLink}
          />
        )}

        {losseToetsRows.length > 0 && (
          <AssessmentRow
            rowId={`${chapter.id}-toetsen`}
            label={CHAPTER_SECTION_LABELS.toetsen}
            icon={ClipboardCheck}
            rows={losseToetsRows}
            expanded={expandedRowIds.includes(`${chapter.id}-toetsen`)}
            onToggle={onToggleRow}
            onStart={onStart}
            onCopyLink={onCopyLink}
          />
        )}
      </div>
    </section>
  );
}

function buildParagraphMeta(row) {
  const parts = [];
  // Bij een plusparagraaf staat het belangrijkste vooraan: dit hoeft niet.
  if (row.optioneel) parts.push('Hoeft niet - mag wel');
  if (row.progress.total > 0) {
    parts.push(`${row.progress.total} ${row.progress.total === 1 ? 'onderdeel' : 'onderdelen'}`);
  } else {
    parts.push('Nog geen gepubliceerde onderdelen');
  }
  if (row.learningGoals.length > 0) {
    parts.push(`${row.learningGoals.length} leerdoel${row.learningGoals.length === 1 ? '' : 'en'}`);
  }
  const duration = formatStudyDuration(row.estimatedMinutes);
  if (duration) parts.push(duration);
  return parts.join(' · ');
}

function OutlineRow({
  rowId,
  label,
  title,
  meta,
  icon: Icon = PlayCircle,
  isDone = false,
  optioneel = false,
  progress = null,
  expanded = false,
  onToggle,
  startLabel = '',
  onStart = null,
  children
}) {
  const panelId = `paneel-${rowId}`;

  return (
    <div
      className={`rounded-[var(--helix-radius-lg)] border transition-colors ${
        optioneel
          ? 'border-[rgba(122,60,255,0.35)] bg-[var(--helix-soft-lavender)]/35 hover:border-[var(--helix-purple)]'
          : expanded
            ? 'border-[rgba(122,60,255,0.32)] bg-white'
            : 'border-[var(--helix-border)] bg-white/70 hover:border-[rgba(122,60,255,0.28)]'
      }`}
    >
      <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus:outline-none focus-visible:rounded-[var(--helix-radius-md)] focus-visible:shadow-[var(--helix-focus)]"
        >
          <span className="text-[var(--helix-muted)]">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </span>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
              isDone
                ? 'bg-[rgba(34,197,94,0.14)] text-[#237A4D]'
                : optioneel
                  ? 'bg-white text-[var(--helix-purple)] ring-1 ring-[rgba(122,60,255,0.35)]'
                  : 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
            }`}
          >
            <Icon size={19} />
          </span>
          <span className="min-w-0">
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate font-display text-[15px] font-extrabold text-[var(--helix-navy)] md:text-base">
                {label && <span className="text-[var(--helix-purple)]">{label}</span>}
                {label && title ? ' ' : ''}
                {title}
              </span>
              {optioneel && <PlusLabel />}
            </span>
            {meta && (
              <span className="mt-0.5 block truncate text-xs font-semibold text-[var(--helix-muted)]">{meta}</span>
            )}
          </span>
        </button>

        {/* Een plusparagraaf waar nog niets aan gedaan is krijgt geen lege balk:
            een balk op nul leest als achterstand, en dat is dit niet. */}
        {optioneel && progress?.total > 0 && progress.done === 0 && (
          <span className="hidden shrink-0 text-xs font-bold text-[var(--helix-purple)] sm:block">
            Extra
          </span>
        )}

        {progress?.total > 0 && !(optioneel && progress.done === 0) && (
          <div className="hidden flex-col items-end sm:flex">
            <span className="mb-1 text-xs font-bold text-[var(--helix-muted)]">
              {progress.done} / {progress.total}
            </span>
            <span className="helix-progress-track block h-2 w-20">
              <span
                className={
                  progress.isCompleted
                    ? 'block h-full rounded-full bg-[var(--helix-success)] transition-all duration-500'
                    : 'helix-progress-fill block'
                }
                style={{ width: `${progress.percentage}%` }}
              />
            </span>
          </div>
        )}

        {onStart && (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--helix-border)] bg-white px-3 py-2 text-xs font-extrabold text-[var(--helix-navy)] transition-colors hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)] focus:outline-none focus-visible:shadow-[var(--helix-focus)]"
          >
            {startLabel}
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {expanded && (
        <div id={panelId} className="border-t border-[var(--helix-border)] px-4 pb-4 pt-4 sm:px-5">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Het merkteken van een vrijwillige plusparagraaf. Bewust in de accentkleur van
 * HELIX en niet in grijs of oranje: dit is een aanbod, geen waarschuwing.
 */
function PlusLabel() {
  return (
    <span
      title={PLUS_UITLEG_LEERLING}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[rgba(122,60,255,0.35)] bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--helix-purple)]"
    >
      <Star size={11} />
      {PLUS_LABEL}
    </span>
  );
}

function ParagraphPanel({ row, onStart, onCopyLink }) {
  return (
    <div>
      {row.optioneel && (
        <div className="mb-3 rounded-[var(--helix-radius-md)] border border-[rgba(122,60,255,0.3)] bg-[var(--helix-soft-lavender)]/70 p-4">
          <p className="flex items-center gap-2 font-display text-sm font-extrabold text-[var(--helix-purple)]">
            <Star size={15} />
            {PLUS_LABEL}
          </p>
          <p className="mt-1.5 text-sm font-semibold leading-6 text-[var(--helix-navy)]">
            {PLUS_UITLEG_LEERLING}
          </p>
        </div>
      )}

      {row.learningGoals.length > 0 && (
        <div className="rounded-[var(--helix-radius-md)] border border-[rgba(122,60,255,0.18)] bg-[var(--helix-soft-lavender)]/60 p-4">
          <p className="helix-eyebrow flex items-center gap-2">
            <Target size={14} />
            Wat je gaat leren
          </p>
          <ul className="mt-2 space-y-1.5">
            {row.learningGoals.map((goal, index) => (
              <li key={`${row.id}-doel-${index}`} className="flex items-start gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--helix-purple)]" />
                <span className="text-sm font-semibold leading-6 text-[var(--helix-navy)]">{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {row.description && (
        <p className="mt-3 text-sm font-semibold leading-6 text-[var(--helix-muted)]">{row.description}</p>
      )}

      {row.onderdelen.length > 0 ? (
        <>
          <p className="helix-eyebrow mt-4">Onderdelen</p>
          <ul className="mt-2 space-y-1.5">
            {row.onderdelen.map((onderdeel) => (
              <li
                key={onderdeel.id}
                className="flex items-center gap-3 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white/80 px-3 py-2"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                    onderdeel.isDone
                      ? 'bg-[rgba(34,197,94,0.14)] text-[#237A4D]'
                      : 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)]'
                  }`}
                >
                  {onderdeel.isDone ? <CheckCircle2 size={15} /> : onderdeel.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[var(--helix-navy)]">{onderdeel.title}</span>
                  <span className="text-[11px] font-black uppercase tracking-wide text-[var(--helix-muted)]">
                    {onderdeel.typeLabel}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => onStart(row.id, onderdeel.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--helix-border)] bg-white px-3 py-1.5 text-xs font-extrabold text-[var(--helix-navy)] transition-colors hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)] focus:outline-none focus-visible:shadow-[var(--helix-focus)]"
                >
                  {onderdeel.isDone ? 'Opnieuw' : 'Start'}
                  <ArrowRight size={13} />
                </button>
                <RowOptionsMenu
                  items={buildOnderdeelMenuItems({
                    paragraafId: row.id,
                    onderdeelId: onderdeel.id,
                    onStart,
                    onCopyLink
                  })}
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-sm font-semibold text-[var(--helix-muted)]">
          Je docent heeft voor deze paragraaf nog geen onderdelen klaargezet.
        </p>
      )}
    </div>
  );
}

function AssessmentRow({ rowId, label, icon, rows, expanded, onToggle, onStart, onCopyLink }) {
  // De telling gaat over wat af moet; de toetsen van een plusparagraaf worden
  // er apart bij genoemd zodat ze de teller niet omhoog duwen.
  const verplichteRows = rows.filter((row) => !row.optioneel);
  const plusRows = rows.filter((row) => row.optioneel);
  const done = verplichteRows.filter((row) => row.isDone).length;
  const meta = [
    `${verplichteRows.length} onderdeel${verplichteRows.length === 1 ? '' : 'en'} · ${done} af`,
    plusRows.length > 0 ? `${plusRows.length} plus (vrijwillig)` : ''
  ].filter(Boolean).join(' · ');

  return (
    <OutlineRow
      rowId={rowId}
      label={label}
      title=""
      icon={icon}
      meta={meta}
      expanded={expanded}
      onToggle={() => onToggle(rowId)}
    >
      <ul className="space-y-1.5">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex items-center gap-3 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white/80 px-3 py-2"
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                row.isDone
                  ? 'bg-[rgba(34,197,94,0.14)] text-[#237A4D]'
                  : 'bg-[var(--helix-surface-soft)] text-[var(--helix-muted)]'
              }`}
            >
              {row.isDone ? <CheckCircle2 size={15} /> : <ClipboardCheck size={14} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm font-bold text-[var(--helix-navy)]">{row.title}</span>
                {row.optioneel && <PlusLabel />}
              </span>
              <span className="block truncate text-[11px] font-semibold text-[var(--helix-muted)]">
                {[row.paragraafNumber, row.paragraafTitle].filter(Boolean).join(' · ')}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onStart(row.paragraafId, row.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--helix-border)] bg-white px-3 py-1.5 text-xs font-extrabold text-[var(--helix-navy)] transition-colors hover:border-[var(--helix-purple)] hover:text-[var(--helix-purple)] focus:outline-none focus-visible:shadow-[var(--helix-focus)]"
            >
              {row.isDone ? 'Opnieuw' : 'Start'}
              <ArrowRight size={13} />
            </button>
            <RowOptionsMenu
              items={buildOnderdeelMenuItems({
                paragraafId: row.paragraafId,
                onderdeelId: row.id,
                onStart,
                onCopyLink
              })}
            />
          </li>
        ))}
      </ul>
    </OutlineRow>
  );
}

function buildOnderdeelMenuItems({ paragraafId, onderdeelId, onStart, onCopyLink }) {
  return [
    {
      id: 'start-onderdeel',
      label: 'Start dit onderdeel',
      icon: PlayCircle,
      onSelect: () => onStart(paragraafId, onderdeelId)
    },
    {
      id: 'start-paragraaf',
      label: 'Begin bij stap 1',
      icon: ListChecks,
      onSelect: () => onStart(paragraafId, '')
    },
    {
      id: 'kopieer-link',
      label: 'Kopieer link',
      icon: Link2,
      onSelect: () => onCopyLink(paragraafId, onderdeelId)
    }
  ];
}

function RowOptionsMenu({ items = [], label = 'Meer opties' }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors focus:outline-none focus-visible:shadow-[var(--helix-focus)] ${
          open
            ? 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
            : 'border-transparent text-[var(--helix-muted)] hover:border-[var(--helix-border)] hover:bg-white'
        }`}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-30 mt-1 w-56 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white p-1 shadow-[var(--helix-shadow-soft)]"
        >
          {items.map((item) => {
            const ItemIcon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className="flex w-full items-center gap-2.5 rounded-[var(--helix-radius-sm)] px-3 py-2 text-left text-sm font-bold text-[var(--helix-navy)] transition-colors hover:bg-[var(--helix-surface-soft)]"
              >
                {ItemIcon && <ItemIcon size={15} className="text-[var(--helix-purple)]" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
