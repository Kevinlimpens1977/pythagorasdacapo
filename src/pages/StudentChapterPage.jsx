import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ListTodo } from 'lucide-react';

import { useStudentOutline } from '../hooks/useStudentOutline';
import { ChapterDetailView } from '../components/lesson/ChapterDetail';
import { buildLessonPath } from '../lib/chapterOutline';

/**
 * Eén hoofdstuk: wat je gedaan hebt en wat er nog openstaat.
 *
 * Dit is de laag die ontbrak. De lesstofpagina toonde alle hoofdstukken met al
 * hun paragrafen tegelijk, en de les zelf toonde alleen de stappen van één
 * paragraaf. Daartussen was er geen plek waar een leerling zijn hoofdstuk kon
 * overzien.
 */
export default function StudentChapterPage() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const { chapters, loading } = useStudentOutline();
  // Omgekeerd aan de lesstofpagina: hier staat alles open en onthouden we
  // alleen wat de leerling zelf dichtklapt. Deze pagina gaat over één
  // hoofdstuk, dus de onderdelen verstoppen achter een klapje heeft geen zin.
  const [ingeklapteRowIds, setIngeklapteRowIds] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimerRef = useRef(0);

  const chapter = useMemo(
    () => chapters.find((kandidaat) => kandidaat.id === chapterId) || null,
    [chapters, chapterId]
  );

  useEffect(() => () => window.clearTimeout(noticeTimerRef.current), []);

  const showNotice = useCallback((message) => {
    window.clearTimeout(noticeTimerRef.current);
    setNotice(message);
    noticeTimerRef.current = window.setTimeout(() => setNotice(''), 2600);
  }, []);

  const toggleRow = useCallback((rowId) => {
    setIngeklapteRowIds((huidig) => (
      huidig.includes(rowId) ? huidig.filter((id) => id !== rowId) : [...huidig, rowId]
    ));
  }, []);

  const startLesson = useCallback(
    (paragraafId, onderdeelId = '') => navigate(buildLessonPath(paragraafId, onderdeelId)),
    [navigate]
  );

  const copyLessonLink = useCallback(
    (paragraafId, onderdeelId = '') => {
      const url = `${window.location.origin}${buildLessonPath(paragraafId, onderdeelId)}`;
      const clipboard = navigator.clipboard;
      if (!clipboard?.writeText) {
        showNotice('Kopiëren lukt niet in deze browser.');
        return;
      }
      clipboard.writeText(url)
        .then(() => showNotice('Link gekopieerd.'))
        .catch(() => showNotice('Kopiëren is niet gelukt.'));
    },
    [showNotice]
  );

  if (loading) {
    return (
      <PageShell>
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <span className="sr-only">Hoofdstuk laden</span>
          <div className="helix-surface h-28 animate-pulse bg-[var(--helix-surface-soft)]" />
          <div className="helix-surface h-72 animate-pulse bg-[var(--helix-surface-soft)]" />
        </div>
      </PageShell>
    );
  }

  if (!chapter) {
    return (
      <PageShell>
        <div className="helix-surface p-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
            <BookOpen size={32} />
          </div>
          <p className="font-display text-xl font-extrabold text-[var(--helix-navy)]">
            Dit hoofdstuk staat niet voor jou klaar
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--helix-muted)]">
            Misschien is de link oud, of heeft je docent het hoofdstuk nog niet gedeeld.
          </p>
          <button type="button" onClick={() => navigate('/')} className="btn-primary mt-6 px-5 py-3 text-sm">
            <ArrowLeft size={17} />
            Terug naar overzicht
          </button>
        </div>
      </PageShell>
    );
  }

  const alleRowIds = [
    ...(chapter.introRow ? [chapter.introRow.id] : []),
    ...chapter.voorkennisRows.map((row) => row.id),
    ...chapter.paragraphRows.map((row) => row.id)
  ];
  const expandedRowIds = alleRowIds.filter((id) => !ingeklapteRowIds.includes(id));

  const openOnderdelen = [
    ...(chapter.introRow && chapter.introRow.kind !== 'chapterIntro' ? [chapter.introRow] : []),
    ...chapter.voorkennisRows,
    ...chapter.paragraphRows
  ].flatMap((row) => (row.onderdelen || [])
    .filter((onderdeel) => !onderdeel.isDone)
    .map((onderdeel) => ({ ...onderdeel, row })));

  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-5">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-black text-[var(--helix-muted)] transition hover:text-[var(--helix-purple)]"
          >
            <ArrowLeft size={17} />
            Terug naar overzicht
          </button>

          <ChapterDetailView
            chapter={chapter}
            expandedRowIds={expandedRowIds}
            showAll={showAll}
            onToggleRow={toggleRow}
            onToggleShowAll={() => setShowAll((waarde) => !waarde)}
            onStart={startLesson}
            onCopyLink={copyLessonLink}
          />
        </div>

        <NogTeDoen onderdelen={openOnderdelen} onStart={startLesson} />
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

/**
 * Het antwoord op "wat staat er nog open", zonder dat de leerling er zelf een
 * lijst voor hoeft samen te stellen uit de paragrafen.
 */
function NogTeDoen({ onderdelen, onStart }) {
  return (
    <aside className="helix-surface p-5 lg:sticky lg:top-24">
      <p className="helix-eyebrow inline-flex items-center gap-2">
        <ListTodo size={14} />
        Nog te doen
      </p>

      {onderdelen.length === 0 ? (
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={17} />
          Dit hoofdstuk is af.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm font-bold text-[var(--helix-muted)]">
            {onderdelen.length} onderde{onderdelen.length === 1 ? 'el' : 'len'}
          </p>
          <ol className="mt-3 space-y-1.5">
            {onderdelen.slice(0, 8).map((onderdeel) => (
              <li key={`${onderdeel.row.id}-${onderdeel.id}`}>
                <button
                  type="button"
                  onClick={() => onStart(onderdeel.row.id, onderdeel.id)}
                  className="group flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition hover:bg-[var(--helix-surface-soft)]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-[var(--helix-navy)]">
                      {onderdeel.title}
                    </span>
                    <span className="block truncate text-xs font-bold text-[var(--helix-muted)]">
                      {onderdeel.row.number ? `${onderdeel.row.number} ` : ''}{onderdeel.row.title}
                    </span>
                  </span>
                  <ArrowRight
                    size={15}
                    className="shrink-0 text-[var(--helix-muted)] transition group-hover:text-[var(--helix-purple)]"
                  />
                </button>
              </li>
            ))}
          </ol>
          {onderdelen.length > 8 && (
            <p className="mt-2 px-3 text-xs font-bold text-[var(--helix-muted)]">
              en nog {onderdelen.length - 8} andere
            </p>
          )}
        </>
      )}
    </aside>
  );
}
