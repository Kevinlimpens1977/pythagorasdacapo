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
import { Label } from '../leeromgeving';

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
    <section className="lo-kaart">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="lo-eyebrow">Spelinstellingen</p>
          <h3 className="lo-kaart-titel mt-2">
            Woordenbeheer DVLingo
          </h3>
          <p className="lo-kaart-uitleg max-w-2xl">
            Zet hier je eigen woorden klaar voor de klas. Eén woord per regel, van {DVLINGO_MIN_LENGTE} tot{' '}
            {DVLINGO_MAX_LENGTE} letters. Wil je een uitleg tonen bij de uitslag, zet die dan achter een puntkomma:
            <span className="font-bold"> FIREWALL; Muur tegen ongewenst verkeer</span>. Zonder eigen lijst speelt de klas
            met de ingebouwde lijst digitale vaardigheden.
          </p>
        </div>
        <Label kleur="paars" icoon={ListChecks}>
          {keuring.woorden.length} woorden
        </Label>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm font-bold text-[var(--lo-inkt)]">
          <input
            type="checkbox"
            checked={gebruikEigenLijst}
            onChange={(event) => setGebruikEigenLijst(event.target.checked)}
          />
          Eigen lijst gebruiken
        </label>
        <label className="flex items-center gap-2 text-sm font-bold text-[var(--lo-inkt)]">
          <input type="checkbox" checked={schud} onChange={(event) => setSchud(event.target.checked)} />
          Woorden in willekeurige volgorde
        </label>
      </div>

      <textarea
        className="lo-invoer h-56 font-mono text-sm"
        value={tekst}
        disabled={laden}
        onChange={(event) => setTekst(event.target.value)}
        placeholder={'FIREWALL; Muur tegen ongewenst verkeer\nPHISHING; Nepbericht dat om je gegevens vraagt\nBACK-UP; Reservekopie van je bestanden'}
        aria-label="Woordenlijst DVLingo"
      />

      {(keuring.afgekeurd.length > 0 || keuring.dubbel.length > 0) && (
        <div className="lo-melding lo-melding--info flex-col gap-0">
          {keuring.afgekeurd.length > 0 && (
            <p>
              <span className="font-extrabold">{keuring.afgekeurd.length} regel(s) afgekeurd:</span>{' '}
              {keuring.afgekeurd
                .slice(0, 5)
                .map((item) => `${item.invoer || 'lege regel'} (${beschrijfAfkeuring(item.reden)})`)
                .join(', ')}
              {keuring.afgekeurd.length > 5 ? ' …' : ''}
            </p>
          )}
          {keuring.dubbel.length > 0 && (
            <p className="mt-1">
              <span className="font-extrabold">Dubbel, één keer bewaard:</span> {keuring.dubbel.join(', ')}
            </p>
          )}
        </div>
      )}

      {teWeinig && (
        <div className="lo-melding lo-melding--info">
          Je eigen lijst telt {keuring.woorden.length} woorden. Het spel heeft er minstens{' '}
          {DVLINGO_MIN_EIGEN_WOORDEN} nodig om drie levels te vullen; tot die tijd spelen leerlingen met de
          ingebouwde lijst.
        </div>
      )}

      {melding && (
        <div
          className={`lo-melding ${melding.toon === 'error' ? 'lo-melding--fout' : 'lo-melding--goed'}`}
        >
          {melding.tekst}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" className="lo-knop" onClick={handleOpslaan} disabled={opslaan || laden}>
          <Save size={16} />
          {opslaan ? 'Opslaan…' : 'Woordenlijst opslaan'}
        </button>
      </div>
    </section>
  );
}
