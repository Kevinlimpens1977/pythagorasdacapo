// Spiegel van DEFAULT_GAME_TOKEN_REWARD_RULES in functions/index.js.
// De server is leidend: pas beide plekken aan als een default wijzigt.
export const SERVER_DEFAULT_GAME_REWARD_RULES = {
  'wachtwoord-detective': { enabled: true, min: 0, max: 100, basis: 'score_accuracy_completion' },
  'social-media-zoektocht': { enabled: true, min: 0, max: 200, basis: 'score_accuracy_completion' },
  // replayDecay: herhaalbeurten leveren server-side steeds de helft op, totaal max 200.
  'turbo-typen': { enabled: true, min: 0, max: 200, basis: 'score_accuracy_completion', replayDecay: 0.5 },
  'paco-pac-man': { enabled: true, min: 0, max: 400, basis: 'score_accuracy_completion', replayDecay: 0.5 },
  'data-koerier': { enabled: true, min: 0, max: 200, basis: 'score_accuracy_completion', replayDecay: 0.5 },
  // Streefscore 6.000 spelpunten = 100% (zie src/games/dvlingo/dvlingoScore.js).
  dvlingo: { enabled: true, min: 0, max: 400, basis: 'score_accuracy_completion', replayDecay: 0.5 }
};

export const GAME_REWARD_BASES = [
  { value: 'completion', label: 'Uitspelen (vast bedrag)' },
  { value: 'score_accuracy_completion', label: 'Score en nauwkeurigheid' }
];

// Speellimiet: hoe vaak een leerling het spel mag spelen. 0 = onbeperkt.
export const UNLIMITED_PLAYS = 0;
export const MAX_PLAY_LIMIT = 5;

export const PLAY_LIMIT_OPTIONS = [
  { value: 1, label: '1 keer' },
  { value: 2, label: '2 keer' },
  { value: 3, label: '3 keer' },
  { value: 4, label: '4 keer' },
  { value: 5, label: '5 keer' },
  { value: UNLIMITED_PLAYS, label: 'Onbeperkt' }
];

// Normaliseert een ruwe waarde naar 0 (onbeperkt) of 1..MAX_PLAY_LIMIT.
export const normalizeMaxPlays = (value) => {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number) || number <= 0) return UNLIMITED_PLAYS;
  return Math.min(MAX_PLAY_LIMIT, number);
};

export const describePlayLimit = (maxPlays) => (
  normalizeMaxPlays(maxPlays) === UNLIMITED_PLAYS
    ? 'onbeperkt speelbaar'
    : `${normalizeMaxPlays(maxPlays)}x speelbaar`
);

export const normalizeGameRewardRule = (data = null) => {
  if (!data || data.enabled === false) return null;
  const max = Math.max(0, Math.round(Number(data.max ?? data.maxTokens) || 0));
  if (max <= 0) return null;

  return {
    min: Math.min(max, Math.max(0, Math.round(Number(data.min ?? data.minTokens) || 0))),
    max,
    basis: String(data.basis || 'completion').trim() || 'completion'
  };
};

// Zelfde volgorde als getGameRewardRule server-side:
// eerst het Firestore-document, anders de code-default, anders geen tokens.
export const getEffectiveGameRewardRule = (gameId, configuredRules = {}) => {
  const configured = configuredRules?.[gameId];
  if (configured) {
    return { rule: normalizeGameRewardRule(configured), source: 'custom' };
  }

  const fallback = SERVER_DEFAULT_GAME_REWARD_RULES[gameId];
  if (fallback) {
    return { rule: normalizeGameRewardRule(fallback), source: 'default' };
  }

  return { rule: null, source: 'none' };
};

// Effectieve speellimiet: eerst het Firestore-document (indien maxPlays gezet is),
// anders de default uit de registry (game.maxPlays), anders onbeperkt.
export const getEffectiveMaxPlays = (gameId, configuredRules = {}, registryDefault = UNLIMITED_PLAYS) => {
  const configured = configuredRules?.[gameId];
  if (configured && configured.maxPlays !== undefined && configured.maxPlays !== null) {
    return normalizeMaxPlays(configured.maxPlays);
  }

  return normalizeMaxPlays(registryDefault);
};

// Bepaalt of een leerling (nog) mag spelen op basis van limiet en aantal gespeelde beurten.
export const getPlayAccess = (maxPlays, playCount = 0) => {
  const limit = normalizeMaxPlays(maxPlays);
  const plays = Math.max(0, Math.round(Number(playCount) || 0));
  if (limit === UNLIMITED_PLAYS) {
    return { limit, plays, unlimited: true, canPlay: true, remaining: Infinity };
  }

  const remaining = Math.max(0, limit - plays);
  return { limit, plays, unlimited: false, canPlay: remaining > 0, remaining };
};
