import { AlertTriangle, ArrowRight, Sparkles, Target } from 'lucide-react';
import { labelKlasse } from '../../lib/nulmetingProfielWeergave';

/**
 * Het persoonlijke startprofiel uit de nulmeting digitale vaardigheden.
 *
 * Eén weergave voor leerling en docent: drie domeinen, negen deelvaardigheden
 * met niveaulabel, sterke punten, ontwikkelpunten en maximaal drie adviezen.
 * Geen cijfer, geen tokens, geen leerwegadvies. De docent ziet daarnaast de
 * signalen (opvallend verschil tussen deel A en B) en de totaalscore.
 */

export default function NulmetingProfielKaart({ profiel = null, voorDocent = false, compact = false }) {
  if (!profiel) return null;
  const voorlopig = profiel.status === 'voorlopig';

  return (
    <div className="space-y-4">
      {voorlopig && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
          Voorlopig profiel: deel {profiel.ontbrekendeDelen?.join(' en ') || 'B'} is nog niet (helemaal) gemaakt.
        </p>
      )}

      {!voorDocent && profiel.leerlingTekst && (
        <p className="text-base font-semibold leading-7 text-[var(--helix-navy)]">{profiel.leerlingTekst}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {(profiel.domeinen || []).map((domein) => (
          <div key={domein.domein} className="rounded-xl border border-[var(--helix-border)] bg-white p-3">
            <p className="text-[11px] font-black uppercase tracking-wide text-[var(--helix-muted)]">{domein.domein}</p>
            <p className="mt-1 text-2xl font-black text-[var(--helix-navy)]">{domein.percentage}%</p>
          </div>
        ))}
      </div>

      <ul className={`grid gap-2 ${compact ? '' : 'md:grid-cols-3'}`}>
        {(profiel.deelvaardigheden || []).map((deel) => (
          <li key={deel.id} className="flex items-center justify-between gap-3 rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--helix-navy)]">{deel.onderdeel}</p>
              <p className="text-xs font-semibold text-[var(--helix-muted)]">
                {deel.goed} van {deel.van} goed
                {deel.gemaakt < deel.van ? ` (${deel.gemaakt} gemaakt)` : ''}
              </p>
            </div>
            <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-black ${labelKlasse(deel.label)}`}>
              {deel.label || 'Nog leeg'}
              {voorDocent && deel.inconsistent ? ' !' : ''}
            </span>
          </li>
        ))}
      </ul>

      <div className="grid gap-3 md:grid-cols-2">
        {profiel.sterkePunten?.length > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-800">
              <Sparkles size={14} aria-hidden="true" /> Sterke punten
            </p>
            <ul className="mt-2 space-y-1 text-sm font-semibold text-emerald-900">
              {profiel.sterkePunten.map((punt) => <li key={punt}>{punt}</li>)}
            </ul>
          </div>
        )}
        {profiel.adviezen?.length > 0 && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-blue-800">
              <Target size={14} aria-hidden="true" /> Hier ga je mee verder
            </p>
            <ul className="mt-2 space-y-2 text-sm text-blue-950">
              {profiel.adviezen.map((advies) => (
                <li key={advies.deelvaardigheidId} className="flex gap-2">
                  <ArrowRight size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span><span className="font-bold">{advies.onderdeel}:</span> {advies.advies}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {voorDocent && (
        <div className="space-y-2 text-xs font-semibold text-[var(--helix-muted)]">
          <p>
            Totaal (ondergeschikt): {profiel.totaal?.goed ?? 0} van {profiel.totaal?.van ?? 0} goed ({profiel.totaal?.percentage ?? 0}%)
            {profiel.afgenomenOp ? ` - laatste antwoord ${profiel.afgenomenOp}` : ''}
          </p>
          {profiel.docentSignalen?.length > 0 && (
            <ul className="space-y-1">
              {profiel.docentSignalen.map((signaal) => (
                <li key={signaal.deelvaardigheidId} className="inline-flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-2 py-1 text-orange-800">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{signaal.tekst}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
