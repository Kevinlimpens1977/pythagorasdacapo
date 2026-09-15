import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Loader2 } from 'lucide-react';
import { beschikbareTalen, bronVingerafdruk, taalLabel } from '../../lib/lesTaal';
import { bewaarDocentVertaling, haalOpgeslagenVertaling } from '../../services/lesTaalService';

/**
 * Bron en vertaling naast elkaar, zodat de docent een machinevertaling kan
 * bijsturen. Wat hier opgeslagen wordt, overschrijft de machine daarna niet
 * meer; bij een gewijzigde Nederlandse tekst komt er een seintje.
 */
export default function VertalingPaneel({ blok }) {
  const [taal, setTaal] = useState(beschikbareTalen()[0].code);
  const [vertaling, setVertaling] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [bewaard, setBewaard] = useState(false);

  useEffect(() => {
    let gestopt = false;
    haalOpgeslagenVertaling(blok.id, taal).then((gevonden) => {
      if (gestopt) return;
      setVertaling(gevonden);
      setBewaard(false);
    });
    return () => { gestopt = true; };
  }, [blok.id, taal]);

  // Geen setState vooraf om de vorige vertaling weg te halen (dat mag niet
  // synchroon in een effect): het opgehaalde document draagt zijn eigen
  // blockId__taal-sleutel, dus een vertaling die niet bij de huidige keuze
  // hoort telt hier gewoon als "nog niet geladen".
  const huidigeSleutel = `${blok.id}__${taal}`;
  const weergave = vertaling && vertaling.id === huidigeSleutel ? vertaling : null;

  const verouderd = Boolean(weergave) && weergave.bronVingerafdruk !== bronVingerafdruk(blok);

  const opslaan = async () => {
    setBezig(true);
    setBewaard(false);
    try {
      await bewaarDocentVertaling(blok.id, taal, {
        titel: weergave?.titel || '',
        html: weergave?.html || '',
        items: weergave?.items || [],
        bronVingerafdruk: bronVingerafdruk(blok)
      });
      setBewaard(true);
    } finally {
      setBezig(false);
    }
  };

  return (
    <section className="helix-surface mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black text-[var(--helix-navy)]">Vertaling nakijken</h2>
        <select
          value={taal}
          onChange={(event) => setTaal(event.target.value)}
          className="rounded-xl border border-[var(--helix-border)] bg-white px-3 py-2 text-sm font-bold"
        >
          {beschikbareTalen().map((optie) => (
            <option key={optie.code} value={optie.code}>{optie.nederlands}</option>
          ))}
        </select>
      </div>

      {!weergave && (
        <p className="helix-muted mt-3 text-sm">
          Er is nog geen vertaling in het {taalLabel(taal)}. Die ontstaat zodra een leerling de knop
          voor het eerst gebruikt.
        </p>
      )}

      {verouderd && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">
          <AlertTriangle size={16} aria-hidden="true" />
          De Nederlandse tekst is gewijzigd sinds deze vertaling is nagekeken.
        </p>
      )}

      {weergave && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <p className="helix-eyebrow">Nederlands</p>
            <p className="mt-2 font-black">{blok.title}</p>
            <div className="lesson-prose mt-2 text-sm" dangerouslySetInnerHTML={{ __html: blok.content?.html || '' }} />
          </div>
          <div>
            <p className="helix-eyebrow">{taalLabel(taal)}</p>
            <input
              value={weergave.titel || ''}
              onChange={(event) => setVertaling({ ...weergave, titel: event.target.value })}
              className="mt-2 w-full rounded-xl border border-[var(--helix-border)] px-3 py-2 font-black"
            />
            <textarea
              value={weergave.html || ''}
              onChange={(event) => setVertaling({ ...weergave, html: event.target.value })}
              rows={10}
              className="mt-2 w-full rounded-xl border border-[var(--helix-border)] px-3 py-2 font-mono text-xs"
            />
          </div>
        </div>
      )}

      {weergave && (
        <button type="button" onClick={opslaan} disabled={bezig} className="btn-primary mt-4 px-5 py-3 text-sm">
          {bezig ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
          Vastzetten als nagekeken
        </button>
      )}

      {bewaard && <p className="mt-2 text-sm font-bold text-emerald-700">Opgeslagen.</p>}
    </section>
  );
}
