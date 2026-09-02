import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
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
import { useAuth } from '../auth/AuthProvider';
import * as cmsService from '../../services/cmsService';
import * as klasService from '../../services/klasService';
import * as voortgangService from '../../services/voortgangService';
import { getEffectiveContentBlocks } from '../../lib/assignmentUtils';
import { getEffectiveKlasId } from '../../lib/classIdUtils';
import { filterLesstofOpKlasRoute, getKlasNiveauId } from '../../lib/klasRoute';
import { formatStudyDuration } from '../../lib/studyRouteState';
import {
  CHAPTER_SECTION_LABELS,
  buildChapterOutlines,
  buildLessonPath,
  getShowAllLabel,
  getStartLabel,
  getVisibleParagraphRows,
  shouldOfferShowAll
} from '../../lib/chapterOutline';
import { PLUS_LABEL, PLUS_UITLEG_LEERLING } from '../../lib/paragraphMetadata';
import HelixBrandBanner from '../common/HelixBrandBanner';

// De lesstofpagina van de leerling. Elk hoofdstuk heeft dezelfde ruggengraat:
// Introductie, Voorkennis, de genummerde paragrafen, "Toon alles", Oefentoetsen
// en Toetsen. Rijen zonder inhoud blijven weg. Rechts staat een ankernavigatie
// die met de pagina meescrolt.
export default function TableOfContents() {
  const navigate = useNavigate();
  const { klasData, currentUser, userData, klasId: authKlasId } = useAuth();
  const [paragrafen, setParagrafen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoofdstukkenMap, setHoofdstukkenMap] = useState({});
  const [voortgangMap, setVoortgangMap] = useState({});
  const [expandedRowIds, setExpandedRowIds] = useState(() => []);
  const [showAllChapterIds, setShowAllChapterIds] = useState(() => []);
  const [markedAnchorId, setMarkedAnchorId] = useState('');
  const [notice, setNotice] = useState('');
  const noticeTimerRef = useRef(0);

  useEffect(() => {
    const loadParagrafen = async () => {
      setLoading(true);

      try {
        const enabledParagraafIds = currentUser?.uid
          ? klasService.getStudentEffectiveParagrafen(klasData, currentUser.uid)
          : klasData?.enabledParagrafen || [];

        if (!enabledParagraafIds || enabledParagraafIds.length === 0) {
          setParagrafen([]);
          setHoofdstukkenMap({});
          setVoortgangMap({});
          setLoading(false);
          return;
        }

        const paragraafDetails = await Promise.all(
          enabledParagraafIds.map((id) => cmsService.getParagraaf(id).catch(() => null))
        );

        // Heeft de klas een route (niveauId), dan ziet de leerling alleen de
        // paragrafen van dat niveau; zonder route blijft alles zichtbaar.
        const validParagrafen = filterLesstofOpKlasRoute(
          paragraafDetails.filter(Boolean),
          getKlasNiveauId(klasData)
        );
        const paragraafWithContent = await Promise.all(
          validParagrafen.map(async (paragraaf) => {
            const [vragen, contentBlocks] = await Promise.all([
              cmsService.getPublicVragen(paragraaf.id).catch(() => []),
              cmsService.getAssignedPublicContentBlocks({
                paragraafId: paragraaf.id,
                klasData,
                userId: currentUser?.uid || ''
              }).catch(() => [])
            ]);
            const visibleContentBlocks = currentUser?.uid
              ? getEffectiveContentBlocks(klasData, currentUser.uid, paragraaf.id, contentBlocks)
              : contentBlocks;

            return {
              ...paragraaf,
              vragen,
              vragenCount: vragen.length,
              contentBlocks: visibleContentBlocks,
              lesblokCount: visibleContentBlocks.length
            };
          })
        );

        const progressMap = {};
        const effectiveKlasId = getEffectiveKlasId({ authKlasId, userData, klasData });
        if (currentUser && effectiveKlasId) {
          for (const paragraaf of paragraafWithContent) {
            try {
              progressMap[paragraaf.id] = await voortgangService.getVoortgangForParagraaf(
                currentUser.uid,
                paragraaf.id
              );
            } catch (error) {
              console.error(`Error loading voortgang for ${paragraaf.id}:`, error);
              progressMap[paragraaf.id] = [];
            }
          }
        }

        const hoofdstukIds = [...new Set(paragraafWithContent.map((p) => p.hoofdstukId))];
        const hoofdstukkendataArray = await Promise.all(
          hoofdstukIds.map((id) => cmsService.getHoofdstuk(id).catch(() => null))
        );

        const hmapTemp = {};
        hoofdstukkendataArray.forEach((hoofdstuk) => {
          if (hoofdstuk) hmapTemp[hoofdstuk.id] = hoofdstuk;
        });

        setParagrafen(paragraafWithContent);
        setHoofdstukkenMap(hmapTemp);
        setVoortgangMap(progressMap);
      } catch (error) {
        console.error('Error loading paragraphs:', error);
        setParagrafen([]);
      } finally {
        setLoading(false);
      }
    };

    loadParagrafen();
  }, [authKlasId, klasData, currentUser, userData]);

  useEffect(() => () => window.clearTimeout(noticeTimerRef.current), []);

  const chapters = useMemo(
    () => buildChapterOutlines({ hoofdstukken: hoofdstukkenMap, paragrafen, voortgangMap }),
    [hoofdstukkenMap, paragrafen, voortgangMap]
  );

  // De ankernavigatie licht op bij het hoofdstuk dat bovenaan in beeld staat.
  // Zolang er nog niets in beeld is gemeten, wijst hij het eerste hoofdstuk aan.
  useEffect(() => {
    if (chapters.length === 0 || typeof IntersectionObserver === 'undefined') return undefined;

    const sections = chapters
      .map((chapter) => document.getElementById(chapter.anchorId))
      .filter(Boolean);

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const topMost = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (topMost?.target?.id) setMarkedAnchorId(topMost.target.id);
      },
      { rootMargin: '-140px 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  const toggleRow = useCallback((rowId) => {
    setExpandedRowIds((current) =>
      current.includes(rowId) ? current.filter((id) => id !== rowId) : [...current, rowId]
    );
  }, []);

  const toggleShowAll = useCallback((chapterId) => {
    setShowAllChapterIds((current) =>
      current.includes(chapterId) ? current.filter((id) => id !== chapterId) : [...current, chapterId]
    );
  }, []);

  const showNotice = useCallback((message) => {
    window.clearTimeout(noticeTimerRef.current);
    setNotice(message);
    noticeTimerRef.current = window.setTimeout(() => setNotice(''), 2600);
  }, []);

  const startLesson = useCallback(
    (paragraafId, onderdeelId = '') => {
      navigate(buildLessonPath(paragraafId, onderdeelId));
    },
    [navigate]
  );

  const copyLessonLink = useCallback(
    (paragraafId, onderdeelId = '') => {
      const path = buildLessonPath(paragraafId, onderdeelId);
      const url = `${window.location.origin}${path}`;
      const clipboard = navigator.clipboard;

      if (!clipboard?.writeText) {
        showNotice('Kopiëren lukt niet in deze browser.');
        return;
      }

      clipboard
        .writeText(url)
        .then(() => showNotice('Link gekopieerd.'))
        .catch(() => showNotice('Kopiëren is niet gelukt.'));
    },
    [showNotice]
  );

  const scrollToChapter = useCallback((anchorId) => {
    const target = document.getElementById(anchorId);
    if (!target) return;
    setMarkedAnchorId(anchorId);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (loading) {
    return (
      <PageShell>
        <div className="helix-surface p-8 text-center text-[var(--helix-muted)]">
          <p className="font-bold">Lesstof laden...</p>
        </div>
      </PageShell>
    );
  }

  if (chapters.length === 0) {
    return (
      <PageShell>
        <div className="helix-surface overflow-hidden">
          <HelixBrandBanner variant="compact" />
          <div className="py-12 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
              <BookOpen size={34} />
            </div>
            <p className="font-display text-xl font-extrabold text-[var(--helix-navy)]">
              Nog geen taken klaarstaan voor jouw klas
            </p>
            <p className="mt-2 text-sm text-[var(--helix-muted)]">
              Je docent zet hier straks lessen voor je klaar.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  const activeAnchorId = markedAnchorId || chapters[0].anchorId;
  const heeftPlusParagrafen = chapters.some((chapter) =>
    chapter.paragraphRows.some((row) => row.optioneel));
  // De teller in de kop telt alleen de verplichte onderdelen: chapter.progress
  // laat de plusparagrafen al buiten de noemer (zie chapterOutline.js).
  const totals = chapters.reduce(
    (sum, chapter) => ({
      done: sum.done + chapter.progress.done,
      total: sum.total + chapter.progress.total
    }),
    { done: 0, total: 0 }
  );

  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-6">
          <section className="helix-surface overflow-hidden">
            <HelixBrandBanner variant="compact">
              <p className="helix-eyebrow">Lesstof</p>
              <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[var(--helix-navy)]">
                Jouw lesstof
              </h1>
              <p className="mt-1 text-sm font-semibold text-[var(--helix-muted)]">
                {chapters.length} hoofdstuk{chapters.length === 1 ? '' : 'ken'} · {totals.done} van {totals.total} onderdelen af
              </p>
            </HelixBrandBanner>
          </section>

          <MobileAnchorNav chapters={chapters} activeAnchorId={activeAnchorId} onSelect={scrollToChapter} />

          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              expandedRowIds={expandedRowIds}
              showAll={showAllChapterIds.includes(chapter.id)}
              onToggleRow={toggleRow}
              onToggleShowAll={toggleShowAll}
              onStart={startLesson}
              onCopyLink={copyLessonLink}
            />
          ))}

          <p className="helix-alert px-5 py-4 text-sm font-semibold">
            Tip: klap een paragraaf open om te zien wat je gaat leren. Je kunt daarna elk onderdeel
            los starten — HELIX onthoudt waar je gebleven bent.
            {heeftPlusParagrafen && (
              <>
                {' '}Paragrafen met het label <span className="font-black text-[var(--helix-purple)]">{PLUS_LABEL}</span>{' '}
                hoef je niet te doen. Ze tellen niet mee voor je hoofdstuk, maar leveren wel tokens op
                en zijn een aanrader als je later naar de havo wilt.
              </>
            )}
          </p>
        </div>

        <PageAnchorNav chapters={chapters} activeAnchorId={activeAnchorId} onSelect={scrollToChapter} />
      </div>

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-[var(--helix-navy)] px-5 py-2.5 text-sm font-extrabold text-white shadow-[var(--helix-shadow-soft)]"
        >
          {notice}
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ children }) {
  return <div className="mx-auto w-full max-w-7xl pad-content">{children}</div>;
}

