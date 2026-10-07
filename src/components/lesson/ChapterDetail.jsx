import { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Compass,
  Link2,
  ListChecks,
  Lock,
  MoreVertical,
  PlayCircle,
  Sparkles,
  Star,
  Target
} from 'lucide-react';
import { getVisibleParagraphRows, shouldOfferShowAll } from '../../lib/chapterOutline';
import { nederlandseTaalhulp } from '../../hooks/useLesstofTaal';
import { HBlok, Kaart, Label, StartKnop } from '../leeromgeving';

// De binnenkant van een hoofdstuk: de paragrafen met hun onderdelen, en de
// toetsen die niet al in een paragraaf staan. Gedeeld door de hoofdstukpagina
// van de leerling; de lesstofpagina toont alleen de hoofdstukkaarten en heeft
// deze rijen dus niet nodig.
//
// Alle zichtbare woorden lopen via `taal` (zie hooks/useLesstofTaal.js). Staat
// de taalknop uit, dan geeft die precies de Nederlandse tekst terug die hier
// eerst hard stond.

// Deze twee labels kwamen uit chapterOutline.js. Ze staan nu hier, omdat ze de
// taal van de leerling moeten volgen; de regels erachter zijn ongewijzigd.
const startLabelVoor = (row, tekst) => {
  if (!row?.progress?.total) return tekst('knop.openen');
  if (row.progress.isCompleted) return tekst('knop.opnieuwBekijken');
  return row.progress.done > 0 ? tekst('knop.gaVerder') : tekst('knop.start');
};

const toonAllesLabel = (rows, showAll, tekst) => {
  if (showAll) return tekst('knop.toonMinder');
  const verborgenPlus = rows.slice(3).filter((row) => row?.optioneel === true).length;
  return verborgenPlus > 0
    ? tekst('knop.toonAllesPlus', { aantal: rows.length })
    : tekst('knop.toonAlles', { aantal: rows.length });
};

const rubriekSleutels = {
  introductie: 'rubriek.introductie',
  voorkennis: 'rubriek.voorkennis',
  paragrafen: 'rubriek.paragrafen',
  oefentoetsen: 'rubriek.oefentoetsen',
  toetsen: 'rubriek.toetsen'
};

