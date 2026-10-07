import { ArrowRight, CircleCheck, Flame, TrendingUp } from 'lucide-react';
import { GOED_BEZIG_REDEN } from '../../lib/klasVoortgangOverzicht';
import StudentAvatar from '../common/StudentAvatar';

const REDEN = {
  [GOED_BEZIG_REDEN.AF]: { icoon: CircleCheck, tekst: 'Hoofdstuk af' },
  [GOED_BEZIG_REDEN.BIJNA]: { icoon: TrendingUp, tekst: 'Bijna klaar' },
  [GOED_BEZIG_REDEN.ACTIEF]: { icoon: Flame, tekst: 'Werkt goed door' }
};

/**
 * De positieve kant naast "Nu aandacht nodig" (Kevin, 7 okt 2026): wie het
 * hoofdstuk af heeft, bijna klaar is of de afgelopen dagen goed doorwerkt.
 * Volgorde komt uit `buildGoedBezigLijst`.
 */
export default function GoedBezigLijst({ items = [], onSelectLeerling, maxItems = 5 }) {
  if (!items.length) return null;
  const zichtbaar = items.slice(0, maxItems);

  return (
    <div className="helix-card p-5">
      <div className="mb-4">
        <h3 className="lo-kaart-titel">Goed bezig</h3>
        <p className="lo-kaart-uitleg">{items.length} {items.length === 1 ? 'leerling' : 'leerlingen'} om een compliment te geven</p>
      </div>
      <ul className="space-y-2">
        {zichtbaar.map((item) => {
          const reden = REDEN[item.reden] || REDEN[GOED_BEZIG_REDEN.ACTIEF];
          const Icoon = reden.icoon;
          return (
            <li key={item.studentId}>
              <button
                type="button"
                onClick={() => onSelectLeerling?.(item)}
                className="flex w-full items-center gap-3 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] border-l-4 border-l-[var(--lo-groen)] bg-[var(--lo-kaart)] px-4 py-3 text-left transition hover:border-[var(--lo-blauw)]"
              >
                <StudentAvatar
                  student={item.student}
                  size="sm"
                  shape="circle"
                  fallback="initial"
                  fallbackClassName="bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-extrabold text-[var(--lo-inkt)]">{item.studentNaam}</span>
                  <span className="flex items-center gap-1 text-[13px] font-bold text-[var(--lo-groen-inkt)]">
                    <Icoon size={14} aria-hidden="true" />
                    {reden.tekst}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block text-sm font-extrabold tabular-nums text-[var(--lo-inkt)]">{item.percentage}%</span>
                  <span className="block text-[12px] text-[var(--lo-grijs)]">voortgang</span>
                </span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-[var(--lo-grijs)]" />
              </button>
            </li>
          );
        })}
      </ul>
      {items.length > zichtbaar.length && (
        <p className="lo-onderregel mt-3 font-bold">Nog {items.length - zichtbaar.length} leerlingen gaan goed.</p>
      )}
    </div>
  );
}
