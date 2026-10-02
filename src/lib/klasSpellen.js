import { GAME_STATUSES } from './gameRegistry.js';

/**
 * Welke spellen een klas kan spelen: de doorsnede van wat het beheer voor die
 * klas heeft klaargezet (klas.enabledGames) en wat in het register echt
 * speelbaar is (status actief). Een spel dat later op prototype teruggaat,
 * verdwijnt zo vanzelf ook bij de leerling.
 * Een actief spel met `voorIedereen: true` (KlimBit) staat er altijd bij, ook
 * zonder klas of klastoewijzing.
 */
export const speelbareKlasSpellen = (klas = {}, registry = []) => {
  const enabled = Array.isArray(klas?.enabledGames) ? klas.enabledGames : [];
  return (Array.isArray(registry) ? registry : []).filter(
    (game) => game?.status === GAME_STATUSES.ACTIVE && (game.voorIedereen === true || enabled.includes(game.gameId))
  );
};

/** Nieuw enabledGames-veld na aan- of uitvinken van een spel voor een klas. */
export const toggleSpelVoorKlas = (enabledGames = [], gameId = '') => {
  const huidig = Array.isArray(enabledGames) ? enabledGames.filter(Boolean) : [];
  if (!gameId) return huidig;
  return huidig.includes(gameId)
    ? huidig.filter((id) => id !== gameId)
    : [...huidig, gameId];
};
