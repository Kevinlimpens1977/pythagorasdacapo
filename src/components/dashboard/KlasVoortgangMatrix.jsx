import { Star } from 'lucide-react';
import { PLUS_PRESENTATIE, STAP_STATUS, getStatusPresentatie } from '../../lib/klasVoortgangOverzicht';
import StudentAvatar from '../common/StudentAvatar';

const LEGENDA = [
  STAP_STATUS.AFGEROND,
  STAP_STATUS.BEZIG,
  STAP_STATUS.VASTGELOPEN,
  STAP_STATUS.NAKIJKEN,
  STAP_STATUS.NIET_GESTART
];

export function StatusLegenda({ className = '', toonPlus = false }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {LEGENDA.map((status) => {
        const presentatie = getStatusPresentatie(status);
        return (
          <span key={status} className="flex items-center gap-1.5 text-xs font-bold text-[var(--lo-grijs)]">
            <span className={`h-2.5 w-2.5 rounded-full ${presentatie.dotClass}`} />
            {presentatie.label}
          </span>
        );
      })}
      {toonPlus && (
        <span
          title={PLUS_PRESENTATIE.uitleg}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--lo-paars-inkt)]"
        >
          <Star size={12} />
          {PLUS_PRESENTATIE.label} - telt niet mee
        </span>
      )}
    </div>
  );
}

/** Het merkteken van een vrijwillige plusparagraaf, overal hetzelfde. */
export function PlusChip({ children, className = '', titel = '' }) {
  return (
    <span
      title={titel || PLUS_PRESENTATIE.uitleg}
      className={`${PLUS_PRESENTATIE.chipClass} ${className}`}
    >
      <Star size={11} />
      {children || PLUS_PRESENTATIE.kort}
    </span>
  );
}

export function StatusChip({ status, children, className = '', titel = '' }) {
  const presentatie = getStatusPresentatie(status);

  return (
    <span
      title={titel || presentatie.label}
      className={`${presentatie.chipClass} ${className}`}
    >
      <span className={`h-2 w-2 rounded-full ${presentatie.dotClass}`} />
      {children || presentatie.label}
    </span>
  );
}

/**
 * Rijen zijn leerlingen, kolommen zijn paragrafen (of stappen binnen één
 * paragraaf). Elk vakje is een knop: doorklikken naar de leerling is de
 * hoofdbeweging van dit scherm.
 */
