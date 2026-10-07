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
    <div className="mt-2 rounded-[var(--lo-hoek-m)] border border-dashed border-[var(--lo-lijn)] px-3 py-2">
      <span className="lo-onderregel font-bold">
        Waartegen je nakijkt
      </span>

      {!heeftReferentie && (
        <p className="mt-0.5 text-sm text-[var(--lo-grijs)]">
          Bij deze vraag staat geen modelantwoord en staan geen nakijkpunten. Beoordeel op de
          vraag zelf, of vul ze aan in de lesstudio zodat ze er de volgende keer bij staan.
        </p>
      )}

      {opdracht.modelAntwoord && (
        <>
          <span className="lo-onderregel mt-1 font-bold">
            Modelantwoord
          </span>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-[var(--lo-grijs)]">
            {opdracht.modelAntwoord}
          </p>
        </>
      )}

      {nakijkpunten.length > 0 && (
        <>
          <span className="lo-onderregel mt-2 font-bold">
            Nakijkpunten
          </span>
          <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-sm text-[var(--lo-grijs)]">
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
    <div className="mt-2 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)] px-3 py-2">
      <span className="lo-onderregel font-bold">
        Ingeleverd bestand
      </span>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <FileText size={18} className="shrink-0 text-[var(--lo-blauw)]" />
        <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--lo-inkt)]">
          {inlevering.bestandsnaam}
        </span>
        <a
          href={inlevering.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-extrabold text-[var(--lo-blauw-inkt)] hover:underline"
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
    <li className="rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] border-l-4 border-l-[var(--lo-oranje-inkt)] bg-[var(--lo-kaart)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        {toonLeerling && (
          <>
            <StudentAvatar
              student={opdracht.student}
              size="sm"
              shape="circle"
              fallback="initial"
              fallbackClassName="bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw-inkt)]"
            />
            <span className="font-extrabold text-[var(--lo-inkt)]">{opdracht.studentNaam}</span>
          </>
        )}
        <span className="lo-label bg-[var(--lo-papier-2)] text-[var(--lo-grijs)]">
          {opdracht.typeLabel}
        </span>
        <span className="lo-onderregel font-bold">
          {opdracht.paragraafLabel} - stap {opdracht.stapNummer}: {opdracht.stapTitel}
          {opdracht.itemId ? ` - vraag ${opdracht.vraagNummer}` : ''}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-extrabold text-[var(--lo-oranje-inkt)]">
          <Clock size={14} />
          wacht {relatieveTijd(opdracht.wachtSindsMs)}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-[var(--lo-inkt)]">{opdracht.vraag}</p>

      <div className="mt-2 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] px-3 py-2">
        <span className="lo-onderregel font-bold">
          Antwoord van de leerling
        </span>
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-[var(--lo-inkt)]">
          {formatProgressAnswer(opdracht.antwoord)}
        </p>
      </div>

      <InleveringBestandsKaart record={opdracht.record} />

      <NakijkReferentie opdracht={opdracht} />

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[var(--lo-grijs)]">
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
          <h2 className="lo-kaart-titel">
            Nakijken
          </h2>
          <p className="lo-kaart-uitleg">
            {opdrachten.length > 0
              ? `${opdrachten.length} open ${opdrachten.length === 1 ? 'antwoord' : 'antwoorden'}, langst wachtende bovenaan.`
              : 'Alles is nagekeken.'}
          </p>
        </div>
        {opdrachten.length > 0 && (
          <span className="lo-label lo-label--oranje">
            <ClipboardCheck size={14} />
            {opdrachten.length} te doen
          </span>
        )}
      </div>

      {melding && (
        <p className="lo-melding lo-melding--goed mb-3">
          <Check size={16} className="mt-0.5 shrink-0" />
          {melding}
        </p>
      )}

      {itemsBlokkade && (
        <p className="lo-melding lo-melding--info mb-3">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          {itemsBlokkade}
        </p>
      )}

      {fout && (
        <p className="lo-melding lo-melding--fout mb-3">
          <TriangleAlert size={16} className="mt-0.5 shrink-0" />
          {fout}
        </p>
      )}

      {opdrachten.length > 0 && (
        <p className="lo-melding lo-melding--info mb-4">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          Goedkeuren zet de stap op afgerond, maar kent geen tokens toe: die worden alleen
          door de leerlingroute zelf uitgekeerd. Wil je dat compenseren, gebruik dan
          Tokenbeheer.
        </p>
      )}

      {opdrachten.length === 0 ? (
        <div className="flex items-center gap-3 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]">
            <ClipboardCheck size={20} />
          </span>
          <div>
            <p className="font-extrabold text-[var(--lo-inkt)]">Geen open beoordelingen</p>
            <p className="text-sm text-[var(--lo-grijs)]">
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
