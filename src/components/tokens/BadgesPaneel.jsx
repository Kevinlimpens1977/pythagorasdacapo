import { useEffect, useState } from 'react';
import { Award, Crown, Flame, Home, Lock, RotateCcw, Sparkles, Star, Target, Trophy } from 'lucide-react';
import { BADGES, niveauVoorXp } from '../../lib/beloning';
import { subscribeLeerlingVoortgang } from '../../services/tokenService';
import { Kaart } from '../leeromgeving';

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
    <Kaart>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="lo-eyebrow">Mijn voortgang</p>
          <h2 className="mt-1 text-2xl font-extrabold text-[var(--lo-inkt)]">Niveau {niveau}</h2>
          <div className="mt-2 flex items-center gap-2 text-sm font-bold text-[var(--lo-grijs)]">
            <span className="lo-voortgang w-40" aria-hidden="true">
              <i className="bg-[var(--lo-blauw)]" style={{ width: `${procent}%` }} />
            </span>
            {xpNodig > 0 ? `nog ${xpNodig - xpInNiveau} XP tot niveau ${niveau + 1}` : 'hoogste niveau'}
          </div>
        </div>
        <dl className="flex gap-5 text-center">
          <div><dt className="lo-onderregel">XP</dt><dd className="text-xl font-extrabold">{voortgang.xp || 0}</dd></div>
          <div><dt className="lo-onderregel">Sterren</dt><dd className="text-xl font-extrabold">{voortgang.sterren || 0}</dd></div>
          <div><dt className="lo-onderregel">Weekreeks</dt><dd className="text-xl font-extrabold">{voortgang.dvReeks?.aantal || 0}</dd></div>
        </dl>
      </div>

      <h3 className="lo-kaart-titel mt-2">Badges ({behaald.size} van {BADGES.length})</h3>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {BADGES.map((badge) => {
          const heeft = behaald.has(badge.id);
          const Icoon = heeft ? (ICONEN[badge.icoon] || Award) : Lock;
          return (
            <li
              key={badge.id}
              className={`flex items-start gap-3 rounded-[var(--lo-hoek-m)] border p-3 ${heeft ? 'border-[var(--lo-geel)] bg-[var(--lo-geel-zacht)]' : 'border-dashed border-[var(--lo-lijn)] bg-[var(--lo-kaart)] text-[var(--lo-grijs)]'}`}
            >
              <Icoon size={22} className={heeft ? 'text-[var(--lo-oranje-inkt)]' : ''} aria-hidden="true" />
              <div>
                <p className="font-extrabold text-[var(--lo-inkt)]">{badge.titel}</p>
                <p className="lo-onderregel">{badge.uitleg}</p>
                <span className="sr-only">{heeft ? 'behaald' : 'nog niet behaald'}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Kaart>
  );
}
