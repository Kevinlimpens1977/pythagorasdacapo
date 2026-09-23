import { useEffect, useState } from 'react';
import HelixAvatar from './HelixAvatar';
import { subscribeStudentTokenLoadout } from '../../services/tokenService';
import { normalizeLoadout } from '../../lib/tokenShopRewards';

// Na een goed resultaat doet de avatar zijn emote (Shop 2.0 deel 2C): klein,
// rechtsonder, 2,4 seconden, klikt nergens doorheen. Alleen met een getekende
// avatar. `speel` is een teller: elke nieuwe waarde speelt de emote opnieuw.
export default function EmoteMoment({ uid, speel = 0 }) {
  const [loadout, setLoadout] = useState(null);
  // De teller waarvan het moment al voorbij is.
  const [afgelopen, setAfgelopen] = useState(0);

  useEffect(() => {
    if (!uid) return undefined;
    return subscribeStudentTokenLoadout(uid, (data) => setLoadout(normalizeLoadout(data)), () => {});
  }, [uid]);

  useEffect(() => {
    if (!speel) return undefined;
    const id = window.setTimeout(() => setAfgelopen(speel), 2400);
    return () => window.clearTimeout(id);
  }, [speel]);

  const zichtbaar = speel && speel !== afgelopen ? speel : 0;
  if (!zichtbaar || !loadout?.avatarGetekend) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[390]" role="status" aria-label="Goed gedaan">
      <div className="emote-moment h-32 w-32 overflow-hidden rounded-full border-4 border-[#0B0D0F] bg-white shadow-[4px_4px_0_#0B0D0F]">
        <HelixAvatar key={zichtbaar} avatar={loadout.avatar} beweeg className="h-full w-full" titel="Jouw avatar" />
      </div>
      <style>{`
        .emote-moment { animation: emote-in 2.4s ease-out both; }
        @keyframes emote-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.8); }
          12% { opacity: 1; transform: translateY(0) scale(1); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) { .emote-moment { animation: none; } }
      `}</style>
    </div>
  );
}
