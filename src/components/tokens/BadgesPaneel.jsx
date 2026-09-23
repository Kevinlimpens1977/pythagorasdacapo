import { useEffect, useState } from 'react';
import { Award, Crown, Flame, Home, Lock, RotateCcw, Sparkles, Star, Target, Trophy } from 'lucide-react';
import { BADGES, niveauVoorXp } from '../../lib/beloning';
import { subscribeLeerlingVoortgang } from '../../services/tokenService';

const ICONEN = {
  star: Star, stars: Star, sparkles: Sparkles, award: Award, target: Target,
  flame: Flame, rotate: RotateCcw, home: Home, trophy: Trophy, crown: Crown
};

// Niveau, sterren, weekreeks en badges op het profiel van de leerling.
export default function BadgesPaneel({ studentUid, disabled = false }) {
  const [voortgang, setVoortgang] = useState(null);

  useEffect(() => {
    if (!studentUid || disabled) return undefined;
    return subscribeLeerlingVoortgang(
      studentUid,
      setVoortgang,
      (error) => console.warn('Badges konden niet worden geladen:', error)
    );
  }, [disabled, studentUid]);

  if (!voortgang) return null;
  const { niveau, xpInNiveau, xpNodig } = niveauVoorXp(voortgang.xp || 0);
  const behaald = new Set(Array.isArray(voortgang.badges) ? voortgang.badges : []);
  const procent = xpNodig > 0 ? Math.round((xpInNiveau / xpNodig) * 100) : 100;

  return (
    <section className="helix-card mb-5 p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="helix-eyebrow">Mijn voortgang</p>
          <h2 className="mt-1 text-2xl font-black text-[var(--helix-navy)]">Niveau {niveau}</h2>
          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[var(--helix-muted)]">
            <span className="h-2 w-40 overflow-hidden rounded-full bg-[var(--helix-border)]" aria-hidden="true">
              <span className="block h-full rounded-full bg-[#087EB5]" style={{ width: `${procent}%` }} />
            </span>
            {xpNodig > 0 ? `nog ${xpNodig - xpInNiveau} XP tot niveau ${niveau + 1}` : 'hoogste niveau'}
          </div>
        </div>
        <dl className="flex gap-5 text-center">
          <div><dt className="text-xs font-black uppercase text-[var(--helix-muted)]">XP</dt><dd className="text-xl font-black">{voortgang.xp || 0}</dd></div>
          <div><dt className="text-xs font-black uppercase text-[var(--helix-muted)]">Sterren</dt><dd className="text-xl font-black">{voortgang.sterren || 0}</dd></div>
          <div><dt className="text-xs font-black uppercase text-[var(--helix-muted)]">Weekreeks</dt><dd className="text-xl font-black">{voortgang.dvReeks?.aantal || 0}</dd></div>
        </dl>
      </div>

      <h3 className="mt-6 text-lg font-black text-[var(--helix-navy)]">Badges ({behaald.size} van {BADGES.length})</h3>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((badge) => {
          const heeft = behaald.has(badge.id);
          const Icoon = heeft ? (ICONEN[badge.icoon] || Award) : Lock;
          return (
            <li
              key={badge.id}
              className={`flex items-start gap-3 rounded-xl border-2 p-3 ${heeft ? 'border-[#0B0D0F] bg-[#FFF0B8]' : 'border-dashed border-[var(--helix-border)] bg-white text-[var(--helix-muted)]'}`}
            >
              <Icoon size={22} className={heeft ? 'text-[#B4520E]' : ''} aria-hidden="true" />
              <div>
                <p className="font-black text-[var(--helix-navy)]">{badge.titel}</p>
                <p className="text-xs leading-4">{badge.uitleg}</p>
                <span className="sr-only">{heeft ? 'behaald' : 'nog niet behaald'}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
