import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ListTodo } from 'lucide-react';

import { useStudentOutline } from '../hooks/useStudentOutline';
import { useLesstofTaal } from '../hooks/useLesstofTaal';
import { ChapterDetailView } from '../components/lesson/ChapterDetail';
import { Kaart, KaartKop } from '../components/leeromgeving';
import TaalSchakelaar from '../components/lesson/TaalSchakelaar';
import { buildLessonPath } from '../lib/chapterOutline';
import { HelixLaden } from '../components/merk/HelixLogo';

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
  // Bij openen staat alles dicht, ook de introductie; een rij klapt pas open
  // als de leerling erop klikt (Kevin, 7 okt 2026). Per hoofdstuk bewaard, zodat
  // een ander hoofdstuk weer dicht begint.
  const [openPerHoofdstuk, setOpenPerHoofdstuk] = useState({});
  const openRowIds = openPerHoofdstuk[chapterId] || [];
  const [showAll, setShowAll] = useState(false);
  const [notice, setNotice] = useState('');
  const noticeTimerRef = useRef(0);

  const chapter = useMemo(
    () => chapters.find((kandidaat) => kandidaat.id === chapterId) || null,
    [chapters, chapterId]
  );

  // De taalknop van de leerling, met dezelfde keuze als op de lesstofpagina en
  // in de les zelf.
  const paragraafIds = useMemo(() => [
    ...(chapter?.introRow ? [chapter.introRow.id] : []),
    ...(chapter?.voorkennisRows || []).map((row) => row.id),
    ...(chapter?.paragraphRows || []).map((row) => row.id)
  ], [chapter]);
  const hoofdstukIds = useMemo(() => (chapter ? [chapter.id] : []), [chapter]);
  const taal = useLesstofTaal({ paragraafIds, hoofdstukIds });
  const { tekst } = taal;

  useEffect(() => () => window.clearTimeout(noticeTimerRef.current), []);

  const showNotice = useCallback((message) => {
    window.clearTimeout(noticeTimerRef.current);
    setNotice(message);
    noticeTimerRef.current = window.setTimeout(() => setNotice(''), 2600);
  }, []);

  const toggleRow = useCallback((rowId) => {
    setOpenPerHoofdstuk((stand) => {
      const huidig = stand[chapterId] || [];
      const nieuw = huidig.includes(rowId) ? huidig.filter((id) => id !== rowId) : [...huidig, rowId];
      return { ...stand, [chapterId]: nieuw };
    });
  }, [chapterId]);

  const startLesson = useCallback(
    (paragraafId, onderdeelId = '') => navigate(buildLessonPath(paragraafId, onderdeelId)),
    [navigate]
  );

  const copyLessonLink = useCallback(
    (paragraafId, onderdeelId = '') => {
      const url = `${window.location.origin}${buildLessonPath(paragraafId, onderdeelId)}`;
      const clipboard = navigator.clipboard;
      if (!clipboard?.writeText) {
        showNotice(tekst('melding.kopierenKanNiet'));
        return;
      }
      clipboard.writeText(url)
        .then(() => showNotice(tekst('melding.linkGekopieerd')))
        .catch(() => showNotice(tekst('melding.kopierenMislukt')));
    },
    [showNotice, tekst]
  );

  if (loading) {
    return (
      <PageShell>
        <HelixLaden tekst={tekst('hoofdstuk.laden')} />
      </PageShell>
    );
  }

  // Op slot: de leerling kan hier ook via een oude link komen, dus de
  // hoofdstukpagina zegt hetzelfde als de tegel in plaats van de lesstof te
  // tonen.
  if (chapter?.vergrendeld === true) {
    return (
      <PageShell>
        <Kaart>
          <KaartKop titel={tekst('slot.titel')} uitleg={tekst('slot.uitleg')} />
          <div>
            <button type="button" onClick={() => navigate('/')} className="lo-knop">
              <ArrowLeft size={18} aria-hidden="true" />
              {tekst('knop.terugNaarOverzicht')}
            </button>
          </div>
        </Kaart>
      </PageShell>
    );
  }

  if (!chapter) {
    return (
      <PageShell>
        <Kaart>
          <KaartKop titel={tekst('hoofdstuk.nietVoorJou.titel')} uitleg={tekst('hoofdstuk.nietVoorJou.tekst')} />
          <div>
            <button type="button" onClick={() => navigate('/')} className="lo-knop">
              <ArrowLeft size={18} aria-hidden="true" />
              {tekst('knop.terugNaarOverzicht')}
            </button>
          </div>
        </Kaart>
      </PageShell>
    );
  }

  const alleRowIds = [
    ...(chapter.introRow ? [chapter.introRow.id] : []),
    ...chapter.voorkennisRows.map((row) => row.id),
    ...chapter.paragraphRows.map((row) => row.id)
  ];
  const expandedRowIds = alleRowIds.filter((id) => openRowIds.includes(id));

  const openOnderdelen = [
    ...(chapter.introRow && chapter.introRow.kind !== 'chapterIntro' ? [chapter.introRow] : []),
    ...chapter.voorkennisRows,
    ...chapter.paragraphRows
  ].filter((row) => row.vergrendeld !== true).flatMap((row) => (row.onderdelen || [])
    .filter((onderdeel) => !onderdeel.isDone && onderdeel.vergrendeld !== true)
    .map((onderdeel) => ({ ...onderdeel, row })));

  return (
    <PageShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="lo-knop-tweede"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              {tekst('knop.terugNaarOverzicht')}
            </button>
            <TaalSchakelaar
              taal={taal.lesTaal}
              actief={taal.taalActief}
              bezig={taal.bezig}
              onWissel={taal.wisselTaal}
            />
          </div>

          <ChapterDetailView
            chapter={chapter}
            expandedRowIds={expandedRowIds}
            showAll={showAll}
            onToggleRow={toggleRow}
            onToggleShowAll={() => setShowAll((waarde) => !waarde)}
            onStart={startLesson}
            onCopyLink={copyLessonLink}
            taal={taal}
          />
        </div>

        <NogTeDoen onderdelen={openOnderdelen} onStart={startLesson} taal={taal} />
      </div>

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 rounded-full bg-[var(--lo-inkt)] px-5 py-2.5 text-sm font-extrabold text-[var(--lo-papier)] shadow-[var(--lo-schaduw-kaart)]"
        >
          {notice}
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ children }) {
  return (
    <div className="helix-page lo-tekst">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">{children}</div>
    </div>
  );
}

