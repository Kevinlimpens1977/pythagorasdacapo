import { useEffect, useState } from 'react';
import { Check, Loader2, Star } from 'lucide-react';
import HelixCompanion from './HelixCompanion';
import { COMPANION_KLEUREN, COMPANION_SOORTEN, companionStadium, normaliseerCompanion } from '../../lib/companion';
import { subscribeLeerlingVoortgang, subscribeStudentTokenLoadout } from '../../services/tokenService';
import { updateCompanion } from '../../services/fase5Service';
import { Kaart } from '../leeromgeving';

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
    <Kaart>
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-32 w-32 shrink-0 rounded-[var(--lo-hoek-xl)] bg-[var(--lo-papier)]">
          <HelixCompanion companion={huidig} stadium={stand.stadium} className="h-full w-full" titel="Jouw maatje" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="lo-kaart-titel">Je maatje</h2>
          <p className="text-sm font-bold">{stand.titel} <span className="text-[var(--lo-grijs)]">(stadium {stand.stadium} van 5)</span></p>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--lo-grijs)]">
            <Star size={14} aria-hidden="true" />
            {stand.nogSterren > 0
              ? `Nog ${stand.nogSterren} ${stand.nogSterren === 1 ? 'ster' : 'sterren'} tot ${stand.volgendeTitel.toLowerCase()}. Een ster haal je met een blok helemaal goed.`
              : 'Helemaal volgroeid. Knap!'}
          </p>
          <p className="mt-1 text-xs text-[var(--lo-grijs)]">Je maatje groeit alleen. Het gaat nooit achteruit, ook niet als je een week niets doet.</p>
        </div>
      </div>

      <div className="lo-keuzes items-center">
        {COMPANION_SOORTEN.map((soort) => (
          <button
            key={soort.id}
            type="button"
            onClick={() => setConcept({ ...huidig, soort: soort.id })}
            aria-pressed={huidig.soort === soort.id}
            className="lo-keuze"
          >
            {soort.titel}
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-[var(--lo-lijn)]" aria-hidden="true" />
        {COMPANION_KLEUREN.map((kleur) => (
          <button
            key={kleur.id}
            type="button"
            onClick={() => setConcept({ ...huidig, kleur: kleur.id })}
            aria-label={`Kleur ${kleur.id.replace('comp-', '')}`}
            aria-pressed={huidig.kleur === kleur.id}
            className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--lo-lijn)] ${huidig.kleur === kleur.id ? 'ring-4 ring-[var(--lo-inkt)]' : ''}`}
            style={{ background: kleur.kleur }}
          >
            {huidig.kleur === kleur.id && <Check size={14} strokeWidth={3} className="text-white" aria-hidden="true" />}
          </button>
        ))}
        {gewijzigd && (
          <button type="button" onClick={bewaar} disabled={bezig} className="lo-knop ml-auto">
            {bezig && <Loader2 size={15} className="animate-spin" />}
            {opgeslagen.soort ? 'Opslaan' : 'Dit wordt mijn maatje'}
          </button>
        )}
      </div>
      {fout && <p className="lo-melding lo-melding--fout">{fout}</p>}
    </Kaart>
  );
}
