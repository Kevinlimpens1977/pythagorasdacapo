import { AlertCircle, Check, ClipboardCheck, Clock, FileText, TriangleAlert } from 'lucide-react';
import { formatProgressAnswer } from '../../lib/progressAnswerFormatter';
import { normalizeInlevering } from '../../lib/inleveringUtils';
import { relatieveTijd } from '../../lib/relatieveTijd';
import BeoordeelActies from './BeoordeelActies';
import StudentAvatar from '../common/StudentAvatar';

/**
 * Waartegen de docent het antwoord afzet: het modelantwoord en de punten waar
 * hij op let. Allebei komen ze uit de vraag zelf en reizen ze mee met de
 * voortgang; hier wordt alleen getoond wat er staat.
 *
 * Ontbreken ze, dan blijft het vak staan met een zin die uitlegt waarom het leeg
 * is. Zonder die zin lijkt een antwoord zonder referentie op een laadfout, en
 * dan gaat de docent zoeken in plaats van nakijken.
 */
function NakijkReferentie({ opdracht }) {
  const nakijkpunten = opdracht.nakijkpunten || [];
  const heeftReferentie = Boolean(opdracht.modelAntwoord) || nakijkpunten.length > 0;

  return (
    <div className="mt-2 rounded-[var(--helix-radius-md)] border border-dashed border-[var(--helix-border)] px-3 py-2">
      <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
        Waartegen je nakijkt
      </span>

      {!heeftReferentie && (
        <p className="mt-0.5 text-sm font-semibold text-[var(--helix-muted)]">
          Bij deze vraag staat geen modelantwoord en staan geen nakijkpunten. Beoordeel op de
          vraag zelf, of vul ze aan in de lesstudio zodat ze er de volgende keer bij staan.
        </p>
      )}

      {opdracht.modelAntwoord && (
        <>
          <span className="mt-1 block text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
            Modelantwoord
          </span>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm font-semibold text-[var(--helix-muted)]">
            {opdracht.modelAntwoord}
          </p>
        </>
      )}

      {nakijkpunten.length > 0 && (
        <>
          <span className="mt-2 block text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
            Nakijkpunten
          </span>
          <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-sm font-semibold text-[var(--helix-muted)]">
            {nakijkpunten.map((punt) => (
              <li key={punt} className="break-words">{punt}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

/**
 * Het ingeleverde bestand bij een praktijkopdracht (veld `inlevering` op het
 * voortgangsrecord): naam plus een open/download-link. De link is de download-URL
 * van Storage, dus openen werkt ook als het bestand niet in de browser rendert.
 */
function InleveringBestandsKaart({ record }) {
  const inlevering = normalizeInlevering(record?.inlevering);
  if (!inlevering?.url) return null;

  return (
    <div className="mt-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 py-2">
      <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
        Ingeleverd bestand
      </span>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <FileText size={18} className="shrink-0 text-[var(--helix-purple)]" />
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--helix-navy)]">
          {inlevering.bestandsnaam}
        </span>
        <a
          href={inlevering.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-black text-[var(--helix-purple)] hover:underline"
        >
          Openen of downloaden
        </a>
      </div>
    </div>
  );
}

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
          {opdracht.itemId ? ` - vraag ${opdracht.vraagNummer}` : ''}
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

      <InleveringBestandsKaart record={opdracht.record} />

      <NakijkReferentie opdracht={opdracht} />

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
  fout = '',
  itemsBlokkade = ''
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

      {itemsBlokkade && (
        <p className="mb-3 flex items-start gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-warning)] bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          {itemsBlokkade}
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
