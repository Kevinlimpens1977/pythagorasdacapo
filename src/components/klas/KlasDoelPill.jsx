import { useEffect, useState } from 'react';
import { PartyPopper, Users } from 'lucide-react';
import { klasdoelProcent } from '../../lib/klasSamen';
import { subscribeKlasDoel } from '../../services/klasSamenService';

// Het klasdoel in de kopbalk (fase 3). Alleen zichtbaar als de docent een doel
// heeft gezet; een klik brengt je naar Mijn klas.
export default function KlasDoelPill({ klasId, disabled = false, onOpen }) {
  const [doel, setDoel] = useState(null);

  useEffect(() => {
    if (!klasId || disabled) return undefined;
    return subscribeKlasDoel(klasId, setDoel, (error) => console.warn('Klasdoel kon niet worden geladen:', error));
  }, [disabled, klasId]);

  if (!doel || !['actief', 'gehaald'].includes(doel.status)) return null;

  if (doel.status === 'gehaald') {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="hidden min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--color-green-ink)] bg-[var(--color-green-soft)] px-3 text-sm font-black text-[var(--color-green-ink)] shadow-sm md:inline-flex"
        title={`Klasdoel gehaald: ${doel.titel}`}
      >
        <PartyPopper size={17} aria-hidden="true" />
        <span>Klasdoel gehaald</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      className="hidden min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] bg-white px-3 text-sm font-black text-[var(--helix-navy)] shadow-sm hover:border-[var(--helix-purple)] lg:inline-flex"
      title={`Klasdoel: ${doel.titel}. Elk blok dat je afmaakt met 60% of meer telt mee.`}
    >
      <Users size={17} className="text-[var(--helix-purple)]" aria-hidden="true" />
      <span>Klas {doel.stand}/{doel.doel}</span>
      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-[var(--helix-border)]" aria-hidden="true">
        <span className="block h-full rounded-full bg-[var(--helix-purple)]" style={{ width: `${klasdoelProcent(doel)}%` }} />
      </span>
    </button>
  );
}
