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
  // Beide onthouden de blockId__taal-sleutel waar ze bij horen (niet zomaar
  // true/false), zodat "Opgeslagen." of een foutmelding nooit blijft hangen
  // na het wisselen van taal of blok: zie huidigeSleutel hieronder.
  const [bewaard, setBewaard] = useState(null);
  const [fout, setFout] = useState(null);

  useEffect(() => {
    let gestopt = false;
    haalOpgeslagenVertaling(blok.id, taal).then((gevonden) => {
      if (!gestopt) setVertaling(gevonden);
    });
    return () => { gestopt = true; };
  }, [blok.id, taal]);

  // Geen setState vooraf om de vorige vertaling weg te halen (dat mag niet
  // synchroon in een effect): het opgehaalde document draagt zijn eigen
  // blockId__taal-sleutel, dus een vertaling die niet bij de huidige keuze
  // hoort telt hier gewoon als "nog niet geladen". Dezelfde sleutel filtert
  // hieronder ook "Opgeslagen." en de foutmelding, zodat die meteen (zonder
  // op een nieuwe ophaalbeurt te wachten) verdwijnen zodra de docent van taal
  // of blok wisselt.
  const huidigeSleutel = `${blok.id}__${taal}`;
  const weergave = vertaling && vertaling.id === huidigeSleutel ? vertaling : null;
  const opgeslagen = bewaard === huidigeSleutel;
  const foutmelding = fout && fout.sleutel === huidigeSleutel ? fout.bericht : null;

  const verouderd = Boolean(weergave) && weergave.bronVingerafdruk !== bronVingerafdruk(blok);

  const opslaan = async () => {
    setBezig(true);
    setBewaard(null);
    setFout(null);
    try {
      await bewaarDocentVertaling(blok.id, taal, {
        titel: weergave?.titel || '',
        html: weergave?.html || '',
        items: weergave?.items || [],
        bronVingerafdruk: bronVingerafdruk(blok)
      });
      setBewaard(huidigeSleutel);
    } catch (err) {
      console.error('Vertaling opslaan mislukt:', err);
      setFout({ sleutel: huidigeSleutel, bericht: 'Opslaan is niet gelukt. Probeer het opnieuw.' });
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

      {opgeslagen && <p className="mt-2 text-sm font-bold text-emerald-700">Opgeslagen.</p>}

      {foutmelding && (
        <p className="mt-2 inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          <AlertTriangle size={16} aria-hidden="true" />
          {foutmelding}
        </p>
      )}
    </section>
  );
}
