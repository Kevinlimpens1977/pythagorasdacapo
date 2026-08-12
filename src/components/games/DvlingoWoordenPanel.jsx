import { useEffect, useMemo, useState } from 'react';
import { ListChecks, Save } from 'lucide-react';
import {
  DVLINGO_MAX_LENGTE,
  DVLINGO_MIN_EIGEN_WOORDEN,
  DVLINGO_MIN_LENGTE,
  beschrijfAfkeuring,
  leesWoordenTekst,
  schrijfWoordenTekst
} from '../../games/dvlingo/dvlingoWoordenlijst';
import { fetchDvlingoInstellingen, saveDvlingoInstellingen } from '../../services/dvlingoService';

// Woordenbeheer van DVLingo, als paneel op /admin/spellen. Vervangt de losse
// beheerpagina met browserslot uit de standalone versie: hier geldt de echte
// rolcontrole van het platform en reist de lijst mee tussen apparaten.
export default function DvlingoWoordenPanel() {
  const [tekst, setTekst] = useState('');
  const [gebruikEigenLijst, setGebruikEigenLijst] = useState(false);
  const [schud, setSchud] = useState(false);
  const [laden, setLaden] = useState(true);
  const [opslaan, setOpslaan] = useState(false);
  const [melding, setMelding] = useState(null);

  useEffect(() => {
    let actief = true;

    fetchDvlingoInstellingen()
      .then((instellingen) => {
        if (!actief) return;
        setTekst(schrijfWoordenTekst(instellingen.woorden));
        setGebruikEigenLijst(instellingen.gebruikEigenLijst);
        setSchud(instellingen.schud);
      })
      .catch((fout) => {
        console.error('Woordenlijst laden mislukt:', fout);
        if (actief) {
          setMelding({
            toon: 'error',
            tekst: 'Woordenlijst kon niet worden geladen. Controleer of de nieuwste firestore.rules zijn gedeployed.'
          });
        }
      })
      .finally(() => {
        if (actief) setLaden(false);
      });

    return () => {
      actief = false;
    };
  }, []);

  const keuring = useMemo(() => leesWoordenTekst(tekst), [tekst]);
  const teWeinig = gebruikEigenLijst && keuring.woorden.length < DVLINGO_MIN_EIGEN_WOORDEN;

  const handleOpslaan = async () => {
    setOpslaan(true);
    setMelding(null);
    try {
      await saveDvlingoInstellingen({
        gebruikEigenLijst,
        schud,
        woorden: keuring.woorden
      });
      setMelding({
        toon: 'success',
        tekst: gebruikEigenLijst && !teWeinig
          ? `Opgeslagen. Leerlingen spelen nu met je eigen lijst van ${keuring.woorden.length} woorden.`
          : 'Opgeslagen. Leerlingen spelen met de ingebouwde lijst digitale vaardigheden.'
      });
    } catch (fout) {
      console.error('Woordenlijst opslaan mislukt:', fout);
      setMelding({ toon: 'error', tekst: 'Opslaan mislukt. Controleer je adminrechten.' });
    } finally {
      setOpslaan(false);
    }
  };

  return (
    <section className="helix-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="helix-eyebrow">Spelinstellingen</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-[var(--helix-navy)]">
            Woordenbeheer DVLingo
          </h3>
          <p className="helix-muted mt-2 max-w-2xl text-sm leading-6">
            Zet hier je eigen woorden klaar voor de klas. Eén woord per regel, van {DVLINGO_MIN_LENGTE} tot{' '}
            {DVLINGO_MAX_LENGTE} letters. Wil je een uitleg tonen bij de uitslag, zet die dan achter een puntkomma:
            <span className="font-bold"> FIREWALL; Muur tegen ongewenst verkeer</span>. Zonder eigen lijst speelt de klas
            met de ingebouwde lijst digitale vaardigheden.
          </p>
        </div>
        <span className="helix-badge bg-[var(--helix-soft-lavender)] text-[var(--helix-purple)]">
          <ListChecks size={13} />
          {keuring.woorden.length} woorden
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-bold text-[var(--helix-navy)]">
          <input
            type="checkbox"
            checked={gebruikEigenLijst}
            onChange={(event) => setGebruikEigenLijst(event.target.checked)}
          />
          Eigen lijst gebruiken
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-[var(--helix-navy)]">
          <input type="checkbox" checked={schud} onChange={(event) => setSchud(event.target.checked)} />
          Woorden in willekeurige volgorde
        </label>
      </div>

      <textarea
        className="input-standard mt-4 h-56 w-full font-mono text-sm"
        value={tekst}
        disabled={laden}
        onChange={(event) => setTekst(event.target.value)}
        placeholder={'FIREWALL; Muur tegen ongewenst verkeer\nPHISHING; Nepbericht dat om je gegevens vraagt\nBACK-UP; Reservekopie van je bestanden'}
        aria-label="Woordenlijst DVLingo"
      />

      {(keuring.afgekeurd.length > 0 || keuring.dubbel.length > 0) && (
        <div className="helix-alert mt-4 p-4 text-sm leading-6">
          {keuring.afgekeurd.length > 0 && (
            <p>
              <span className="font-black">{keuring.afgekeurd.length} regel(s) afgekeurd:</span>{' '}
              {keuring.afgekeurd
                .slice(0, 5)
                .map((item) => `${item.invoer || 'lege regel'} (${beschrijfAfkeuring(item.reden)})`)
                .join(', ')}
              {keuring.afgekeurd.length > 5 ? ' …' : ''}
            </p>
          )}
          {keuring.dubbel.length > 0 && (
            <p className="mt-1">
              <span className="font-black">Dubbel, één keer bewaard:</span> {keuring.dubbel.join(', ')}
            </p>
          )}
        </div>
      )}

      {teWeinig && (
        <div className="helix-alert mt-4 border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          Je eigen lijst telt {keuring.woorden.length} woorden. Het spel heeft er minstens{' '}
          {DVLINGO_MIN_EIGEN_WOORDEN} nodig om drie levels te vullen; tot die tijd spelen leerlingen met de
          ingebouwde lijst.
        </div>
      )}

      {melding && (
        <div
          className={`helix-alert mt-4 p-4 text-sm leading-6 ${
            melding.toon === 'error' ? 'border-red-200 bg-red-50 text-red-900' : 'border-green-200 bg-green-50 text-green-900'
          }`}
        >
          {melding.tekst}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="btn-primary" onClick={handleOpslaan} disabled={opslaan || laden}>
          <Save size={16} />
          {opslaan ? 'Opslaan…' : 'Woordenlijst opslaan'}
        </button>
      </div>
    </section>
  );
}
