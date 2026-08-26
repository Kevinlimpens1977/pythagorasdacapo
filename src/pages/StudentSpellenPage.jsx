import { useEffect, useState } from 'react';
import { Gamepad2, Loader2 } from 'lucide-react';
import { useAuth } from '../components/auth/AuthProvider';
import GamePlayer from '../components/games/GamePlayer';
import { GAME_REGISTRY, GAME_RESULT_HANDLING } from '../lib/gameRegistry';
import { speelbareKlasSpellen } from '../lib/klasSpellen';
import { getKlasVoorSpellen } from '../services/spelToewijzingService';
import { awardTokensForActivity } from '../services/tokenService';

/**
 * De spellenpagina van de leerling: alles wat de docent voor zijn klas heeft
 * klaargezet. Tokens lopen via dezelfde servercallable als in de les; de
 * server kent per spel de regels (maximum en halvering per herspeelbeurt),
 * dus eindeloos herspelen mag zonder dat het eindeloos oplevert.
 */
export default function StudentSpellenPage() {
  const { currentUser, userData } = useAuth();
  const [spellen, setSpellen] = useState(null);
  const [tokenNotice, setTokenNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    const laad = async () => {
      try {
        const klas = await getKlasVoorSpellen(userData?.klasId);
        if (!cancelled) setSpellen(speelbareKlasSpellen(klas, GAME_REGISTRY));
      } catch (err) {
        console.warn('Spellen laden mislukt:', err);
        if (!cancelled) setSpellen([]);
      }
    };
    laad();
    return () => { cancelled = true; };
  }, [userData?.klasId]);

  const handleResult = async (game, result) => {
    try {
      const award = await awardTokensForActivity({
        sourceKind: 'game',
        sourceId: game.gameId,
        sourceVersion: 'spellenpagina-v1',
        sourceTitle: game.title,
        paragraafId: '',
        blockId: '',
        gameId: game.gameId,
        result: {
          ...result,
          completed: true,
          passed: true
        }
      });
      if (award?.awarded && Number(award.amount) > 0) {
        setTokenNotice(`+${award.amount} tokens verdiend met ${game.title}`);
        window.setTimeout(() => setTokenNotice(''), 3600);
      }
    } catch (err) {
      console.warn('Speltokens konden niet worden toegekend:', err);
    }
  };

  return (
    <div className="helix-page">
      <div className="helix-container py-10 md:py-12">
        <p className="helix-eyebrow">Spelen</p>
        <h1 className="helix-heading-xl mt-2">Spellen</h1>
        <p className="helix-muted mt-3 max-w-2xl text-lg leading-8">
          Deze spellen heeft je docent voor jouw klas klaargezet. Spelen mag zo vaak je wilt; tokens verdien je vooral met je eerste goede beurten.
        </p>

        {tokenNotice ? (
          <p className="mt-5 rounded-[var(--helix-radius-md)] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            {tokenNotice}
          </p>
        ) : null}

        {spellen === null ? (
          <div className="helix-muted mt-8 flex items-center gap-2 text-sm">
            <Loader2 size={16} className="animate-spin" /> Spellen laden...
          </div>
        ) : spellen.length === 0 ? (
          <div className="helix-surface mt-8 p-10 text-center">
            <Gamepad2 size={36} className="mx-auto text-[var(--helix-purple)]/40" />
            <p className="mt-3 font-black text-[var(--helix-navy)]">Nog geen spellen klaargezet</p>
            <p className="helix-muted mt-1 text-sm">
              Zodra je docent een spel voor jouw klas aanzet, verschijnt het hier.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6">
            {spellen.map((game) => (
              <section key={game.gameId} className="helix-surface p-6">
                <h2 className="text-xl font-black text-[var(--helix-navy)]">{game.title}</h2>
                <p className="helix-muted mt-1 text-sm">{game.description}</p>
                <div className="mt-4">
                  <GamePlayer
                    gameId={game.gameId}
                    variant="student"
                    context={{
                      mode: 'standalone',
                      resultHandling: GAME_RESULT_HANDLING.LOCAL_ONLY,
                      studentId: currentUser?.uid
                    }}
                    onResult={(result) => handleResult(game, result)}
                  />
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
