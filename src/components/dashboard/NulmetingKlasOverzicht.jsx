import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import NulmetingProfielKaart from '../nulmeting/NulmetingProfielKaart';
import { korteOnderdeelNaam, labelKlasse } from '../../lib/nulmetingProfielWeergave';
import * as nulmetingService from '../../services/nulmetingService';
import { HelixLaden } from '../merk/HelixLogo';

/**
 * Klasoverzicht van de nulmeting digitale vaardigheden: per leerling de negen
 * niveaulabels, met een knop om alle profielen van de klas opnieuw te laten
 * berekenen. Klik op een leerling voor het volledige profiel.
 */
export default function NulmetingKlasOverzicht({ klasId = '', klasNaam = '', students = [] }) {
  const [profielen, setProfielen] = useState({});
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [openUid, setOpenUid] = useState('');

  useEffect(() => {
    if (!klasId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfielen({});
      return;
    }
    let actief = true;
    setLoading(true);
    nulmetingService.getNulmetingProfielenVoorKlas(klasId)
      .then((data) => { if (actief) setProfielen(data); })
      .catch((err) => { console.error('Nulmetingprofielen laden mislukt:', err); if (actief) setError('Profielen konden niet geladen worden.'); })
      .finally(() => { if (actief) setLoading(false); });
    return () => { actief = false; };
  }, [klasId]);

  const bijwerken = async () => {
    if (!klasId || busy) return;
    setBusy(true);
    setError('');
    const result = await nulmetingService.berekenNulmetingProfielenVoorKlas(klasId);
    if (!result.success) {
      setError(result.error || 'Profielen bijwerken lukte niet.');
    } else {
      setProfielen(Object.fromEntries((result.profielen || []).map((profiel) => [profiel.userId, profiel])));
    }
    setBusy(false);
  };

  if (!klasId) {
    return (
      <p className="lo-melding lo-melding--info">Kies één klas om het nulmetingsoverzicht te zien.</p>
    );
  }

  const deelvaardigheden = Object.values(profielen)[0]?.deelvaardigheden || [];
  const gesorteerd = [...students].sort((a, b) => String(a.displayName || a.email || '').localeCompare(String(b.displayName || b.email || ''), 'nl'));

  return (
    <div className="helix-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="lo-eyebrow">Nulmeting digitale vaardigheden</p>
          <h3 className="lo-kaart-titel mt-1">Startprofielen {klasNaam}</h3>
          <p className="lo-kaart-uitleg">
            {Object.keys(profielen).length} van {students.length} leerlingen met een profiel. Geen cijfer, geen leerwegadvies.
          </p>
        </div>
        <button type="button" onClick={bijwerken} disabled={busy} className="lo-knop-tweede lo-knop--klein">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Profielen bijwerken
        </button>
      </div>

      {error && <p className="lo-melding lo-melding--fout mb-3">{error}</p>}

      {loading ? (
        <HelixLaden tekst="Laden..." className="min-h-0 py-10" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-y-1 text-xs">
            <thead>
              <tr className="text-left text-[13px] font-extrabold text-[var(--lo-grijs)]">
                <th className="px-2 py-1">Leerling</th>
                {deelvaardigheden.map((deel) => (
                  <th key={deel.id} className="px-1 py-1" title={deel.onderdeel}>{korteOnderdeelNaam(deel.onderdeel)}</th>
                ))}
                <th className="px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {gesorteerd.map((student) => {
                const profiel = profielen[student.id || student.uid];
                const uid = student.id || student.uid;
                return (
                  <tr key={uid} className="cursor-pointer bg-[var(--lo-kaart)] hover:bg-[var(--lo-papier)]" onClick={() => setOpenUid(openUid === uid ? '' : uid)}>
                    <td className="rounded-l-[var(--lo-hoek-s)] px-2 py-1.5 font-bold text-[var(--lo-inkt)]">{student.displayName || student.email}</td>
                    {profiel ? profiel.deelvaardigheden.map((deel) => (
                      <td key={deel.id} className="px-1 py-1.5">
                        <span className={`inline-block rounded-full border px-1.5 py-0.5 text-[11px] font-extrabold ${labelKlasse(deel.label)}`} title={`${deel.onderdeel}: ${deel.goed}/${deel.van}`}>
                          {deel.goed}/{deel.van}{deel.inconsistent ? ' !' : ''}
                        </span>
                      </td>
                    )) : (
                      <td className="px-2 py-1.5 text-[var(--lo-grijs)]" colSpan={Math.max(1, deelvaardigheden.length)}>Nog geen profiel</td>
                    )}
                    <td className="rounded-r-[var(--lo-hoek-s)] px-2 py-1.5 font-semibold text-[var(--lo-grijs)]">
                      {profiel ? (profiel.status === 'compleet' ? 'Compleet' : 'Voorlopig') : '-'}
                      {profiel?.docentSignalen?.length ? <AlertTriangle size={12} className="ml-1 inline text-[var(--lo-oranje-inkt)]" aria-label="signaal" /> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {openUid && profielen[openUid] && (
        <div className="mt-4 rounded-[var(--lo-hoek-m)] bg-[var(--lo-papier)] p-4">
          <p className="mb-3 text-sm font-extrabold text-[var(--lo-inkt)]">{profielen[openUid].naam || openUid}</p>
          <NulmetingProfielKaart profiel={profielen[openUid]} voorDocent />
        </div>
      )}
    </div>
  );
}
