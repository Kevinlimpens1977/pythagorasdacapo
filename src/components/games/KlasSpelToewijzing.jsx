import { useEffect, useState } from 'react';
import { CheckSquare, Loader2, Square, Users2 } from 'lucide-react';
import { GAME_STATUSES } from '../../lib/gameRegistry';
import { getAlleKlassenMetSpellen, zetSpelVoorKlas } from '../../services/spelToewijzingService';

/**
 * Een spel klaarzetten per klas, los van de lesstof. Leerlingen van een
 * aangevinkte klas zien het spel op hun eigen Spellen-pagina (route /spellen)
 * en kunnen het zo vaak spelen als ze willen; de tokenregels van het spel
 * (maximum en halvering per herspeelbeurt) begrenzen de opbrengst.
 */
export default function KlasSpelToewijzing({ game }) {
  const [klassen, setKlassen] = useState(null);
  const [busyKlasId, setBusyKlasId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getAlleKlassenMetSpellen()
      .then((rows) => { if (!cancelled) setKlassen(rows); })
      .catch((err) => {
        console.error('Klassen laden mislukt:', err);
        if (!cancelled) { setKlassen([]); setError('Klassen konden niet worden geladen.'); }
      });
    return () => { cancelled = true; };
  }, []);

  if (!game) return null;

  const actief = game.status === GAME_STATUSES.ACTIVE;

  const toggle = async (klas) => {
    setBusyKlasId(klas.klasId);
    setError('');
    try {
      await zetSpelVoorKlas({ klasId: klas.klasId, gameId: game.gameId, enabledGames: klas.enabledGames });
      setKlassen((current) => (current || []).map((row) =>
        row.klasId === klas.klasId
          ? {
              ...row,
              enabledGames: (row.enabledGames || []).includes(game.gameId)
                ? (row.enabledGames || []).filter((id) => id !== game.gameId)
                : [...(row.enabledGames || []), game.gameId]
            }
          : row
      ));
    } catch (err) {
      console.error('Spel toewijzen mislukt:', err);
      setError('Opslaan lukte niet. Probeer het opnieuw.');
    } finally {
      setBusyKlasId(null);
    }
  };

  return (
    <section className="helix-surface mt-6 p-6">
      <div className="flex items-center gap-2">
        <Users2 size={18} className="text-[var(--helix-purple)]" />
        <h2 className="text-lg font-black text-[var(--helix-navy)]">Klaarzetten voor klassen</h2>
      </div>

      {!actief ? (
        <p className="helix-muted mt-3 text-sm">
          Dit spel staat nog niet op actief. Zet de status op actief voordat je het aan een klas geeft; klaargezette
          prototypes blijven voor leerlingen onzichtbaar.
        </p>
      ) : (
        <p className="helix-muted mt-3 text-sm">
          Aangevinkte klassen zien {game.title} op hun Spellen-pagina en kunnen meteen spelen.
        </p>
      )}

      {error ? <p className="mt-3 text-sm font-bold text-red-700">{error}</p> : null}

      {klassen === null ? (
        <div className="helix-muted mt-4 flex items-center gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Klassen laden...</div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {klassen.map((klas) => {
            const aan = (klas.enabledGames || []).includes(game.gameId);
            return (
              <button
                key={klas.klasId}
                type="button"
                onClick={() => toggle(klas)}
                disabled={busyKlasId === klas.klasId}
                className={`inline-flex min-h-10 items-center gap-2 rounded-[var(--helix-radius-md)] border px-3 text-sm font-bold transition-colors disabled:opacity-50 ${
                  aan
                    ? 'border-[var(--helix-purple)] bg-[var(--helix-soft-lavender)] text-[var(--helix-purple-dark)]'
                    : 'border-[var(--helix-border)] bg-white text-[var(--helix-navy)] hover:border-[var(--helix-purple)]'
                }`}
              >
                {busyKlasId === klas.klasId
                  ? <Loader2 size={15} className="animate-spin" />
                  : aan ? <CheckSquare size={15} /> : <Square size={15} />}
                {klas.name}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
