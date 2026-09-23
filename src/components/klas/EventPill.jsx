import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { eventActief } from '../../lib/privileges';
import { subscribeKlasEvent } from '../../services/privilegeService';

// In de kopbalk zolang de klas een dubbele-XP-week heeft (fase 4).
export default function EventPill({ klasId, disabled = false }) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!klasId || disabled) return undefined;
    return subscribeKlasEvent(klasId, setEvent, (error) => console.warn('Event kon niet worden geladen:', error));
  }, [disabled, klasId]);

  if (!eventActief(event)) return null;
  return (
    <div
      className="hidden min-h-11 items-center gap-2 rounded-[var(--helix-radius-md)] border-2 border-[#0B0D0F] bg-[#FFD33D] px-3 text-sm font-black text-[#0B0D0F] shadow-sm md:inline-flex"
      title={`Dubbele XP tot en met ${event.tot}. Tokens tellen gewoon.`}
    >
      <Sparkles size={17} aria-hidden="true" />
      <span>Dubbele XP</span>
    </div>
  );
}
