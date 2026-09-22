import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Lock, PlayCircle, Sparkles } from 'lucide-react';

import { useMemo } from 'react';

import { useStudentOutline } from '../../hooks/useStudentOutline';
import { useLesstofTaal } from '../../hooks/useLesstofTaal';
import { buildLessonPath, buildResumePointer } from '../../lib/chapterOutline';
import { zonderVergrendeldeHoofdstukken } from '../../lib/hoofdstukSlot';
import HelixBrandBanner from '../common/HelixBrandBanner';
import TaalSchakelaar from '../lesson/TaalSchakelaar';

/**
 * De lesstofpagina van de leerling: waar je verder moet, en daaronder je
 * hoofdstukken.
 *
 * Deze pagina toonde eerder elk hoofdstuk mét al zijn paragrafen en onderdelen.
 * Met één paragraaf per klas ging dat goed, maar het jaarplan telt acht
 * hoofdstukken en de blauwe route alleen al elf paragrafen: dan wordt het een
 * lijst waarin je moet zoeken wat je vandaag moet doen. De paragrafen zijn
 * daarom verhuisd naar een eigen hoofdstukpagina, en hier staat per hoofdstuk
 * nog één kaart met hoever je bent.
 */
export default function TableOfContents() {
  const navigate = useNavigate();
  const { chapters, loading } = useStudentOutline();

  // De taalknop van de leerling. Hij hoort op dezelfde plek te werken als in
  // de les: één keuze voor de hele route.
  const hoofdstukIds = useMemo(() => chapters.map((chapter) => chapter.id), [chapters]);
  const paragraafIds = useMemo(
    () => chapters.flatMap((chapter) => chapter.paragraphRows.map((row) => row.id)),
    [chapters]
  );
  const taal = useLesstofTaal({ hoofdstukIds, paragraafIds });
  const { tekst, aantal } = taal;

  if (loading) return <LesstofSkelet />;

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
              {tekst('lesstof.leeg.titel')}
            </p>
            <p className="mt-2 text-sm text-[var(--helix-muted)]">
              {tekst('lesstof.leeg.tekst')}
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  // Een hoofdstuk op slot hoort niet in "verder waar je was": daar zou de
  // knop naar een les wijzen die nog dicht is.
  const verder = buildResumePointer(zonderVergrendeldeHoofdstukken(chapters));
  const heeftPlus = chapters.some((chapter) => chapter.paragraphRows.some((row) => row.optioneel));
  // De teller bovenaan gaat over wat de leerling nu kan doen; een hoofdstuk op
  // slot zou hem anders met een achterstand laten beginnen.
  const totalen = zonderVergrendeldeHoofdstukken(chapters).reduce(
    (som, chapter) => ({
      done: som.done + chapter.progress.done,
      total: som.total + chapter.progress.total
    }),
    { done: 0, total: 0 }
  );

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="helix-surface overflow-hidden">
          <HelixBrandBanner variant="compact">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="helix-eyebrow">{tekst('lesstof.kop')}</p>
                <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[var(--helix-navy)]">
                  {tekst('lesstof.titel')}
                </h1>
                <p className="mt-1 text-sm font-semibold text-[var(--helix-muted)]">
                  {aantal('hoofdstuk.aantal', chapters.length)} ·{' '}
                  {tekst('onderdeel.af', { done: totalen.done, total: totalen.total })}
                </p>
              </div>
              <TaalSchakelaar
                taal={taal.lesTaal}
                actief={taal.taalActief}
                bezig={taal.bezig}
                onWissel={taal.wisselTaal}
              />
            </div>
          </HelixBrandBanner>
        </section>

        <VerderKaart verder={verder} taal={taal} onStart={(pad) => navigate(pad)} />

        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((chapter) => (
            <HoofdstukKaart
              key={chapter.id}
              chapter={chapter}
              taal={taal}
              onOpen={() => {
                if (chapter.vergrendeld === true) return;
                navigate(`/hoofdstuk/${chapter.id}`);
              }}
            />
          ))}
        </div>

        {heeftPlus && (
          <p className="helix-alert px-5 py-4 text-sm font-semibold">
            <span className="font-black text-[var(--helix-purple)]">{tekst('plus.label')}</span>{' '}
            {tekst('plus.uitleg')}
          </p>
        )}
      </div>
    </PageShell>
  );
}

function PageShell({ children }) {
  return <div className="mx-auto w-full max-w-5xl pad-content">{children}</div>;
}

/**
 * Waar de leerling gebleven was, als eerste ding op het scherm.
 *
 * Zonder deze kaart begon elke les met zoeken: de kop zei wel hoeveel er af
 * was, maar niet wat er nu aan de beurt is, en de knop "Ga verder" stond ergens
 * tussen de rijen.
 */
