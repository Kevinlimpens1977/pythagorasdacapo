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
        className="lo-pil lo-pil--groen hidden md:inline-flex"
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
      className="lo-pil hidden lg:inline-flex"
      title={`Klasdoel: ${doel.titel}. Elk blok dat je afmaakt met 60% of meer telt mee.`}
    >
      <Users size={17} className="lo-pil-icoon text-[var(--lo-blauw)]" aria-hidden="true" />
      <span>Klas {doel.stand}/{doel.doel}</span>
      <span className="lo-pil-balk lo-pil-balk--blauw" aria-hidden="true"><i style={{ width: `${klasdoelProcent(doel)}%` }} /></span>
    </button>
  );
}