function ChapterCard({
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

        {chapter.oefentoetsRows.length > 0 && (
          <AssessmentRow
            rowId={`${chapter.id}-oefentoetsen`}
            label={CHAPTER_SECTION_LABELS.oefentoetsen}
            icon={ListChecks}
            rows={chapter.oefentoetsRows}
            expanded={expandedRowIds.includes(`${chapter.id}-oefentoetsen`)}
            onToggle={onToggleRow}
            onStart={onStart}
            onCopyLink={onCopyLink}
          />
        )}

        {chapter.toetsRows.length > 0 && (
          <AssessmentRow
            rowId={`${chapter.id}-toetsen`}
            label={CHAPTER_SECTION_LABELS.toetsen}
            icon={ClipboardCheck}
            rows={chapter.toetsRows}
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
    parts.push(`${row.progress.total} onderdeel${row.progress.total === 1 ? '' : 'en'}`);
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

function PageAnchorNav({ chapters, activeAnchorId, onSelect }) {
  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block">
      <nav aria-label="Op deze pagina" className="helix-surface p-4">
        <p className="helix-eyebrow">Op deze pagina</p>
        <ul className="mt-3 space-y-1">
          {chapters.map((chapter) => {
            const isActive = chapter.anchorId === activeAnchorId;
            return (
              <li key={chapter.id}>
                <a
                  href={`#${chapter.anchorId}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(chapter.anchorId);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center gap-2.5 rounded-[var(--helix-radius-md)] px-3 py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
                      : 'text-[var(--helix-muted)] hover:bg-[var(--helix-surface-soft)] hover:text-[var(--helix-navy)]'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
                      isActive ? 'bg-[var(--helix-purple)] text-white' : 'bg-[var(--helix-surface-soft)]'
                    }`}
                  >
                    {chapter.number ?? '•'}
                  </span>
                  <span className="truncate">{chapter.title}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function MobileAnchorNav({ chapters, activeAnchorId, onSelect }) {
  return (
    <nav aria-label="Op deze pagina" className="custom-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
      {chapters.map((chapter) => {
        const isActive = chapter.anchorId === activeAnchorId;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => onSelect(chapter.anchorId)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-extrabold transition-colors ${
              isActive
                ? 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]'
                : 'border-[var(--helix-border)] bg-white/80 text-[var(--helix-muted)]'
            }`}
          >
            {chapter.number === null ? chapter.title : `${chapter.number}. ${chapter.title}`}
          </button>
        );
      })}
    </nav>
  );
}
