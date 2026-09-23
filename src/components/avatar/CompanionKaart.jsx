import { useEffect, useState } from 'react';
import { Check, Loader2, Star } from 'lucide-react';
import HelixCompanion from './HelixCompanion';
import { COMPANION_KLEUREN, COMPANION_SOORTEN, companionStadium, normaliseerCompanion } from '../../lib/companion';
import { subscribeLeerlingVoortgang, subscribeStudentTokenLoadout } from '../../services/tokenService';
import { updateCompanion } from '../../services/fase5Service';

// De companion op het profiel (fase 5): kiezen, en zien hoe ver hij is. Hij
// groeit met sterren; wisselen van soort of kleur kost niets en kost geen groei.
export default function CompanionKaart({ studentUid, disabled = false }) {
  const [opgeslagen, setOpgeslagen] = useState(null);
  const [sterren, setSterren] = useState(0);
  const [concept, setConcept] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState('');

  useEffect(() => {
    if (!studentUid || disabled) return undefined;
    const stoppen = [
      subscribeStudentTokenLoadout(studentUid, (loadout) => setOpgeslagen(normaliseerCompanion(loadout.companion)), () => {}),
      subscribeLeerlingVoortgang(studentUid, (voortgang) => setSterren(Number(voortgang.sterren) || 0), () => {})
    ];
    return () => stoppen.forEach((stop) => stop?.());
  }, [disabled, studentUid]);

  if (!opgeslagen) return null;
  const huidig = concept || (opgeslagen.soort ? opgeslagen : { ...opgeslagen, soort: 'robot' });
  const stand = companionStadium(sterren);
  const gewijzigd = !opgeslagen.soort || (concept && (concept.soort !== opgeslagen.soort || concept.kleur !== opgeslagen.kleur));

  const bewaar = async () => {
    setBezig(true);
    try {
      await updateCompanion(huidig);
      setConcept(null);
      setFout('');
    } catch (error) {
      setFout(error?.message || 'Opslaan is mislukt.');
    } finally {
      setBezig(false);
    }
  };

  return (
    <section className="helix-card p-5">
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-32 w-32 shrink-0 rounded-2xl border-2 border-[#0B0D0F] bg-[#FFF7E8]">
          <HelixCompanion companion={huidig} stadium={stand.stadium} className="h-full w-full" titel="Jouw maatje" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-[var(--helix-navy)]">Je maatje</h2>
          <p className="text-sm font-bold">{stand.titel} <span className="text-[var(--helix-muted)]">(stadium {stand.stadium} van 5)</span></p>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--helix-muted)]">
            <Star size={14} aria-hidden="true" />
            {stand.nogSterren > 0
              ? `Nog ${stand.nogSterren} ${stand.nogSterren === 1 ? 'ster' : 'sterren'} tot ${stand.volgendeTitel.toLowerCase()}. Een ster haal je met een blok helemaal goed.`
              : 'Helemaal volgroeid. Knap!'}
          </p>
          <p className="mt-1 text-xs text-[var(--helix-muted)]">Je maatje groeit alleen. Het gaat nooit achteruit, ook niet als je een week niets doet.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {COMPANION_SOORTEN.map((soort) => (
          <button
            key={soort.id}
            type="button"
            onClick={() => setConcept({ ...huidig, soort: soort.id })}
            aria-pressed={huidig.soort === soort.id}
            className={`rounded-lg border-2 px-3 py-1.5 text-sm font-extrabold ${huidig.soort === soort.id ? 'border-[#087EB5] bg-[#DCEFFA]' : 'border-[#0B0D0F] bg-white'}`}
          >
            {soort.titel}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-[var(--helix-border)]" aria-hidden="true" />
        {COMPANION_KLEUREN.map((kleur) => (
          <button
            key={kleur.id}
            type="button"
            onClick={() => setConcept({ ...huidig, kleur: kleur.id })}
            aria-label={`Kleur ${kleur.id.replace('comp-', '')}`}
            aria-pressed={huidig.kleur === kleur.id}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B0D0F] ${huidig.kleur === kleur.id ? 'ring-4 ring-[#087EB5]/40' : ''}`}
            style={{ background: kleur.kleur }}
          >
            {huidig.kleur === kleur.id && <Check size={14} strokeWidth={3} className="text-white" aria-hidden="true" />}
          </button>
        ))}
        {gewijzigd && (
          <button type="button" onClick={bewaar} disabled={bezig} className="helix-btn-solid ml-auto flex items-center gap-1.5">
            {bezig && <Loader2 size={15} className="animate-spin" />}
            {opgeslagen.soort ? 'Opslaan' : 'Dit wordt mijn maatje'}
          </button>
        )}
      </div>
      {fout && <p className="mt-2 text-sm font-bold text-[var(--color-red-ink)]">{fout}</p>}
    </section>
  );
}