/**
 * Het antwoord op "wat staat er nog open", zonder dat de leerling er zelf een
 * lijst voor hoeft samen te stellen uit de paragrafen.
 */
function NogTeDoen({ onderdelen, onStart, taal }) {
  const { tekst, aantal, paragraafInfo } = taal;

  return (
    <Kaart as="aside" className="lg:sticky lg:top-24">
      <div>
        <p className="lo-eyebrow inline-flex items-center gap-2">
          <ListTodo size={14} aria-hidden="true" />
          {tekst('nogTeDoen.kop')}
        </p>
        {onderdelen.length > 0 && (
          <p className="lo-kaart-uitleg">{aantal('onderdeel.aantal', onderdelen.length)}</p>
        )}
      </div>

      {onderdelen.length === 0 ? (
        <p className="lo-melding lo-melding--info">
          <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--lo-groen)]" />
          {tekst('nogTeDoen.klaar')}
        </p>
      ) : (
        <>
          <ol className="lo-lijst">
            {onderdelen.slice(0, 8).map((onderdeel) => (
              <li key={`${onderdeel.row.id}-${onderdeel.id}`}>
                <button
                  type="button"
                  onClick={() => onStart(onderdeel.row.id, onderdeel.id)}
                  className="lo-rij w-full cursor-pointer text-left hover:bg-[var(--lo-papier)]"
                >
                  <span className="lo-rij-tekst">
                    <span className="lo-rij-titel">{onderdeel.title}</span>
                    <span className="lo-onderregel">
                      {onderdeel.row.number ? `${onderdeel.row.number} ` : ''}
                      {paragraafInfo(onderdeel.row.id)?.titel || onderdeel.row.title}
                    </span>
                  </span>
                  <ArrowRight size={15} aria-hidden="true" className="shrink-0 text-[var(--lo-grijs)]" />
                </button>
              </li>
            ))}
          </ol>
          {onderdelen.length > 8 && (
            <p className="lo-onderregel">
              {tekst('nogTeDoen.rest', { aantal: onderdelen.length - 8 })}
            </p>
          )}
        </>
      )}
    </Kaart>
  );
}
