import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

// Kort moment bij een niveau omhoog: 2,4 seconden, klikt nergens doorheen,
// en zonder beweging voor wie dat in het systeem heeft uitgezet.
export default function NiveauOmhoogMoment({ moment, onKlaar }) {
  // Via een ref: de pagina geeft bij elke render een nieuwe functie mee, en
  // anders zou de timer telkens opnieuw beginnen.
  const onKlaarRef = useRef(onKlaar);
  useEffect(() => {
    onKlaarRef.current = onKlaar;
  }, [onKlaar]);

  useEffect(() => {
    if (!moment) return undefined;
    const id = window.setTimeout(() => onKlaarRef.current?.(), 2400);
    return () => window.clearTimeout(id);
  }, [moment]);

  if (!moment) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[400] flex items-center justify-center" role="status" aria-live="polite">
      <div className="niveau-moment flex flex-col items-center gap-2 rounded-2xl border-[3px] border-[#0B0D0F] bg-[#FFD33D] px-10 py-6 text-center text-[#0B0D0F] shadow-[6px_6px_0_#0B0D0F]">
        <Star size={44} className="fill-white" aria-hidden="true" />
        <p className="ds-display text-[44px] leading-none">Niveau {moment.niveau}!</p>
        {moment.tokens > 0 && <p className="text-lg font-extrabold">+{moment.tokens} tokens</p>}
      </div>
      <style>{`
        .niveau-moment { animation: niveau-in 2.4s ease-out both; }
        @keyframes niveau-in {
          0% { opacity: 0; transform: scale(0.7); }
          12% { opacity: 1; transform: scale(1.06); }
          20% { transform: scale(1); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .niveau-moment { animation: none; }
        }
      `}</style>
    </div>
  );
}
