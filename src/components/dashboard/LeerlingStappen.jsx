import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
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
            className="lo-label"
            style={oordeel
              ? { color: oordeel.kleur, backgroundColor: oordeel.achtergrond }
              : { color: 'var(--lo-grijs)', backgroundColor: 'var(--lo-papier-2)' }}
          >
            {oordeel ? oordeel.label : 'Geen oordeel'}
            <span className="font-bold opacity-80">{denktijdSec}s</span>
          </span>
        );
      })}
      {!signalen.serieus && (
        <span
          title={`Signalen: ${signalen.vlaggen.map((vlag) => vlag.reden).join('; ')}`}
          className="lo-label lo-label--oranje"
        >
          Controleer
        </span>
      )}
    </div>
  );
}

/**
 * De losse vragen van een toets of quiz onder de stap: per vraag goed of fout,
 * pogingen, Digidocent-hulp, score en het laatst gegeven antwoord als tekst.
 * Ingeklapt boven de tien vragen, anders wordt een vragenronde van dertig een
 * muur; de kop telt altijd het aantal goed.
 */
function VragenPerItem({ items = [] }) {
  const gemaakt = items.filter((item) => item.status !== STAP_STATUS.NIET_GESTART);
  const goed = items.filter((item) => item.record?.isCorrect === true).length;
  const scoreTotaal = items.reduce((som, item) => som + (item.score || 0), 0);
  const maxTotaal = items.reduce((som, item) => som + (item.maxScore || 0), 0);
  const pogingen = items.reduce((som, item) => som + (item.pogingen || 0), 0);

  return (
    <details className="mt-2 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-papier)] px-3 py-2" open={items.length <= 10}>
      <summary className="cursor-pointer text-xs font-extrabold text-[var(--lo-inkt)]">
        Per vraag: {goed} van {items.length} goed
        {maxTotaal > 0 && ` - ${scoreTotaal}/${maxTotaal} punten`}
        {` - ${pogingen} poging${pogingen === 1 ? '' : 'en'}`}
        {gemaakt.length < items.length && ` - ${items.length - gemaakt.length} nog niet gemaakt`}
      </summary>
      <ol className="mt-2 space-y-1.5">
        {items.map((item) => {
          const presentatie = getStatusPresentatie(item.status);
          const gemaaktItem = item.status !== STAP_STATUS.NIET_GESTART;
          const oordeel = !gemaaktItem
            ? 'Niet gemaakt'
            : item.status === STAP_STATUS.NAKIJKEN
              ? 'Wacht op nakijken'
              : item.record?.isCorrect === true
                ? 'Goed'
                : item.status === STAP_STATUS.AFGEROND || item.status === STAP_STATUS.VASTGELOPEN
                  ? 'Fout'
                  : 'Bezig';
          const oordeelKleur = oordeel === 'Goed'
            ? 'text-[var(--lo-groen-inkt)]'
            : oordeel === 'Fout'
              ? 'text-[var(--lo-rood-inkt)]'
              : 'text-[var(--lo-grijs)]';

          return (
            <li key={item.itemId || item.nummer} className="rounded-[var(--lo-hoek-s)] bg-[var(--lo-kaart)] px-2.5 py-1.5 text-[11px]">
              <div className="flex flex-wrap items-start gap-2">
                <span className={`h-5 min-w-5 justify-center rounded-[var(--lo-hoek-s)] px-1 py-0 text-[11px] leading-none ${presentatie.chipClass}`}>
                  {item.nummer}
                </span>
                <span className="min-w-0 flex-1 font-semibold text-[var(--lo-inkt)]">{item.titel}</span>
                <span className={`font-extrabold ${oordeelKleur}`}>{oordeel}</span>
              </div>
              {gemaaktItem && (
                <div className="mt-1 flex flex-wrap gap-3 pl-7 text-[var(--lo-grijs)]">
                  {item.record?.herkansing && (
                    <span className="text-[var(--lo-inkt)]">
                      1e ronde: {item.record.ronde1?.isCorrect ? 'goed' : 'fout'}
                      {' - herkansing: '}
                      {item.record.herkansing.completed
                        ? (item.record.herkansing.isCorrect ? 'goed' : 'fout')
                        : 'bezig'}
                      {` (${item.record.herkansing.attempts || 0} ${item.record.herkansing.attempts === 1 ? 'poging' : 'pogingen'}`}
                      {item.record.herkansing.aiHelpCount > 0 ? `, ${item.record.herkansing.aiHelpCount}x Digidocent` : ''}
                      {')'}
                    </span>
                  )}
                  <span>Pogingen: {item.pogingen}</span>
                  {item.aiHulp > 0 && <span>Digidocent-hulp: {item.aiHulp}</span>}
                  {item.maxScore > 0 && <span>Score: {item.score}/{item.maxScore}</span>}
                  {(item.antwoordTekst || item.record?.lastAnswer != null) && (
                    <span className="max-w-full truncate">
                      Antwoord: {item.antwoordTekst || formatProgressAnswer(item.record.lastAnswer)}
                    </span>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </details>
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
            className={`h-8 w-8 cursor-pointer justify-center rounded-[var(--lo-hoek-s)] p-0 text-xs transition hover:brightness-95 ${presentatie.chipClass} ${
              actief ? 'ring-2 ring-[var(--lo-inkt)] ring-offset-1' : ''
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
/**
 * Opnieuw laten maken: een beheerder wist al het gemaakte werk van deze stap
 * voor deze leerling. Eerst een bevestiging in de rij zelf, dan pas de
 * server-actie. Tokens blijven staan en komen niet opnieuw (zie
 * resetLeerlingBlokWerk in functions/index.js).
 */
function ResetStapActie({ stap, leerlingNaam = '', onReset, bezig = false }) {
  const [bevestigen, setBevestigen] = useState(false);

  if (!bevestigen) {
    return (
      <button
        type="button"
        onClick={() => setBevestigen(true)}
        disabled={bezig}
        className="lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar mt-2"
      >
        <RotateCcw size={16} aria-hidden="true" />
        Opnieuw laten maken
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-[var(--lo-hoek-m)] bg-[var(--lo-rood-zacht)] px-3 py-2.5">
      <p className="text-xs font-extrabold text-[var(--lo-rood-inkt)]">
        Al het gemaakte werk van {leerlingNaam || 'deze leerling'} voor stap {stap.nummer} ({stap.titel}) wordt verwijderd.
      </p>
      <p className="mt-1 text-xs text-[var(--lo-rood-inkt)]">
        Antwoorden, pogingen, score en herkansing gaan weg. De leerling maakt de stap opnieuw. Verdiende tokens blijven staan en komen niet opnieuw. Dit kan niet ongedaan worden gemaakt.
      </p>
      <div className="lo-knoppenbalk mt-2">
        <button
          type="button"
          onClick={async () => {
            const gelukt = await onReset(stap);
            if (gelukt) setBevestigen(false);
          }}
          disabled={bezig}
          className="lo-knop lo-knop--gevaar lo-knop--klein"
        >
          <RotateCcw size={16} aria-hidden="true" />
          {bezig ? 'Bezig...' : 'Ja, werk verwijderen'}
        </button>
        <button
          type="button"
          onClick={() => setBevestigen(false)}
          disabled={bezig}
          className="lo-knop-tweede lo-knop--klein"
        >
          Annuleren
        </button>
      </div>
    </div>
  );
}

export default function LeerlingStappen({
  rapport = null,
  nakijkOpdrachtenPerBlockId = {},
  onBeoordeel,
  bezigId = '',
  onResetStap = null,
  resetBezigId = '',
  leerlingNaam = ''
}) {
  if (!rapport || !rapport.stappen.length) {
    return (
      <p className="mt-3 text-sm text-[var(--lo-grijs)]">
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
            className={`rounded-[var(--lo-hoek-m)] border bg-[var(--lo-kaart)] px-3 py-2.5 ${
              stap.status === STAP_STATUS.NIET_GESTART ? 'border-dashed border-[var(--lo-lijn)]' : 'border-[var(--lo-lijn)]'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={`h-7 w-7 justify-center rounded-[var(--lo-hoek-s)] p-0 text-xs ${presentatie.chipClass}`}>
                {stap.nummer}
              </span>
              <span className="font-bold text-[var(--lo-inkt)]">{stap.titel}</span>
              <span className="lo-label bg-[var(--lo-papier-2)] text-[var(--lo-grijs)]">
                {stap.typeLabel}
              </span>
              <span className={`ml-auto inline-flex items-center gap-1.5 text-xs font-extrabold ${
                stap.status === STAP_STATUS.VASTGELOPEN ? 'text-[var(--lo-rood-inkt)]' : 'text-[var(--lo-grijs)]'
              }`}>
                <span className={`h-2 w-2 rounded-full ${presentatie.dotClass}`} />
                {presentatie.label}
              </span>
            </div>

            <p className="mt-1 text-xs text-[var(--lo-grijs)]">
              {stap.toelichting}
              {stap.laatsteActiviteitMs > 0 && ` - ${relatieveTijd(stap.laatsteActiviteitMs)}`}
            </p>

            {record && (
              <div className="mt-1.5 flex flex-wrap gap-3 text-[11px] text-[var(--lo-grijs)]">
                <span>Pogingen: {stap.pogingen}</span>
                <span>Digidocent-hulp: {stap.aiHulp}</span>
                {Number(record.itemCount || 0) > 0 && !record.herkansing && (
                  <span>Vragen: {record.itemsCorrect || 0}/{record.itemCount} goed</span>
                )}
                {Number(record.itemCount || 0) > 0 && record.herkansing && (
                  <>
                    <span>Eerste ronde: {record.eersteScore?.itemsCorrect ?? '?'}/{record.itemCount} goed</span>
                    <span className="text-[var(--lo-inkt)]">
                      Na herkansing: {record.itemsCorrect || 0}/{record.itemCount} goed
                      {record.herkansing.itemsHerkanst ? ` (${record.herkansing.itemsGoed || 0} van ${record.herkansing.itemsHerkanst} herkanst goed` : ''}
                      {record.herkansing.itemsHerkanst && record.herkansing.aiHelpCount > 0 ? `, ${record.herkansing.aiHelpCount}x Digidocent` : ''}
                      {record.herkansing.itemsHerkanst ? ')' : ''}
                      {record.herkansing.completed === false ? ' - loopt nog' : ''}
                    </span>
                  </>
                )}
                {record.lastAnswer != null && (
                  <span className="max-w-full truncate">
                    Laatste antwoord: {formatProgressAnswer(record.lastAnswer)}
                  </span>
                )}
              </div>
            )}

            {record && <ZelfbeoordelingBadges records={record.zelfbeoordeling} />}

            {Array.isArray(stap.items) && stap.items.length > 0 && (
              <VragenPerItem items={stap.items} />
            )}

            {record?.teacherReview?.besluit && (
              <p className="mt-1.5 text-[11px] font-bold text-[var(--lo-grijs)]">
                {record.teacherReview.besluitLabel || 'Beoordeeld'}
                {record.teacherReview.docentNaam ? ` door ${record.teacherReview.docentNaam}` : ''}
                {record.teacherReview.opmerking ? ` - "${record.teacherReview.opmerking}"` : ''}
              </p>
            )}

            {onResetStap && stap.blockId && (record || stap.status !== STAP_STATUS.NIET_GESTART) && (
              <ResetStapActie
                stap={stap}
                leerlingNaam={leerlingNaam}
                onReset={onResetStap}
                bezig={resetBezigId === stap.blockId}
              />
            )}

            {onBeoordeel && nakijkOpdrachten.map((nakijkOpdracht) => (
              <div key={nakijkOpdracht.id}>
                {nakijkOpdracht.itemId && (
                  <p className="mt-2 text-xs font-extrabold text-[var(--lo-inkt)]">
                    Vraag {nakijkOpdracht.vraagNummer}: {nakijkOpdracht.vraag}
                  </p>
                )}
                {nakijkOpdracht.itemId && (
                  <p className="text-xs text-[var(--lo-grijs)]">
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
