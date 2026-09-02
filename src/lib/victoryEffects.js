import { getActiveRewardItems, VICTORY_EFFECT_KEYS } from './tokenShopRewards.js';

export const VICTORY_STREAK_MILESTONE = 5;

export const createVictoryStreakState = () => ({ count: 0 });

// Streak telt alleen echte vraagblokken; theorie/media doorklikken verandert de reeks niet.
export const updateVictoryStreak = (state = {}, { blockType, completed, isCorrect } = {}) => {
  const count = Number(state.count) || 0;

  if (blockType !== 'question' || !completed) {
    return { count, milestone: false };
  }

  if (isCorrect !== true) {
    return { count: 0, milestone: false };
  }

  const nextCount = count + 1;
  return {
    count: nextCount,
    milestone: nextCount % VICTORY_STREAK_MILESTONE === 0
  };
};

export const resolveActiveVictoryEffect = ({ loadout = {}, items = [] } = {}) => {
  const activeItem = getActiveRewardItems({ loadout, items })
    .find((item) => item.itemType === 'victoryEffect');
  if (!activeItem) return null;

  const effect = activeItem.previewStyle?.effect;
  return {
    id: activeItem.id || activeItem.itemId || '',
    title: activeItem.title || 'Victory effect',
    effect: VICTORY_EFFECT_KEYS.includes(effect) ? effect : VICTORY_EFFECT_KEYS[0],
    accent: activeItem.previewStyle?.accent || '#087EB5'
  };
};

// trigger 'paragraphEnd' speelt het volledige effect, 'streak' een korte subtiele variant.
export const buildVictoryEffectPlayback = ({ effectItem, trigger, streakCount = 0 } = {}) => {
  if (!effectItem || !effectItem.effect) return null;
  if (trigger !== 'paragraphEnd' && trigger !== 'streak') return null;

  const isFull = trigger === 'paragraphEnd';
  return {
    effect: effectItem.effect,
    accent: effectItem.accent || '#087EB5',
    title: effectItem.title || '',
    variant: isFull ? 'full' : 'subtle',
    durationMs: isFull ? 3000 : 1800,
    heading: isFull ? 'Paragraaf afgerond!' : `${streakCount} goed op rij!`
  };
};
