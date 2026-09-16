import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';

import { useStudentOutline } from '../../hooks/useStudentOutline';
import { buildLessonPath, buildResumePointer } from '../../lib/chapterOutline';
import { PLUS_LABEL } from '../../lib/paragraphMetadata';
import HelixBrandBanner from '../common/HelixBrandBanner';

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
              Nog geen lesstof klaargezet voor jouw klas
            </p>
            <p className="mt-2 text-sm text-[var(--helix-muted)]">
              Je docent zet hier straks lessen voor je klaar.
            </p>
          </div>
        </div>
      </PageShell>
    );
  }

  const verder = buildResumePointer(chapters);
  const heeftPlus = chapters.some((chapter) => chapter.paragraphRows.some((row) => row.optioneel));
  const totalen = chapters.reduce(
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
            <p className="helix-eyebrow">Lesstof</p>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[var(--helix-navy)]">
              Jouw lesstof
            </h1>
            <p className="mt-1 text-sm font-semibold text-[var(--helix-muted)]">
              {chapters.length} hoofdstuk{chapters.length === 1 ? '' : 'ken'} · {totalen.done} van {totalen.total} onderdelen af
            </p>
          </HelixBrandBanner>
        </section>

        <VerderKaart verder={verder} onStart={(pad) => navigate(pad)} />

        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((chapter) => (
            <HoofdstukKaart
              key={chapter.id}
              chapter={chapter}
              onOpen={() => navigate(`/hoofdstuk/${chapter.id}`)}
            />
          ))}
        </div>

        {heeftPlus && (
          <p className="helix-alert px-5 py-4 text-sm font-semibold">
            Paragrafen met het label{' '}
            <span className="font-black text-[var(--helix-purple)]">{PLUS_LABEL}</span> hoef je niet te
            doen. Ze tellen niet mee voor je hoofdstuk, maar leveren wel tokens op en zijn een
            aanrader als je later naar de havo wilt.
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
function VerderKaart({ verder, onStart }) {
  if (!verder) {
    return (
      <section className="helix-surface flex flex-wrap items-center gap-4 p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={26} />
        </span>
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Je bent bij</p>
          <p className="text-sm font-semibold text-[var(--helix-muted)]">
            Alles wat klaarstaat heb je af. Kies hieronder een hoofdstuk om iets terug te lezen.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="helix-surface p-6">
      <p className="helix-eyebrow">Verder waar je was</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold leading-tight text-[var(--helix-navy)]">
            {verder.paragraafNumber ? `${verder.paragraafNumber} ` : ''}{verder.paragraafTitle}
          </h2>
          <p className="mt-1 text-sm font-bold text-[var(--helix-muted)]">
            {verder.chapterTitle} · {verder.isEersteStap ? 'nog niet begonnen' : `${verder.progress.done} van ${verder.progress.total} onderdelen af`}
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
          {verder.isEersteStap ? 'Beginnen' : 'Ga verder'}
          <ArrowRight size={19} />
        </button>
      </div>

      <div className="helix-progress-track mt-4 h-2">
        <div className="helix-progress-fill" style={{ width: `${verder.progress.percentage}%` }} />
      </div>
    </section>
  );
}

function HoofdstukKaart({ chapter, onOpen }) {
  const { progress } = chapter;
  const klaar = progress.isCompleted;
  const begonnen = progress.done > 0;

  return (
    <section className="helix-surface flex flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="helix-eyebrow">
            Hoofdstuk{chapter.number ? ` ${chapter.number}` : ''}
          </p>
          <h2 className="mt-1 font-display text-lg font-extrabold leading-tight text-[var(--helix-navy)]">
            {chapter.title}
          </h2>
        </div>
        {klaar && (
          <span
            title="Dit hoofdstuk is af"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
          >
            <CheckCircle2 size={19} />
          </span>
        )}
      </div>

      <p className="mt-3 text-sm font-bold text-[var(--helix-muted)]">
        {chapter.paragraphRows.length} paragra{chapter.paragraphRows.length === 1 ? 'af' : 'fen'} ·{' '}
        {progress.done} van {progress.total} onderdelen af
      </p>

      <div className="helix-progress-track mt-2 h-2">
        <div className="helix-progress-fill" style={{ width: `${progress.percentage}%` }} />
      </div>

      {progress.optioneelTotal > 0 && (
        <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[var(--helix-purple)]">
          <Sparkles size={13} />
          {progress.optioneelDone > 0
            ? `Plus: ${progress.optioneelDone} van ${progress.optioneelTotal} extra af`
            : 'Plusstof staat klaar als je meer wilt'}
        </p>
      )}

      <button
        type="button"
        onClick={onOpen}
        className={`mt-5 w-full px-5 py-3 text-sm ${begonnen && !klaar ? 'btn-primary' : 'btn-secondary'}`}
      >
        {klaar ? 'Bekijk terug' : begonnen ? 'Ga verder' : 'Openen'}
        <ArrowRight size={17} />
      </button>
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
