import { useState } from 'react';
import { Check, Loader2, RotateCcw, TriangleAlert, X } from 'lucide-react';
import {
  NAKIJK_BESLUIT,
  NAKIJK_BESLUITEN,
  getBesluitPresentatie
} from '../../lib/nakijkOpdrachten';

const BESLUIT_ICOON = {
  [NAKIJK_BESLUIT.GOEDGEKEURD]: Check,
  [NAKIJK_BESLUIT.OPNIEUW]: RotateCcw,
  [NAKIJK_BESLUIT.AFGEKEURD]: X
};

const BESLUIT_KNOP = {
  [NAKIJK_BESLUIT.GOEDGEKEURD]: 'lo-knop lo-knop--klein',
  [NAKIJK_BESLUIT.OPNIEUW]: 'lo-knop-tweede lo-knop--klein',
  [NAKIJK_BESLUIT.AFGEKEURD]: 'lo-knop-tweede lo-knop--klein lo-knop-tweede--gevaar'
};

const STANDAARD_BLOKKADE =
  'Deze stap komt uit een ouder voortgangrecord zonder lesblok. Beoordelen kan hier niet; ' +
  'zet het onderdeel opnieuw klaar in de lesstudio.';

/**
 * De drie knoppen waarmee een docent een open antwoord afhandelt, plus het
 * optionele notitieveld dat als toelichting bij het antwoord wordt bewaard.
 *
 * Bewust een los onderdeel: dezelfde handeling hoort zowel in de nakijkstapel
 * te staan als bij de stap in het leerlingoverzicht, en die twee mogen niet uit
 * elkaar gaan lopen.
 *
 * Kan een besluit niets veranderen, dan staan de knoppen er wel maar zijn ze
 * uitgeschakeld en grijs, met de reden erboven. Een knop die wel klikbaar oogt
 * maar niets afmaakt, is erger dan geen knop: de docent denkt dat het werk weg
 * is terwijl de leerling blijft wachten.
 */
export default function BeoordeelActies({
  opdracht = null,
  onBeoordeel,
  bezig = false,
  compact = false
}) {
  const [opmerking, setOpmerking] = useState('');

  if (!opdracht) return null;

  const blokkade = opdracht.beoordeelbaar ? '' : (opdracht.blokkade || STANDAARD_BLOKKADE);

  if (blokkade) {
    return (
      <div className={compact ? 'mt-2' : 'mt-3'}>
        <p className="lo-melding lo-melding--info">
          <TriangleAlert size={14} className="mt-0.5 shrink-0" />
          {blokkade}
        </p>
        <div className="lo-knoppenbalk mt-2">
          {NAKIJK_BESLUITEN.map((besluit) => {
            const presentatie = getBesluitPresentatie(besluit);
            const Icoon = BESLUIT_ICOON[besluit];

            return (
              <button
                key={besluit}
                type="button"
                disabled
                aria-disabled="true"
                title={blokkade}
                className="lo-knop-tweede lo-knop--klein"
              >
                <Icoon size={16} />
                {presentatie.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const verstuur = async (besluit) => {
    if (bezig) return;
    const gelukt = await onBeoordeel?.(opdracht, besluit, opmerking);
    if (gelukt !== false) setOpmerking('');
  };

  return (
    <div className={compact ? 'mt-2' : 'mt-3'}>
      <label className="sr-only" htmlFor={`opmerking-${opdracht.id}`}>
        Toelichting voor {opdracht.studentNaam}
      </label>
      <input
        id={`opmerking-${opdracht.id}`}
        type="text"
        value={opmerking}
        disabled={bezig}
        onChange={(event) => setOpmerking(event.target.value)}
        placeholder="Toelichting voor de leerling (optioneel)"
        className="input-standard w-full py-2 text-sm text-[var(--lo-inkt)]"
      />

      <div className="lo-knoppenbalk mt-2">
        {NAKIJK_BESLUITEN.map((besluit) => {
          const presentatie = getBesluitPresentatie(besluit);
          const Icoon = BESLUIT_ICOON[besluit];

          return (
            <button
              key={besluit}
              type="button"
              disabled={bezig}
              onClick={() => verstuur(besluit)}
              title={presentatie.gevolg}
              className={BESLUIT_KNOP[besluit]}
            >
              {bezig ? <Loader2 size={16} className="animate-spin" /> : <Icoon size={16} />}
              {presentatie.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
