import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { niveauVoorXp } from '../../lib/beloning';
import { subscribeLeerlingVoortgang } from '../../services/tokenService';

// Niveau (XP) in de kopbalk, met een voortgangsbalkje naar het volgende niveau.
export default function NiveauPill({ studentUid, disabled = false }) {
  const [voortgang, setVoortgang] = useState({ xp: 0 });

  useEffect(() => {
    if (!studentUid || disabled) return undefined;
    return subscribeLeerlingVoortgang(
      studentUid,
      setVoortgang,
      (error) => console.warn('Niveau kon niet worden geladen:', error)
    );
  }, [disabled, studentUid]);

  const { niveau, xpInNiveau, xpNodig } = niveauVoorXp(voortgang?.xp || 0);
  const procent = xpNodig > 0 ? Math.round((xpInNiveau / xpNodig) * 100) : 100;

  return (
    <div
      className="lo-pil hidden sm:inline-flex"
      title={xpNodig > 0 ? `Niveau ${niveau}: nog ${xpNodig - xpInNiveau} XP tot niveau ${niveau + 1}` : `Niveau ${niveau}: het hoogste niveau`}
    >
      <Star size={17} className="lo-pil-icoon text-[var(--lo-oranje-inkt)]" aria-hidden="true" />
      <span>Niveau {niveau}</span>
      <span className="lo-pil-balk lo-pil-balk--blauw" aria-hidden="true">
        <i style={{ width: `${procent}%` }} />
      </span>
    </div>
  );
}