export function ChapterDetailView({
  chapter,
  expandedRowIds,
  showAll,
  onToggleRow,
  onToggleShowAll,
  onStart,
  onCopyLink,
  taal = nederlandseTaalhulp
}) {
  const { tekst, aantal, studieduur, paragraafInfo, hoofdstukInfo } = taal;
  const vertaaldHoofdstuk = hoofdstukInfo(chapter.id);
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
  const duration = studieduur(chapter.estimatedMinutes);
  // De telling in de kop volgt de voortgangsbalk: die gaat over de verplichte
  // stof. De plusparagraaf wordt er apart naast genoemd, als aanbod.
  const verplichteRows = chapter.paragraphRows.filter((row) => !row.optioneel);
  const plusRows = chapter.paragraphRows.filter((row) => row.optioneel);
  const plusDone = plusRows.filter((row) => row.progress.isCompleted).length;

  // `blok` is de tekst in het gele blokje links (het paragraafnummer). Rijen
  // zonder nummer krijgen in plaats daarvan hun icoon in een crème blokje.
  const renderParagraphRow = (row, label, blok = '') => (row.vergrendeld ? (
    // Een paragraaf op slot staat erbij, grijs en zonder knop: de leerling
    // ziet wat eraan komt, maar kan er nog niet in.
    <OutlineRow
      key={row.id}
      rowId={row.id}
      label={label}
      blok={blok}
      title={paragraafInfo(row.id)?.titel || row.title}
      icon={Lock}
      meta={`${tekst('slot.label')} · ${tekst('slot.uitleg')}`}
      vergrendeld
      taal={taal}
    />
  ) : (
    <OutlineRow
      key={row.id}
      rowId={row.id}
      label={label}
      blok={blok}
      title={paragraafInfo(row.id)?.titel || row.title}
      icon={row.optioneel ? Star : (row.progress.isCompleted ? CheckCircle2 : PlayCircle)}
      isDone={row.progress.isCompleted}
      optioneel={row.optioneel}
      meta={buildParagraphMeta(row, taal)}
      progress={row.progress}
      expanded={expandedRowIds.includes(row.id)}
      onToggle={() => onToggleRow(row.id)}
      startLabel={startLabelVoor(row, tekst)}
      onStart={() => onStart(row.id, row.resumeOnderdeelId)}
      taal={taal}
    >
      <ParagraphPanel row={row} onStart={onStart} onCopyLink={onCopyLink} taal={taal} />
    </OutlineRow>
  ));

  return (
    <Kaart id={chapter.anchorId} className="scroll-mt-28">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <HBlok nummer={chapter.number} />
          <div className="min-w-0">
            <p className="lo-eyebrow">
              {chapter.number === null
                ? tekst('hoofdstuk.kop')
                : tekst('hoofdstuk.kopMetNummer', { nummer: chapter.number })}
            </p>
            <h2 className="lo-kaart-titel mt-1">
              {vertaaldHoofdstuk?.titel || chapter.title}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <Label kleur="blauw">{aantal('paragraaf.aantal', verplichteRows.length)}</Label>
              {plusRows.length > 0 && (
                <span title={tekst('plus.uitleg')}>
                  <Label kleur="blauw" icoon={Star}>
                    {plusRows.length} {tekst('plus.label')}
                  </Label>
                </span>
              )}
              {duration && <Label kleur="blauw" icoon={Clock3}>{duration}</Label>}
              {chapter.badge && <Label kleur="blauw" icoon={Sparkles}>{chapter.badge}</Label>}
            </div>
          </div>
        </div>

        {chapter.progress.total > 0 && (
          <div className="w-full max-w-56 sm:w-56">
            <div className="lo-onderregel mb-1 flex items-center justify-between font-bold">
              <span>{tekst('rubriek.voortgang')}</span>
              <span>
                {chapter.progress.done} / {chapter.progress.total}
              </span>
            </div>
            <span className="lo-voortgang" aria-hidden="true">
              <i style={{ width: `${chapter.progress.percentage}%` }} />
            </span>
            {/* De plusstof staat bewust ONDER de balk en niet erin: de balk
                toont wat af moet, deze regel wat je extra deed. */}
            {plusRows.length > 0 && (
              <p className="lo-onderregel mt-1.5 flex items-center gap-1.5 font-bold">
                <Star size={12} aria-hidden="true" />
                {plusDone > 0
                  ? tekst('plus.extraAf', { done: plusDone, total: plusRows.length })
                  : tekst('plus.staatKlaar')}
              </p>
            )}
          </div>
        )}
      </header>

      <div className="lo-lijst">
        {chapter.introRow && chapter.introRow.kind === 'chapterIntro' && (
          <OutlineRow
            rowId={chapter.introRow.id}
            label={tekst('rubriek.introductie')}
            title=""
            icon={Compass}
            meta={tekst('hoofdstuk.waarover')}
            expanded={expandedRowIds.includes(chapter.introRow.id)}
            onToggle={() => onToggleRow(chapter.introRow.id)}
            taal={taal}
          >
            <p className="lo-kaart-uitleg m-0">
              {vertaaldHoofdstuk?.beschrijving || chapter.introRow.description}
            </p>
          </OutlineRow>
        )}

        {chapter.introRow && chapter.introRow.kind !== 'chapterIntro'
          && renderParagraphRow(chapter.introRow, tekst(rubriekSleutels.introductie))}

        {chapter.voorkennisRows.map((row) => renderParagraphRow(row, tekst(rubriekSleutels.voorkennis)))}

        {visibleParagraphRows.map((row) => renderParagraphRow(row, row.number, row.number))}

        {canShowAll && (
          <div className="flex justify-center p-3">
            <button
              type="button"
              onClick={() => onToggleShowAll(chapter.id)}
              aria-expanded={showAll}
              className="lo-knop-tweede w-full justify-center whitespace-normal text-center"
            >
              {toonAllesLabel(chapter.paragraphRows, showAll, tekst)}
              <ChevronDown
                size={15}
                aria-hidden="true"
                className={showAll ? 'rotate-180 transition-transform' : 'transition-transform'}
              />
            </button>
          </div>
        )}

        {losseOefentoetsRows.length > 0 && (
          <AssessmentRow
            rowId={`${chapter.id}-oefentoetsen`}
            label={tekst(rubriekSleutels.oefentoetsen)}
            icon={ListChecks}
            rows={losseOefentoetsRows}
            expanded={expandedRowIds.includes(`${chapter.id}-oefentoetsen`)}
            onToggle={onToggleRow}
            onStart={onStart}
            onCopyLink={onCopyLink}
            taal={taal}
          />
        )}

        {losseToetsRows.length > 0 && (
          <AssessmentRow
            rowId={`${chapter.id}-toetsen`}
            label={tekst(rubriekSleutels.toetsen)}
            icon={ClipboardCheck}
            rows={losseToetsRows}
            expanded={expandedRowIds.includes(`${chapter.id}-toetsen`)}
            onToggle={onToggleRow}
            onStart={onStart}
            onCopyLink={onCopyLink}
            taal={taal}
          />
        )}
      </div>
    </Kaart>
  );
}

