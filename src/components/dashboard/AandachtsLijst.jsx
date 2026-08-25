import { ArrowRight, CircleDashed, ClipboardCheck, Clock, TriangleAlert, TrendingDown } from 'lucide-react';
import { STAP_STATUS, getStatusPresentatie } from '../../lib/klasVoortgangOverzicht';
import StudentAvatar from '../common/StudentAvatar';

const REDEN_ICOON = {
  [STAP_STATUS.VASTGELOPEN]: TriangleAlert,
  [STAP_STATUS.NAKIJKEN]: ClipboardCheck,
  nietGestart: CircleDashed,
  stil: Clock,
  achterstand: TrendingDown
};

const REDEN_RAND = {
  [STAP_STATUS.VASTGELOPEN]: 'border-l-[var(--helix-danger)]',
  [STAP_STATUS.NAKIJKEN]: 'border-l-[var(--helix-warning)]',
  nietGestart: 'border-l-slate-300',
  stil: 'border-l-[var(--helix-purple)]',
  achterstand: 'border-l-[var(--helix-purple)]'
};

/**
 * De korte lijst waar de docent mee begint: wie heeft nu hulp nodig, en waarom.
 * Volgorde komt uit `buildAandachtsLijst`: vastgelopen boven nakijken, boven
 * niet begonnen, boven stilte en achterstand.
 */
export default function AandachtsLijst({
  items = [],
  onSelectLeerling,
  maxItems = 6,
  totaalLeerlingen = 0,
  nakijkTelling = {}
}) {
  if (!items.length) {
    return (
      <div className="helix-card flex items-center gap-3 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <ClipboardCheck size={20} />
        </span>
        <div>
          <p className="font-black text-[var(--helix-navy)]">Niemand vraagt nu aandacht</p>
          <p className="text-sm font-semibold text-[var(--helix-muted)]">
            {totaalLeerlingen > 0
              ? `Alle ${totaalLeerlingen} leerlingen werken door zonder blokkade.`
              : 'Er zijn nog geen leerlingen in beeld.'}
          </p>
        </div>
      </div>
    );
  }

  const zichtbaar = items.slice(0, maxItems);

  return (
    <div className="helix-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-extrabold text-[var(--helix-navy)]">Nu aandacht nodig</h3>
          <p className="text-sm font-semibold text-[var(--helix-muted)]">
            {items.length} van {totaalLeerlingen || items.length} leerlingen, dringendste eerst
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {zichtbaar.map((item) => {
          const hoofdreden = item.hoofdreden || {};
          const Icoon = REDEN_ICOON[hoofdreden.type] || TriangleAlert;
          const randClass = REDEN_RAND[hoofdreden.type] || 'border-l-[var(--helix-danger)]';
          const presentatie = getStatusPresentatie(item.status);
          const openNakijk = nakijkTelling[item.studentId] || 0;

          return (
            <li key={item.studentId}>
              <button
                type="button"
                onClick={() => onSelectLeerling?.(item)}
                className={`flex w-full items-center gap-3 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] border-l-4 bg-white px-4 py-3 text-left transition hover:border-[var(--helix-purple)] ${randClass}`}
              >
                <StudentAvatar
                  student={item.student}
                  size="sm"
                  shape="circle"
                  fallback="initial"
                  fallbackClassName="bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-[var(--helix-navy)]">{item.studentNaam}</span>
                    <span className="inline-flex items-center gap-1 text-xs font-black text-[var(--helix-muted)]">
                      <Icoon size={14} />
                      {hoofdreden.label || 'Aandacht'}
                    </span>
                    {openNakijk > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--helix-warning)] bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-800">
                        <ClipboardCheck size={12} />
                        {openNakijk} na te kijken
                      </span>
                    )}
                  </span>
                  <span className="truncate text-sm font-semibold text-[var(--helix-muted)]">
                    {hoofdreden.detail}
                  </span>
                  {item.redenen?.length > 1 && (
                    <span className="mt-0.5 text-[11px] font-semibold text-[var(--helix-muted)]">
                      Ook: {item.redenen.slice(1).map((reden) => reden.label).join(', ')}
                    </span>
                  )}
                </span>
                <span className="hidden shrink-0 flex-col items-end sm:flex">
                  <span className={`text-sm font-black ${presentatie.status === STAP_STATUS.AFGEROND ? 'text-emerald-700' : 'text-[var(--helix-navy)]'}`}>
                    {item.percentage}%
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--helix-muted)]">
                    voortgang
                  </span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-[var(--helix-muted)]" />
              </button>
            </li>
          );
        })}
      </ul>

      {items.length > zichtbaar.length && (
        <p className="mt-3 text-xs font-bold text-[var(--helix-muted)]">
          Nog {items.length - zichtbaar.length} leerling{items.length - zichtbaar.length === 1 ? '' : 'en'} in de lijst.
          Open de weergave Signalen voor de volledige stand.
        </p>
      )}
    </div>
  );
}