export default function KlasVoortgangMatrix({
  rijen = [],
  kolommen = [],
  onSelectLeerling,
  kolomKopLabel = 'Paragraaf',
  totaalKopLabel = 'In beeld',
  leegTekst = 'Er zijn nog geen leerlingen om te tonen.'
}) {
  if (!rijen.length) {
    return (
      <div className="lo-melding lo-melding--info">
        {leegTekst}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] bg-[var(--lo-kaart)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--lo-lijn)] bg-[var(--lo-papier)]">
              <th className="sticky left-0 z-10 w-56 min-w-56 bg-[var(--lo-papier)] px-4 py-3 text-[13px] font-extrabold text-[var(--lo-grijs)]">
                Leerling
              </th>
              <th className="px-3 py-3 text-[13px] font-extrabold text-[var(--lo-grijs)]">
                {totaalKopLabel}
              </th>
              {kolommen.map((kolom) => (
                <th
                  key={kolom.id}
                  title={kolom.titel}
                  className={`px-1 py-3 text-center text-xs font-extrabold ${
                    kolom.optioneel ? 'text-[var(--lo-paars-inkt)]' : 'text-[var(--lo-inkt)]'
                  }`}
                >
                  <span className="block max-w-24 truncate">{kolom.kort}</span>
                  {/* De kop zegt meteen dat deze kolom vrijwillig is, zodat een
                      lege kolom niet als klassikale achterstand leest. */}
                  <span className={`mt-0.5 block text-[11px] font-semibold ${
                    kolom.optioneel ? 'text-[var(--lo-paars-inkt)]' : 'text-[var(--lo-grijs)]'
                  }`}>
                    {kolom.optioneel ? PLUS_PRESENTATIE.kort : kolomKopLabel}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--lo-lijn)]">
            {rijen.map((rij) => (
              <tr key={rij.studentId} className="group transition-colors hover:bg-[var(--lo-papier)]">
                <td className="sticky left-0 z-10 w-56 min-w-56 max-w-56 bg-[var(--lo-kaart)] px-4 py-3 group-hover:bg-[var(--lo-papier)]">
                  <button
                    type="button"
                    onClick={() => onSelectLeerling?.(rij)}
                    className="flex w-full max-w-48 items-center gap-3 text-left"
                  >
                    <StudentAvatar
                      student={rij.student}
                      size="sm"
                      shape="circle"
                      fallback="initial"
                      fallbackClassName="bg-[var(--lo-blauw-zacht)] text-[var(--lo-blauw-inkt)]"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-bold text-[var(--lo-inkt)]">{rij.studentNaam}</span>
                      <span className="lo-onderregel truncate">
                        {rij.huidigeParagraaf?.stap
                          ? `Stap ${rij.huidigeParagraaf.stap.nummer}: ${rij.huidigeParagraaf.stap.titel}`
                          : rij.statusLabel}
                      </span>
                    </span>
                    {rij.aandacht?.nodig && (
                      <span
                        title={rij.aandacht.redenen[0]?.detail || 'Aandacht nodig'}
                        className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--lo-rood)]"
                      />
                    )}
                  </button>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-12 overflow-hidden rounded-full bg-[var(--lo-papier-2)]">
                      <div
                        className={`h-full rounded-full ${getStatusPresentatie(rij.status).balkClass}`}
                        style={{ width: `${rij.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-extrabold text-[var(--lo-inkt)]">{rij.percentage}%</span>
                  </div>
                  <span className="lo-onderregel mt-1">
                    {rij.afgerondeStappen}/{rij.totaalStappen} stappen
                  </span>
                  {/* Vrijwillig extra werk staat NAAST de balk, niet erin: het
                      verandert niets aan wat deze leerling af moet hebben. */}
                  {rij.plus?.afgerondeParagrafen > 0 && (
                    <span className="mt-1 block">
                      <PlusChip titel={`${rij.studentNaam} maakte ${rij.plus.afgerondeParagrafen} van ${rij.plus.totaalParagrafen} plusparagrafen vrijwillig af`}>
                        +{rij.plus.afgerondeParagrafen} af
                      </PlusChip>
                    </span>
                  )}
                </td>
                {(rij.cellen || []).map((cel) => {
                  const presentatie = getStatusPresentatie(cel.status);
                  // Een plusparagraaf waar nog niets aan gedaan is krijgt een
                  // eigen, rustige weergave. De vijf statuskleuren zeggen
                  // allemaal iets over voortgang, en dit vakje meet dat niet.
                  const plusNogNiet = cel.optioneel && cel.status === STAP_STATUS.NIET_GESTART;

                  if (!cel.toegewezen) {
                    return (
                      <td key={cel.paragraafId} className="px-1 py-3 text-center">
                        <span
                          title={cel.label}
                          className="inline-flex h-9 w-12 items-center justify-center rounded-[var(--lo-hoek-s)] border border-dashed border-[var(--lo-lijn)] text-[11px] font-bold text-[var(--lo-grijs)]"
                        >
                          n.v.t.
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={cel.paragraafId} className="px-1 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectLeerling?.(rij, cel)}
                        title={`${rij.studentNaam} - ${cel.label}. ${cel.detail}`}
                        className={`h-9 w-12 cursor-pointer justify-center gap-1 rounded-[var(--lo-hoek-s)] transition hover:brightness-95 ${
                          plusNogNiet ? PLUS_PRESENTATIE.leegClass : presentatie.chipClass
                        }`}
                      >
                        {cel.optioneel && <Star size={11} />}
                        {cel.kort}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
