import { AlertCircle, Check, ClipboardCheck, Clock, TriangleAlert } from 'lucide-react';
import { formatProgressAnswer } from '../../lib/progressAnswerFormatter';
import { relatieveTijd } from '../../lib/relatieveTijd';
import BeoordeelActies from './BeoordeelActies';
import StudentAvatar from '../common/StudentAvatar';

/** Eén open beoordeling: wie, welke vraag, welk antwoord, en wat je ermee doet. */
function NakijkKaart({ opdracht, onBeoordeel, bezig, toonLeerling = true }) {
  return (
    <li className="rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] border-l-4 border-l-[var(--helix-warning)] bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {toonLeerling && (
          <>
            <StudentAvatar
              student={opdracht.student}
              size="sm"
              shape="circle"
              fallback="initial"
              fallbackClassName="bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]"
            />
            <span className="font-black text-[var(--helix-navy)]">{opdracht.studentNaam}</span>
          </>
        )}
        <span className="rounded-full bg-[var(--helix-surface-soft)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
          {opdracht.typeLabel}
        </span>
        <span className="text-xs font-bold text-[var(--helix-muted)]">
          {opdracht.paragraafLabel} - stap {opdracht.stapNummer}: {opdracht.stapTitel}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-black text-amber-700">
          <Clock size={14} />
          wacht {relatieveTijd(opdracht.wachtSindsMs)}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-[var(--helix-navy)]">{opdracht.vraag}</p>

      <div className="mt-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2">
        <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
          Antwoord van de leerling
        </span>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-semibold text-[var(--helix-navy)]">
          {formatProgressAnswer(opdracht.antwoord)}
        </p>
      </div>

      {opdracht.modelAntwoord && (
        <div className="mt-2 rounded-[var(--helix-radius-md)] border border-dashed border-[var(--helix-border)] px-3 py-2">
          <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
            Modelantwoord
          </span>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-semibold text-[var(--helix-muted)]">
            {opdracht.modelAntwoord}
          </p>
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-[var(--helix-muted)]">
        <span>Pogingen: {opdracht.pogingen}</span>
        <span>Digidocent-hulp: {opdracht.aiHulp}</span>
      </div>

      <BeoordeelActies opdracht={opdracht} onBeoordeel={onBeoordeel} bezig={bezig} />
    </li>
  );
}

/**
 * De nakijkstapel: alle open beoordelingen van de klas, langst wachtende eerst.
 *
 * Dit scherm bestaat omdat "wacht op nakijken" tot nu toe alleen een kleurtje
 * was. Hier verandert een besluit van de docent daadwerkelijk de status van de
 * stap, via dezelfde voortgangservice als de leerlingroute.
 */
export default function NakijkPaneel({
  opdrachten = [],
  onBeoordeel,
  bezigId = '',
  melding = '',
  fout = ''
}) {
  return (
    <section className="helix-surface mb-8 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">
            Nakijken
          </h2>
          <p className="text-sm font-semibold text-[var(--helix-muted)]">
            {opdrachten.length > 0
              ? `${opdrachten.length} open ${opdrachten.length === 1 ? 'antwoord' : 'antwoorden'}, langst wachtende bovenaan.`
              : 'Alles is nagekeken.'}
          </p>
        </div>
        {opdrachten.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--helix-warning)] bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">
            <ClipboardCheck size={14} />
            {opdrachten.length} te doen
          </span>
        )}
      </div>

      {melding && (
        <p className="mb-3 flex items-center gap-2 rounded-[var(--helix-radius-md)] border border-emerald-600 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
          <Check size={16} />
          {melding}
        </p>
      )}

      {fout && (
        <p className="mb-3 flex items-start gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-danger)] bg-rose-50 px-3 py-2 text-sm font-bold text-rose-800">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          {fout}
        </p>
      )}

      {opdrachten.length > 0 && (
        <p className="mb-4 flex items-start gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--helix-muted)]">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Goedkeuren zet de stap op afgerond, maar kent geen tokens toe: die worden alleen
          door de leerlingroute zelf uitgekeerd. Wil je dat compenseren, gebruik dan
          Tokenbeheer.
        </p>
      )}

      {opdrachten.length === 0 ? (
        <div className="flex items-center gap-3 rounded-[var(--helix-radius-lg)] border border-dashed border-[var(--helix-border)] bg-white/70 p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <ClipboardCheck size={20} />
          </span>
          <div>
            <p className="font-black text-[var(--helix-navy)]">Geen open beoordelingen</p>
            <p className="text-sm font-semibold text-[var(--helix-muted)]">
              Zodra een leerling een open antwoord inlevert dat de Digidocent niet kan
              beoordelen, verschijnt het hier.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {opdrachten.map((opdracht) => (
            <NakijkKaart
              key={opdracht.id}
              opdracht={opdracht}
              onBeoordeel={onBeoordeel}
              bezig={bezigId === opdracht.id}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
