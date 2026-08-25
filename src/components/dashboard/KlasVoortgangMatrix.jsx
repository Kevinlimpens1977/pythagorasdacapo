import { STAP_STATUS, getStatusPresentatie } from '../../lib/klasVoortgangOverzicht';
import StudentAvatar from '../common/StudentAvatar';

const LEGENDA = [
  STAP_STATUS.AFGEROND,
  STAP_STATUS.BEZIG,
  STAP_STATUS.VASTGELOPEN,
  STAP_STATUS.NAKIJKEN,
  STAP_STATUS.NIET_GESTART
];

export function StatusLegenda({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {LEGENDA.map((status) => {
        const presentatie = getStatusPresentatie(status);
        return (
          <span key={status} className="flex items-center gap-1.5 text-xs font-bold text-[var(--helix-muted)]">
            <span className={`h-2.5 w-2.5 rounded-full ${presentatie.dotClass}`} />
            {presentatie.label}
          </span>
        );
      })}
    </div>
  );
}

export function StatusChip({ status, children, className = '', titel = '' }) {
  const presentatie = getStatusPresentatie(status);

  return (
    <span
      title={titel || presentatie.label}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black ${presentatie.chipClass} ${className}`}
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
      <div className="rounded-[var(--helix-radius-lg)] border border-dashed border-[var(--helix-border)] bg-white/70 p-6 text-sm font-semibold text-[var(--helix-muted)]">
        {leegTekst}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[var(--helix-radius-lg)] border border-[var(--helix-border)] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--helix-border)] bg-[var(--helix-surface-soft)]">
              <th className="sticky left-0 z-10 min-w-56 bg-[var(--helix-surface-soft)] px-4 py-3 text-xs font-black uppercase tracking-wider text-[var(--helix-muted)]">
                Leerling
              </th>
              <th className="px-3 py-3 text-xs font-black uppercase tracking-wider text-[var(--helix-muted)]">
                {totaalKopLabel}
              </th>
              {kolommen.map((kolom) => (
                <th
                  key={kolom.id}
                  title={kolom.titel}
                  className="px-2 py-3 text-center text-xs font-black text-[var(--helix-navy)]"
                >
                  <span className="block max-w-24 truncate">{kolom.kort}</span>
                  <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-[var(--helix-muted)]">
                    {kolomKopLabel}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--helix-border)]">
            {rijen.map((rij) => (
              <tr key={rij.studentId} className="group transition-colors hover:bg-[var(--helix-surface-soft)]/70">
                <td className="sticky left-0 z-10 bg-white px-4 py-3 group-hover:bg-[var(--helix-surface-soft)]">
                  <button
                    type="button"
                    onClick={() => onSelectLeerling?.(rij)}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <StudentAvatar
                      student={rij.student}
                      size="sm"
                      shape="circle"
                      fallback="initial"
                      fallbackClassName="bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]"
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-bold text-[var(--helix-navy)]">{rij.studentNaam}</span>
                      <span className="truncate text-[11px] font-semibold text-[var(--helix-muted)]">
                        {rij.huidigeParagraaf?.stap
                          ? `Stap ${rij.huidigeParagraaf.stap.nummer}: ${rij.huidigeParagraaf.stap.titel}`
                          : rij.statusLabel}
                      </span>
                    </span>
                    {rij.aandacht?.nodig && (
                      <span
                        title={rij.aandacht.redenen[0]?.detail || 'Aandacht nodig'}
                        className="ml-auto h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--helix-danger)]"
                      />
                    )}
                  </button>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${getStatusPresentatie(rij.status).balkClass}`}
                        style={{ width: `${rij.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-[var(--helix-navy)]">{rij.percentage}%</span>
                  </div>
                  <span className="mt-1 block text-[10px] font-semibold text-[var(--helix-muted)]">
                    {rij.afgerondeStappen}/{rij.totaalStappen} stappen
                  </span>
                </td>
                {(rij.cellen || []).map((cel) => {
                  const presentatie = getStatusPresentatie(cel.status);

                  if (!cel.toegewezen) {
                    return (
                      <td key={cel.paragraafId} className="px-2 py-3 text-center">
                        <span
                          title={cel.label}
                          className="inline-flex h-9 w-14 items-center justify-center rounded-lg border border-dashed border-[var(--helix-border)] text-[10px] font-bold text-slate-300"
                        >
                          n.v.t.
                        </span>
                      </td>
                    );
                  }

                  return (
                    <td key={cel.paragraafId} className="px-2 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectLeerling?.(rij, cel)}
                        title={`${rij.studentNaam} - ${cel.label}. ${cel.detail}`}
                        className={`inline-flex h-9 w-14 items-center justify-center rounded-lg border text-xs font-black transition hover:brightness-95 ${presentatie.chipClass}`}
                      >
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
