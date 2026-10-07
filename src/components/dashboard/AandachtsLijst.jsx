import { ArrowRight, CircleDashed, ClipboardCheck, Clock, Star, TriangleAlert, TrendingDown } from 'lucide-react';
import { STAP_STATUS, getStatusPresentatie } from '../../lib/klasVoortgangOverzicht';
import { PLUS_KORT, PLUS_UITLEG_DOCENT } from '../../lib/paragraphMetadata';
import StudentAvatar from '../common/StudentAvatar';

const REDEN_ICOON = {
  [STAP_STATUS.VASTGELOPEN]: TriangleAlert,
  [STAP_STATUS.NAKIJKEN]: ClipboardCheck,
  nietGestart: CircleDashed,
  stil: Clock,
  achterstand: TrendingDown
};

const REDEN_RAND = {
  [STAP_STATUS.VASTGELOPEN]: 'border-l-[var(--lo-rood)]',
  [STAP_STATUS.NAKIJKEN]: 'border-l-[var(--lo-oranje-inkt)]',
  nietGestart: 'border-l-[var(--lo-lijn)]',
  stil: 'border-l-[var(--lo-blauw)]',
  achterstand: 'border-l-[var(--lo-blauw)]'
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
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--lo-groen-zacht)] text-[var(--lo-groen-inkt)]">
          <ClipboardCheck size={20} />
        </span>
        <div>
          <p className="font-extrabold text-[var(--lo-inkt)]">Niemand vraagt nu aandacht</p>
          <p className="text-sm text-[var(--lo-grijs)]">
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
          <h3 className="lo-kaart-titel">Nu aandacht nodig</h3>
          <p className="lo-kaart-uitleg">
            {items.length} van {totaalLeerlingen || items.length} leerlingen, dringendste eerst
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {zichtbaar.map((item) => {
          const hoofdreden = item.hoofdreden || {};
          // Ligt het volledig in de vrijwillige plusstof, dan blijft de regel
          // staan - een ingeleverd antwoord mag nooit blijven liggen - maar niet
          // in de kleur van een achterstand. Er valt hier niets in te halen.
          const isPlusReden = hoofdreden.optioneel === true;
          const Icoon = isPlusReden ? Star : (REDEN_ICOON[hoofdreden.type] || TriangleAlert);
          const randClass = isPlusReden
            ? 'border-l-[var(--lo-paars)]'
            : (REDEN_RAND[hoofdreden.type] || 'border-l-[var(--lo-rood)]');
          const presentatie = getStatusPresentatie(item.status);
          const openNakijk = nakijkTelling[item.studentId] || 0;

          return (
            <li key={item.studentId}>
              <button
                type="button"
                onClick={() => onSelectLeerling?.(item)}
                className={`flex w-full items-center gap-3 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] border-l-4 bg-[var(--lo-kaart)] px-4 py-3 text-left transition hover:border-[var(--lo-blauw)] ${randClass}`}
              >
                <StudentAvatar
                  student={item.student}
                  size="sm"
                  shape="circle"
                  fallback="initial"
                  fallbackClassName="bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw-inkt)]"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-[var(--lo-inkt)]">{item.studentNaam}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-extrabold ${
                        isPlusReden ? 'text-[var(--lo-paars-inkt)]' : 'text-[var(--lo-grijs)]'
                      }`}
                    >
                      <Icoon size={14} />
                      {hoofdreden.label || 'Aandacht'}
                    </span>
                    {isPlusReden && (
                      <span
                        title={PLUS_UITLEG_DOCENT}
                        className="lo-label lo-label--paars"
                      >
                        <Star size={11} />
                        {PLUS_KORT}
                      </span>
                    )}
                    {openNakijk > 0 && (
                      <span className="lo-label lo-label--oranje">
                        <ClipboardCheck size={12} />
                        {openNakijk} na te kijken
                      </span>
                    )}
                  </span>
                  <span className="truncate text-sm text-[var(--lo-grijs)]">
                    {hoofdreden.detail}
                  </span>
                  {item.redenen?.length > 1 && (
                    <span className="lo-onderregel mt-0.5">
                      Ook: {item.redenen.slice(1).map((reden) => reden.label).join(', ')}
                    </span>
                  )}
                </span>
                <span className="hidden shrink-0 flex-col items-end sm:flex">
                  <span className={`text-sm font-extrabold ${presentatie.status === STAP_STATUS.AFGEROND ? 'text-[var(--lo-groen-inkt)]' : 'text-[var(--lo-inkt)]'}`}>
                    {item.percentage}%
                  </span>
                  <span className="lo-onderregel">
                    voortgang
                  </span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-[var(--lo-grijs)]" />
              </button>
            </li>
          );
        })}
      </ul>

      {items.length > zichtbaar.length && (
        <p className="lo-onderregel mt-3 font-bold">
          Nog {items.length - zichtbaar.length} leerling{items.length - zichtbaar.length === 1 ? '' : 'en'} in de lijst.
          Open de weergave Signalen voor de volledige stand.
        </p>
      )}
    </div>
  );
}
