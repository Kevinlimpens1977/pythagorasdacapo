import { STAP_STATUS, getStatusPresentatie } from '../../lib/klasVoortgangOverzicht';
import { formatProgressAnswer } from '../../lib/progressAnswerFormatter';
import { relatieveTijd } from '../../lib/relatieveTijd';
import { ZELFOORDELEN, berekenSerieusSignalen } from '../../lib/zelfbeoordeling';
import BeoordeelActies from './BeoordeelActies';

/**
 * De zelfbeoordeling van een oefenblok: per opgave het eigen oordeel van de
 * leerling met de denktijd, plus een oranje "Controleer"-badge zodra de
 * serieus-signalen daar reden toe geven (doorklikken, te snel, te kaal).
 */
function ZelfbeoordelingBadges({ records = [] }) {
  if (!Array.isArray(records) || !records.length) return null;

  const signalen = berekenSerieusSignalen(records);

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
      {records.map((record, index) => {
        const oordeel = ZELFOORDELEN[record?.zelfoordeel] || null;
        const denktijdSec = Math.round((record?.denktijdMs || 0) / 1000);
        return (
          <span
            key={record?.fieldId || index}
            title={`Opgave ${index + 1}: ${oordeel ? oordeel.label : 'geen zelfoordeel (Digidocent faalde)'} - denktijd ${denktijdSec}s`}
            className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-[10px] font-black"
            style={oordeel
              ? { color: oordeel.kleur, backgroundColor: oordeel.achtergrond }
              : { color: 'var(--helix-muted)', backgroundColor: 'var(--helix-surface-soft)' }}
          >
            {oordeel ? oordeel.label : 'Geen oordeel'}
            <span className="font-bold opacity-80">{denktijdSec}s</span>
          </span>
        );
      })}
      {!signalen.serieus && (
        <span
          title={`Signalen: ${signalen.vlaggen.map((vlag) => vlag.reden).join('; ')}`}
          className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-800"
        >
          Controleer
        </span>
      )}
    </div>
  );
}

/** De negen (of hoeveel dan ook) stappen van een paragraaf als spoor. */
export function StappenSpoor({ stappen = [], actieveStapId = '', onSelectStap }) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Stappen in deze paragraaf">
      {stappen.map((stap) => {
        const presentatie = getStatusPresentatie(stap.status);
        const actief = actieveStapId === stap.blockId;

        return (
          <button
            key={stap.blockId || stap.nummer}
            type="button"
            onClick={() => onSelectStap?.(stap)}
            title={`Stap ${stap.nummer} - ${stap.titel} (${presentatie.label}): ${stap.toelichting}`}
            className={`h-8 w-8 rounded-lg border text-xs font-black transition hover:brightness-95 ${presentatie.chipClass} ${
              actief ? 'ring-2 ring-[var(--helix-purple)] ring-offset-1' : ''
            }`}
          >
            {stap.nummer}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Alle stappen van één paragraaf uitgeschreven: wat is het, hoe ging het, en
 * wat gaf de leerling als laatste antwoord. Stappen zonder record staan er
 * bewust bij, anders lijkt een lege paragraaf op een afgeronde paragraaf.
 */
export default function LeerlingStappen({
  rapport = null,
  nakijkOpdrachtenPerBlockId = {},
  onBeoordeel,
  bezigId = ''
}) {
  if (!rapport || !rapport.stappen.length) {
    return (
      <p className="mt-3 text-sm font-semibold text-[var(--helix-muted)]">
        Deze paragraaf heeft nog geen lesblokken.
      </p>
    );
  }

  return (
    <ol className="mt-3 space-y-2">
      {rapport.stappen.map((stap) => {
        const presentatie = getStatusPresentatie(stap.status);
        const record = stap.record;
        // Alleen bij een stap die op de docent wacht hoort een besluitknop.
        // Bij elke andere status zou "goedkeuren" betekenisloos zijn. Een toets
        // levert er meerdere op: één per vraag die nog op een oordeel wacht.
        const nakijkOpdrachten = stap.status === STAP_STATUS.NAKIJKEN
          ? nakijkOpdrachtenPerBlockId[stap.blockId] || []
          : [];

        return (
          <li
            key={stap.blockId || stap.nummer}
            className={`rounded-[var(--helix-radius-md)] border bg-white px-3 py-2.5 ${
              stap.status === STAP_STATUS.NIET_GESTART ? 'border-dashed border-[var(--helix-border)]' : 'border-[var(--helix-border)]'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-black ${presentatie.chipClass}`}>
                {stap.nummer}
              </span>
              <span className="font-bold text-[var(--helix-navy)]">{stap.titel}</span>
              <span className="rounded-full bg-[var(--helix-surface-soft)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[var(--helix-muted)]">
                {stap.typeLabel}
              </span>
              <span className={`ml-auto inline-flex items-center gap-1.5 text-xs font-black ${
                stap.status === STAP_STATUS.VASTGELOPEN ? 'text-rose-700' : 'text-[var(--helix-muted)]'
              }`}>
                <span className={`h-2 w-2 rounded-full ${presentatie.dotClass}`} />
                {presentatie.label}
              </span>
            </div>

            <p className="mt-1 text-xs font-semibold text-[var(--helix-muted)]">
              {stap.toelichting}
              {stap.laatsteActiviteitMs > 0 && ` - ${relatieveTijd(stap.laatsteActiviteitMs)}`}
            </p>

            {record && (
              <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] font-semibold text-[var(--helix-muted)]">
                <span>Pogingen: {stap.pogingen}</span>
                <span>Digidocent-hulp: {stap.aiHulp}</span>
                {Number(record.itemCount || 0) > 0 && (
                  <span>Vragen: {record.itemsCorrect || 0}/{record.itemCount} goed</span>
                )}
                {record.lastAnswer != null && (
                  <span className="max-w-full truncate">
                    Laatste antwoord: {formatProgressAnswer(record.lastAnswer)}
                  </span>
                )}
              </div>
            )}

            {record && <ZelfbeoordelingBadges records={record.zelfbeoordeling} />}

            {record?.teacherReview?.besluit && (
              <p className="mt-1.5 text-[11px] font-bold text-[var(--helix-muted)]">
                {record.teacherReview.besluitLabel || 'Beoordeeld'}
                {record.teacherReview.docentNaam ? ` door ${record.teacherReview.docentNaam}` : ''}
                {record.teacherReview.opmerking ? ` - "${record.teacherReview.opmerking}"` : ''}
              </p>
            )}

            {onBeoordeel && nakijkOpdrachten.map((nakijkOpdracht) => (
              <div key={nakijkOpdracht.id}>
                {nakijkOpdracht.itemId && (
                  <p className="mt-2 text-xs font-black text-[var(--helix-navy)]">
                    Vraag {nakijkOpdracht.vraagNummer}: {nakijkOpdracht.vraag}
                  </p>
                )}
                {nakijkOpdracht.itemId && (
                  <p className="text-xs font-semibold text-[var(--helix-muted)]">
                    Antwoord: {formatProgressAnswer(nakijkOpdracht.antwoord)}
                  </p>
                )}
                <BeoordeelActies
                  opdracht={nakijkOpdracht}
                  onBeoordeel={onBeoordeel}
                  bezig={bezigId === nakijkOpdracht.id}
                  compact
                />
              </div>
            ))}
          </li>
        );
      })}
    </ol>
  );
}
