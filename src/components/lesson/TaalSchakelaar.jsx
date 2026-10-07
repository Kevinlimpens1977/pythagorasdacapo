import { Languages, Loader2 } from 'lucide-react';
import { taalLabel } from '../../lib/lesTaal';

/**
 * Eén schakelaar per lespagina: Nederlands of de eigen taal van de leerling.
 * Hij zet alles op het scherm tegelijk om. Een knop bij elk tekstblok zou de
 * pagina rommelig maken en het lezen onderbreken.
 */
export default function TaalSchakelaar({ taal, actief, bezig, onWissel }) {
  if (!taal) return null;

  return (
    <div className="lo-keuzes" style={{ alignItems: 'center' }}>
      <Languages size={16} aria-hidden="true" style={{ color: 'var(--lo-grijs)' }} />
      <button
        type="button"
        className="lo-keuze"
        onClick={() => onWissel(false)}
        aria-pressed={!actief}
      >
        Nederlands
      </button>
      <button
        type="button"
        className="lo-keuze"
        onClick={() => onWissel(true)}
        aria-pressed={actief}
      >
        {bezig && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        {taalLabel(taal)}
      </button>
    </div>
  );
}
