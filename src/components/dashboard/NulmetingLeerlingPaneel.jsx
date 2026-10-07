import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import NulmetingProfielKaart from '../nulmeting/NulmetingProfielKaart';
import * as nulmetingService from '../../services/nulmetingService';
import { HelixLaden } from '../merk/HelixLogo';

/** Het startprofiel van één leerling in het docentdetail, met bijwerkknop. */
export default function NulmetingLeerlingPaneel({ leerlingUid = '', leerlingNaam = '' }) {
  const [profiel, setProfiel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!leerlingUid) return undefined;
    let actief = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    nulmetingService.getNulmetingProfiel(leerlingUid)
      .then((data) => { if (actief) setProfiel(data); })
      .catch((err) => { console.error('Nulmetingprofiel laden mislukt:', err); })
      .finally(() => { if (actief) setLoading(false); });
    return () => { actief = false; };
  }, [leerlingUid]);

  const bijwerken = async () => {
    if (!leerlingUid || busy) return;
    setBusy(true);
    setError('');
    const result = await nulmetingService.berekenNulmetingProfielVoorLeerling(leerlingUid);
    if (result.success) setProfiel(result.profiel);
    else setError(result.error || 'Profiel bijwerken lukte niet.');
    setBusy(false);
  };

  return (
    <div className="helix-card mb-6 p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="lo-eyebrow">Nulmeting digitale vaardigheden</p>
          <h3 className="lo-kaart-titel mt-1">Startprofiel {leerlingNaam}</h3>
        </div>
        <button type="button" onClick={bijwerken} disabled={busy} className="lo-knop-tweede lo-knop--klein">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {profiel ? 'Bijwerken' : 'Berekenen'}
        </button>
      </div>
      {error && <p className="lo-melding lo-melding--fout mb-3">{error}</p>}
      {loading ? (
        <HelixLaden tekst="Laden..." className="min-h-0 py-10" />
      ) : profiel ? (
        <NulmetingProfielKaart profiel={profiel} voorDocent />
      ) : (
        <p className="text-sm text-[var(--lo-grijs)]">
          Nog geen profiel. Klik op Berekenen zodra de leerling (een deel van) de nulmeting heeft gemaakt.
        </p>
      )}
    </div>
  );
}
