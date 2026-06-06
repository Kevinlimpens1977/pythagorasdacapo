export const GAME_COMPONENT_KEYS = {
  PYTHAGORAS_TRAINER: 'pythagorasTrainer',
  ACCOUNT_ESCAPE: 'accountEscape'
};

export const PLAYABLE_GAME_COMPONENT_KEYS = Object.values(GAME_COMPONENT_KEYS);

export const isPlayableGameComponentKey = (componentKey) => {
  return PLAYABLE_GAME_COMPONENT_KEYS.includes(componentKey);
};
