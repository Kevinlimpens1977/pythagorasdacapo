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

/**
 * De drie knoppen waarmee een docent een open antwoord afhandelt, plus het
 * optionele notitieveld dat als toelichting bij het antwoord wordt bewaard.
 *
 * Bewust een los onderdeel: dezelfde handeling hoort zowel in de nakijkstapel
 * te staan als bij de stap in het leerlingoverzicht, en die twee mogen niet uit
 * elkaar gaan lopen.
 */
export default function BeoordeelActies({
  opdracht = null,
  onBeoordeel,
  bezig = false,
  compact = false
}) {
  const [opmerking, setOpmerking] = useState('');

  if (!opdracht) return null;

  if (!opdracht.beoordeelbaar) {
    return (
      <p className="mt-2 flex items-start gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-[var(--helix-surface-soft)] px-3 py-2 text-xs font-semibold text-[var(--helix-muted)]">
        <TriangleAlert size={14} className="mt-0.5 shrink-0" />
        Deze stap komt uit een ouder voortgangrecord zonder lesblok. Beoordelen kan hier niet;
        zet het onderdeel opnieuw klaar in de lesstudio.
      </p>
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
        className="input-standard w-full py-2 text-sm font-semibold text-[var(--helix-navy)]"
      />

      <div className="mt-2 flex flex-wrap gap-2">
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
              className={`inline-flex items-center gap-1.5 rounded-[var(--helix-radius-md)] border px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${presentatie.knopClass}`}
            >
              {bezig ? <Loader2 size={14} className="animate-spin" /> : <Icoon size={14} />}
              {presentatie.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
