import { useEffect, useState } from 'react';
import { CheckSquare, Loader2, Square, Users2 } from 'lucide-react';
import { GAME_STATUSES } from '../../lib/gameRegistry';
import { getAlleKlassenMetSpellen, zetSpelVoorKlas } from '../../services/spelToewijzingService';
import { HelixLaden } from '../merk/HelixLogo';

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
    <section className="lo-kaart mt-6">
      <h2 className="lo-kaart-titel">
        <Users2 size={18} className="text-[var(--lo-blauw-inkt)]" />
        Klaarzetten voor klassen
      </h2>

      {!actief ? (
        <p className="lo-kaart-uitleg !mt-0">
          Dit spel staat nog niet op actief. Zet de status op actief voordat je het aan een klas geeft; klaargezette
          prototypes blijven voor leerlingen onzichtbaar.
        </p>
      ) : (
        <p className="lo-kaart-uitleg !mt-0">
          Aangevinkte klassen zien {game.title} op hun Spellen-pagina en kunnen meteen spelen.
        </p>
      )}

      {error ? <p className="lo-melding lo-melding--fout">{error}</p> : null}

      {klassen === null ? (
        <HelixLaden tekst="Klassen laden..." className="min-h-0 py-10" />
      ) : (
        <div className="lo-keuzes">
          {klassen.map((klas) => {
            const aan = (klas.enabledGames || []).includes(game.gameId);
            return (
              <button
                key={klas.klasId}
                type="button"
                onClick={() => toggle(klas)}
                disabled={busyKlasId === klas.klasId}
                aria-pressed={aan}
                className="lo-keuze disabled:opacity-50"
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
