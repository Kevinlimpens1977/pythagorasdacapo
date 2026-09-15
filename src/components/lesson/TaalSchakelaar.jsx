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
    <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-[var(--helix-border)] bg-white p-1">
      <Languages size={16} aria-hidden="true" className="ml-2 text-[var(--helix-muted)]" />
      <button
        type="button"
        onClick={() => onWissel(false)}
        aria-pressed={!actief}
        className={`rounded-xl px-3 py-1.5 text-sm font-black ${!actief ? 'bg-[var(--helix-purple)] text-white' : 'text-[var(--helix-muted)]'}`}
      >
        Nederlands
      </button>
      <button
        type="button"
        onClick={() => onWissel(true)}
        aria-pressed={actief}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black ${actief ? 'bg-[var(--helix-purple)] text-white' : 'text-[var(--helix-muted)]'}`}
      >
        {bezig && <Loader2 size={14} className="animate-spin" aria-hidden="true" />}
        {taalLabel(taal)}
      </button>
    </div>
  );
}
