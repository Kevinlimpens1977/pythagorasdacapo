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
          <h3 className="lo-kaart-titel text-[var(--lo-paars-inkt)]">
            <Star size={18} />
            Vrijwillig extra gedaan
          </h3>
          <p className="lo-kaart-uitleg">
            {aantalParagrafen} plusparagra{aantalParagrafen === 1 ? 'af' : 'fen'}
            {hoofdstukTitel ? ` in ${hoofdstukTitel}` : ''} · {metPlus.length} van {aantalLeerlingen} leerlingen
            begon eraan
          </p>
        </div>
      </div>

      <p className="lo-melding mb-4 bg-[var(--lo-paars-zacht)] text-[var(--lo-paars-inkt)]">
        {PLUS_PRESENTATIE.uitleg} Deze lijst staat los van de voortgang hierboven: hij telt alleen
        wat er bovenop de verplichte stof gedaan is.
      </p>

      {zichtbaar.length === 0 ? (
        <p className="lo-melding lo-melding--info">
          Nog niemand is aan de plusstof begonnen. Dat is geen achterstand — het is vrijwillig werk.
        </p>
      ) : (
        <ul className="space-y-2">
          {zichtbaar.map((leerling) => (
            <li key={leerling.studentId}>
              <button
                type="button"
                onClick={() => onSelectLeerling?.(leerling)}
                className="flex w-full items-center gap-3 rounded-[var(--lo-hoek-m)] border border-[var(--lo-lijn)] border-l-4 border-l-[var(--lo-paars)] bg-[var(--lo-kaart)] px-4 py-3 text-left transition hover:border-[var(--lo-paars)]"
              >
                <StudentAvatar
                  student={leerling.student}
                  size="sm"
                  shape="circle"
                  fallback="initial"
                  fallbackClassName="bg-[var(--lo-paars-zacht)] text-[var(--lo-paars-inkt)]"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-[var(--lo-inkt)]">{leerling.studentNaam}</span>
                    <span className="lo-label lo-label--paars">
                      <Star size={11} />
                      {leerling.aantalAf} van {leerling.totaalParagrafen} af
                    </span>
                    {leerling.aantalBezig > 0 && (
                      <span className="lo-onderregel font-bold">
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
                        className="max-w-64 truncate rounded-full bg-[var(--lo-papier-2)] px-2 py-0.5 text-[11px] font-bold text-[var(--lo-inkt)]"
                      >
                        {paragraaf.paragraafLabel}
                      </span>
                    ))}
                    {leerling.bezigeParagrafen.map((paragraaf) => (
                      <span
                        key={paragraaf.paragraafId}
                        title={`${paragraaf.paragraafLabel} - ${paragraaf.afgerondeStappen} van ${paragraaf.totaalStappen} stappen`}
                        className="max-w-64 truncate rounded-full border border-dashed border-[var(--lo-lijn)] px-2 py-0.5 text-[11px] font-semibold text-[var(--lo-grijs)]"
                      >
                        {paragraaf.paragraafLabel} ({paragraaf.afgerondeStappen}/{paragraaf.totaalStappen})
                      </span>
                    ))}
                  </span>
                </span>
                <span className="hidden shrink-0 flex-col items-end sm:flex">
                  <span className="text-sm font-extrabold text-[var(--lo-inkt)]">{leerling.verplichtPercentage}%</span>
                  <span className="lo-onderregel">
                    verplichte stof
                  </span>
                </span>
                <ArrowRight size={18} className="shrink-0 text-[var(--lo-grijs)]" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {metPlus.length > zichtbaar.length && (
        <p className="lo-onderregel mt-3 font-bold">
          Nog {metPlus.length - zichtbaar.length} leerling{metPlus.length - zichtbaar.length === 1 ? '' : 'en'} deed
          ook plusstof.
        </p>
      )}

      {zonderPlus.length > 0 && (
        <p className="lo-onderregel mt-3">
          {zonderPlus.length} leerling{zonderPlus.length === 1 ? '' : 'en'} deed nog geen plusstof. Dat is
          geen achterstand: {zonderPlus.map((leerling) => leerling.studentNaam).join(', ')}.
        </p>
      )}
    </section>
  );
}