function buildParagraphMeta(row, taal) {
  const { tekst, aantal, studieduur } = taal;
  const parts = [];
  // Bij een plusparagraaf staat het belangrijkste vooraan: dit hoeft niet.
  if (row.optioneel) parts.push(tekst('plus.hoeftNiet'));
  if (row.progress.total > 0) {
    parts.push(aantal('onderdeel.aantal', row.progress.total));
  } else {
    parts.push(tekst('onderdeel.geen'));
  }
  if (row.learningGoals.length > 0) {
    parts.push(aantal('leerdoel.aantal', row.learningGoals.length));
  }
  const duration = studieduur(row.estimatedMinutes);
  if (duration) parts.push(duration);
  return parts.join(' · ');
}

function OutlineRow({
  rowId,
  label,
  blok = '',
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
  vergrendeld = false,
  taal = nederlandseTaalhulp,
  children
}) {
  const panelId = `paneel-${rowId}`;
  // Heeft de rij een eigen blokje (het paragraafnummer), dan staat het label niet
  // nog eens voor de titel.
  const titelTekst = blok ? title : [label, title].filter(Boolean).join(' ');

  if (vergrendeld) {
    return (
      <div className="lo-rij">
        <div className="lo-rij-toggle cursor-default">
          <span className="lo-hblok lo-hblok--dicht">{blok || <Icon size={15} aria-hidden="true" />}</span>
          <span className="lo-rij-tekst">
            <span className="lo-rij-titel">{titelTekst}</span>
            {meta && <span className="lo-onderregel">{meta}</span>}
          </span>
          {blok && <Lock size={15} aria-hidden="true" />}
        </div>
        <StartKnop disabled>{taal.tekst('knop.start')}</StartKnop>
      </div>
    );
  }

  const Pijl = expanded ? ChevronDown : ChevronRight;

  return (
    <div>
      <div className="lo-rij">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="lo-rij-toggle"
        >
          {blok ? (
            <span className="lo-hblok">{blok}</span>
          ) : (
            <span className="lo-hblok lo-hblok--dicht">
              <Icon size={15} aria-hidden="true" />
            </span>
          )}
          <span className="lo-rij-tekst">
            <span className="lo-rij-titel">{titelTekst}</span>
            {meta && <span className="lo-onderregel">{meta}</span>}
          </span>
          {optioneel && <PlusLabel taal={taal} />}
          {isDone && <Label kleur="groen" icoon={Check}>{taal.tekst('status.af')}</Label>}
          <Pijl size={15} aria-hidden="true" />
        </button>

        {/* Een plusparagraaf waar nog niets aan gedaan is krijgt geen telling:
            "0 / 5" leest als achterstand, en dat is dit niet. */}
        {optioneel && progress?.total > 0 && progress.done === 0 && (
          <span className="lo-onderregel hidden shrink-0 font-bold sm:block">
            {taal.tekst('plus.kort')}
          </span>
        )}

        {progress?.total > 0 && !(optioneel && progress.done === 0) && (
          <span className="lo-onderregel hidden shrink-0 sm:block">
            {progress.done} / {progress.total}
          </span>
        )}

        {onStart && (
          <StartKnop onClick={onStart}>{startLabel}</StartKnop>
        )}
      </div>

      {expanded && (
        <div id={panelId} className="lo-paragrafen">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Het merkteken van een vrijwillige plusparagraaf. Bewust een label in de
 * accentkleur en niet in grijs of oranje: dit is een aanbod, geen waarschuwing.
 */
function PlusLabel({ taal = nederlandseTaalhulp }) {
  return (
    <span title={taal.tekst('plus.uitleg')} className="shrink-0">
      <Label kleur="blauw" icoon={Star}>{taal.tekst('plus.label')}</Label>
    </span>
  );
}

function ParagraphPanel({ row, onStart, onCopyLink, taal = nederlandseTaalhulp }) {
  const { tekst } = taal;
  const vertaald = taal.paragraafInfo(row.id);
  const leerdoelen = vertaald?.leerdoelen?.length ? vertaald.leerdoelen : row.learningGoals;

  return (
    <div className="flex flex-col gap-3">
      {row.optioneel && (
        <p className="lo-melding lo-melding--info">
          <Star size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            <strong>{tekst('plus.label')}</strong> {tekst('plus.uitleg')}
          </span>
        </p>
      )}

      {leerdoelen.length > 0 && (
        <div className="lo-melding lo-melding--info">
          <div className="min-w-0">
            <p className="lo-eyebrow flex items-center gap-2">
              <Target size={14} aria-hidden="true" />
              {tekst('intro.watJeGaatLeren')}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {leerdoelen.map((goal, index) => (
                <li key={`${row.id}-doel-${index}`}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {(vertaald?.beschrijving || row.description) && (
        <p className="lo-kaart-uitleg m-0">
          {vertaald?.beschrijving || row.description}
        </p>
      )}

      {row.onderdelen.length > 0 ? (
        <div>
          <p className="lo-eyebrow">{tekst('rubriek.onderdelen')}</p>
          <ul className="lo-paragrafen mt-1 p-0">
            {row.onderdelen.map((onderdeel) => (onderdeel.vergrendeld ? (
              <li key={onderdeel.id} className="lo-paragraafrij">
                <span className="flex w-5 shrink-0 justify-center text-[var(--lo-grijs)]">
                  <Lock size={16} aria-hidden="true" />
                </span>
                <span className="lo-rij-tekst">
                  <span className="lo-rij-titel">{onderdeel.title}</span>
                  <span className="lo-onderregel">{onderdeel.slotTekst}</span>
                </span>
                <StartKnop disabled icoon={null}>{tekst('knop.start')}</StartKnop>
              </li>
            ) : (
              <li key={onderdeel.id} className="lo-paragraafrij">
                <span className="flex w-5 shrink-0 justify-center text-[13px] font-extrabold text-[var(--lo-grijs)]">
                  {onderdeel.isDone
                    ? <CheckCircle2 size={16} aria-hidden="true" className="text-[var(--lo-groen)]" />
                    : onderdeel.number}
                </span>
                <span className="lo-rij-tekst">
                  <span className="lo-rij-titel">{onderdeel.title}</span>
                  <span className="lo-onderregel">{onderdeel.typeLabel}</span>
                </span>
                <StartKnop onClick={() => onStart(row.id, onderdeel.id)} icoon={null}>
                  {onderdeel.isDone ? tekst('knop.opnieuw') : tekst('knop.start')}
                </StartKnop>
                <RowOptionsMenu
                  items={buildOnderdeelMenuItems({
                    paragraafId: row.id,
                    onderdeelId: onderdeel.id,
                    onStart,
                    onCopyLink,
                    tekst
                  })}
                  label={tekst('knop.meerOpties')}
                />
              </li>
            )))}
          </ul>
        </div>
      ) : (
        <p className="lo-kaart-uitleg m-0">
          {tekst('paragraaf.geenOnderdelen')}
        </p>
      )}
    </div>
  );
}

function AssessmentRow({ rowId, label, icon, rows, expanded, onToggle, onStart, onCopyLink, taal = nederlandseTaalhulp }) {
  const { tekst, aantal } = taal;
  // De telling gaat over wat af moet; de toetsen van een plusparagraaf worden
  // er apart bij genoemd zodat ze de teller niet omhoog duwen.
  const verplichteRows = rows.filter((row) => !row.optioneel);
  const plusRows = rows.filter((row) => row.optioneel);
  const done = verplichteRows.filter((row) => row.isDone).length;
  const meta = [
    `${aantal('onderdeel.aantal', verplichteRows.length)} · ${done} ${tekst('status.af')}`,
    plusRows.length > 0 ? `${plusRows.length} ${tekst('plus.label')}` : ''
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
      taal={taal}
    >
      <ul className="lo-paragrafen p-0">
        {rows.map((row) => (
          <li key={row.id} className="lo-paragraafrij">
            <span className="flex w-5 shrink-0 justify-center text-[var(--lo-grijs)]">
              {row.isDone
                ? <CheckCircle2 size={16} aria-hidden="true" className="text-[var(--lo-groen)]" />
                : <ClipboardCheck size={16} aria-hidden="true" />}
            </span>
            <span className="lo-rij-tekst">
              <span className="flex min-w-0 items-center gap-2">
                <span className="lo-rij-titel">{row.title}</span>
                {row.optioneel && <PlusLabel taal={taal} />}
              </span>
              <span className="lo-onderregel">
                {[row.paragraafNumber, row.paragraafTitle].filter(Boolean).join(' · ')}
              </span>
            </span>
            <StartKnop onClick={() => onStart(row.paragraafId, row.id)} icoon={null}>
              {row.isDone ? tekst('knop.opnieuw') : tekst('knop.start')}
            </StartKnop>
            <RowOptionsMenu
              items={buildOnderdeelMenuItems({
                paragraafId: row.paragraafId,
                onderdeelId: row.id,
                onStart,
                onCopyLink,
                tekst
              })}
              label={tekst('knop.meerOpties')}
            />
          </li>
        ))}
      </ul>
    </OutlineRow>
  );
}

function buildOnderdeelMenuItems({ paragraafId, onderdeelId, onStart, onCopyLink, tekst }) {
  return [
    {
      id: 'start-onderdeel',
      label: tekst('knop.startOnderdeel'),
      icon: PlayCircle,
      onSelect: () => onStart(paragraafId, onderdeelId)
    },
    {
      id: 'start-paragraaf',
      label: tekst('knop.beginBijStap1'),
      icon: ListChecks,
      onSelect: () => onStart(paragraafId, '')
    },
    {
      id: 'kopieer-link',
      label: tekst('knop.kopieerLink'),
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
        className={`lo-knop-tweede h-9 w-9 justify-center p-0 ${open ? 'border-[var(--lo-blauw)]' : ''}`}
      >
        <MoreVertical size={16} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="lo-kaart absolute right-0 top-full z-30 mt-1 w-56 gap-0 p-1.5"
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
                className="lo-knop-tweede w-full justify-start border-transparent px-3 py-2 text-left hover:bg-[var(--lo-papier-2)]"
              >
                {ItemIcon && <ItemIcon size={15} aria-hidden="true" className="text-[var(--lo-blauw-inkt)]" />}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
