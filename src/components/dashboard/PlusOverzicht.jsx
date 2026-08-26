import { ArrowRight, Star } from 'lucide-react';
import { PLUS_PRESENTATIE } from '../../lib/klasVoortgangOverzicht';
import StudentAvatar from '../common/StudentAvatar';

/**
 * Wie deed er vrijwillig meer dan het moest?
 *
 * Dit paneel staat bewust LOS van de voortgangsmatrix. Alles in die matrix
 * leest als "hoever ben je"; vrijwillig werk hoort daar niet in, want dan wordt
 * een leeg vakje een gemis. Hier staat alleen wat er extra gedaan is, met de
 * naam van de plusparagraaf erbij, voor de docent die wil weten wie er meer
 * aankan. Wie niets deed staat onderaan als neutrale opsomming, zonder kleur en
 * zonder waarschuwing.
 */
export default function PlusOverzicht({
  overzicht = null,
  onSelectLeerling,
  maxItems = 8,
  hoofdstukTitel = ''
}) {
  if (!overzicht?.aangeboden) return null;

  const { metPlus = [], zonderPlus = [], aantalParagrafen = 0, aantalLeerlingen = 0 } = overzicht;
  const zichtbaar = metPlus.slice(0, maxItems);

  return (
    <section className="helix-card p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--helix-purple)]">
            <Star size={18} />
            Vrijwillig extra gedaan
          </h3>
          <p className="text-sm font-semibold text-[var(--helix-muted)]">
            {aantalParagrafen} plusparagra{aantalParagrafen === 1 ? 'af' : 'fen'}
            {hoofdstukTitel ? ` in ${hoofdstukTitel}` : ''} · {metPlus.length} van {aantalLeerlingen} leerlingen
            begon eraan
          </p>
        </div>
      </div>

      <p className="mb-4 rounded-[var(--helix-radius-md)] border border-[rgba(122,60,255,0.3)] bg-[var(--helix-soft-lavender)]/60 px-3 py-2 text-xs font-bold text-[var(--helix-navy)]">
        {PLUS_PRESENTATIE.uitleg} Deze lijst staat los van de voortgang hierboven: hij telt alleen
        wat er bovenop de verplichte stof gedaan is.
      </p>

      {zichtbaar.length === 0 ? (
        <p className="rounded-[var(--helix-radius-md)] border border-dashed border-[var(--helix-border)] bg-white/70 px-3 py-3 text-sm font-semibold text-[var(--helix-muted)]">
          Nog niemand is aan de plusstof begonnen. Dat is geen achterstand — het is vrijwillig werk.
        </p>
      ) : (
        <ul className="space-y-2">
          {zichtbaar.map((leerling) => (
            <li key={leerling.studentId}>
              <button
                type="button"
                onClick={() => onSelectLeerling?.(leerling)}
                className="flex w-full items-center gap-3 rounded-[var(--helix-radius-md)] border border-[var(--helix-border)] border-l-4 border-l-[var(--helix-purple)] bg-white px-4 py-3 text-left transition hover:border-[var(--helix-purple)]"
              >
                <StudentAvatar
                  student={leerling.student}
                  size="sm"
                  shape="circle"
                  fallback="initial"
                  fallbackClassName="bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-[var(--helix-navy)]">{leerling.studentNaam}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[var(--helix-purple)]">
                      <Star size={11} />
                      {leerling.aantalAf} van {leerling.totaalParagrafen} af
                    </span>
                    {leerling.aantalBezig > 0 && (
                      <span className="text-[11px] font-bold text-[var(--helix-muted)]">
                        {leerling.aantalBezig} mee bezig
                      </span>
                    )}
                  </span>
                  {/* Wélke plusparagrafen: zonder de namen weet een docent nog
                      niet waar deze leerling meer aankan. */}
                  <span className="mt-1 flex flex-wrap gap-1.5">
                    {leerling.afgerondeParagrafen.map((paragraaf) => (
                      <span
                        key={paragraaf.paragraafId}
                        title={paragraaf.paragraafLabel}
                        className="max-w-64 truncate rounded-full bg-[var(--helix-surface-soft)] px-2 py-0.5 text-[11px] font-bold text-[var(--helix-navy)]"
                      >
                        {paragraaf.paragraafLabel}
                      </span>
                    ))}
                    {leerling.bezigeParagrafen.map((paragraaf) => (
                      <span
                        key={paragraaf.paragraafId}
                        title={`${paragraaf.paragraafLabel} - ${paragraaf.afgerondeStappen} van ${paragraaf.totaalStappen} stappen`}
                        className="max-w-64 truncate rounded-full border border-dashed border-[var(--helix-border)] px-2 py-0.5 text-[11px] font-semibold text-[var(--helix-muted)]"
                      >
                        {paragraaf.paragraafLabel} ({paragraaf.afgerondeStappen}/{paragraaf.totaalStappen})
                      </span>
                    ))}
                  </span>
                </span>
                <span className="hidden shrink-0 flex-col items-end sm:flex">
                  <span className="text-sm font-black text-[var(--helix-navy)]">{leerling.verplichtPercentage}%</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--helix-muted)]">
                    verplichte stof
                  </span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-[var(--helix-muted)]" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {metPlus.length > zichtbaar.length && (
        <p className="mt-3 text-xs font-bold text-[var(--helix-muted)]">
          Nog {metPlus.length - zichtbaar.length} leerling{metPlus.length - zichtbaar.length === 1 ? '' : 'en'} deed
          ook plusstof.
        </p>
      )}

      {zonderPlus.length > 0 && (
        <p className="mt-3 text-xs font-semibold text-[var(--helix-muted)]">
          {zonderPlus.length} leerling{zonderPlus.length === 1 ? '' : 'en'} deed nog geen plusstof. Dat is
          geen achterstand: {zonderPlus.map((leerling) => leerling.studentNaam).join(', ')}.
        </p>
      )}
    </section>
  );
}
