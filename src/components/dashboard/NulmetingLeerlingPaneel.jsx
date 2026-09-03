import { useEffect, useState } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import NulmetingProfielKaart from '../nulmeting/NulmetingProfielKaart';
import * as nulmetingService from '../../services/nulmetingService';

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
          <p className="helix-eyebrow">Nulmeting digitale vaardigheden</p>
          <h3 className="mt-1 text-lg font-black text-[var(--helix-navy)]">Startprofiel {leerlingNaam}</h3>
        </div>
        <button type="button" onClick={bijwerken} disabled={busy} className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-50">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          {profiel ? 'Bijwerken' : 'Berekenen'}
        </button>
      </div>
      {error && <p className="mb-3 text-sm font-semibold text-rose-700">{error}</p>}
      {loading ? (
        <p className="text-sm font-semibold text-[var(--helix-muted)]">Laden...</p>
      ) : profiel ? (
        <NulmetingProfielKaart profiel={profiel} voorDocent />
      ) : (
        <p className="text-sm font-semibold text-[var(--helix-muted)]">
          Nog geen profiel. Klik op Berekenen zodra de leerling (een deel van) de nulmeting heeft gemaakt.
        </p>
      )}
    </div>
  );
}