function VerderKaart({ verder, taal, onStart }) {
  const { tekst, paragraafInfo, hoofdstukInfo } = taal;

  if (!verder) {
    return (
      <section className="helix-surface flex flex-wrap items-center gap-4 p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={26} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold text-[var(--helix-navy)]">
            {tekst('verder.klaar.titel')}
          </p>
          <p className="text-sm font-semibold text-[var(--helix-muted)]">
            {tekst('verder.klaar.tekst')}
          </p>
        </div>
      </section>
    );
  }

  const vertaaldeParagraaf = paragraafInfo(verder.paragraafId);

  return (
    <section className="helix-surface p-6">
      <p className="helix-eyebrow">{tekst('verder.kop')}</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold leading-tight text-[var(--helix-navy)]">
            {verder.paragraafNumber ? `${verder.paragraafNumber} ` : ''}
            {vertaaldeParagraaf?.titel || verder.paragraafTitle}
          </h2>
          <p className="mt-1 text-sm font-bold text-[var(--helix-muted)]">
            {hoofdstukInfo(verder.chapterId)?.titel || verder.chapterTitle} ·{' '}
            {verder.isEersteStap
              ? tekst('status.nietBegonnen')
              : tekst('onderdeel.af', { done: verder.progress.done, total: verder.progress.total })}
          </p>
          <p className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[var(--helix-surface-soft)] px-3 py-1.5 text-sm font-bold text-[var(--helix-navy)]">
            <PlayCircle size={16} className="text-[var(--helix-purple)]" />
            {verder.onderdeelTitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStart(buildLessonPath(verder.paragraafId, verder.onderdeelId))}
          className="btn-primary px-6 py-3.5 text-base"
        >
          {verder.isEersteStap ? tekst('knop.beginnen') : tekst('knop.gaVerder')}
          <ArrowRight size={19} />
        </button>
      </div>

      <div className="helix-progress-track mt-4 h-2">
        <div className="helix-progress-fill" style={{ width: `${verder.progress.percentage}%` }} />
      </div>
    </section>
  );
}

function HoofdstukKaart({ chapter, taal, onOpen }) {
  const { tekst, aantal, hoofdstukInfo } = taal;
  const { progress } = chapter;
  const klaar = progress.isCompleted;
  const begonnen = progress.done > 0;
  const vertaald = hoofdstukInfo(chapter.id);
  const opSlot = chapter.vergrendeld === true;

  // Een hoofdstuk op slot blijft staan, maar grijst weg en draagt een
  // slotsticker. De leerling ziet zo wat eraan komt zonder te denken dat hij
  // iets is vergeten.
  return (
    <section className="helix-surface relative flex flex-col p-6">
      {/* De sticker blijft buiten de grijze laag: hij hoort juist op te vallen. */}
      {opSlot && (
        <span className="absolute -right-2 -top-3 z-10 inline-flex rotate-6 items-center gap-1.5 rounded-full bg-[var(--helix-warning)] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[var(--helix-navy)] shadow-[var(--helix-shadow-card)]">
          <Lock size={13} />
          {tekst('slot.label')}
        </span>
      )}
      <div className={`flex min-w-0 flex-1 flex-col ${opSlot ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="helix-eyebrow">
            {chapter.number
              ? tekst('hoofdstuk.kopMetNummer', { nummer: chapter.number })
              : tekst('hoofdstuk.kop')}
          </p>
          <h2 className="mt-1 font-display text-lg font-extrabold leading-tight text-[var(--helix-navy)]">
            {vertaald?.titel || chapter.title}
          </h2>
        </div>
        {klaar && (
          <span
            title={tekst('hoofdstuk.af')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
          >
            <CheckCircle2 size={19} />
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-bold text-[var(--helix-muted)]">
        {aantal('paragraaf.aantal', chapter.paragraphRows.length)} ·{' '}
        {tekst('onderdeel.af', { done: progress.done, total: progress.total })}
      </p>

      <div className="helix-progress-track mt-2 h-2">
        <div className="helix-progress-fill" style={{ width: `${progress.percentage}%` }} />
      </div>

      {progress.optioneelTotal > 0 && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--helix-purple)]">
          <Sparkles size={13} />
          {progress.optioneelDone > 0
            ? tekst('plus.extraAf', { done: progress.optioneelDone, total: progress.optioneelTotal })
            : tekst('plus.staatKlaar')}
        </p>
      )}

      {opSlot ? (
        <p className="mt-5 flex items-center gap-2 rounded-[var(--helix-radius-md)] bg-[var(--helix-surface-soft)] px-4 py-3 text-sm font-bold text-[var(--helix-muted)]">
          <Lock size={15} />
          {tekst('slot.uitleg')}
        </p>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className={`mt-5 w-full px-5 py-3 text-sm ${begonnen && !klaar ? 'btn-primary' : 'btn-secondary'}`}
        >
          {klaar ? tekst('knop.bekijkTerug') : begonnen ? tekst('knop.gaVerder') : tekst('knop.openen')}
          <ArrowRight size={17} />
        </button>
      )}
      </div>
    </section>
  );
}

/**
 * Tijdens het laden staan de kaarten al op hun plek. Een spinner liet de pagina
 * springen zodra de lesstof binnenkwam.
 */
function LesstofSkelet() {
  return (
    <PageShell>
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <span className="sr-only">Lesstof laden</span>
        <div className="helix-surface h-28 animate-pulse bg-[var(--helix-surface-soft)]" />
        <div className="helix-surface h-36 animate-pulse bg-[var(--helix-surface-soft)]" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="helix-surface h-48 animate-pulse bg-[var(--helix-surface-soft)]" />
          <div className="helix-surface h-48 animate-pulse bg-[var(--helix-surface-soft)]" />
        </div>
      </div>
    </PageShell>
  );
}
