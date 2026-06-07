export const TOKEN_SHOP_ITEM_TYPES = [
  'avatarSkin',
  'avatarFrame',
  'shopBadge',
  'profileBanner',
  'victoryEffect',
  'titleBadge'
];

export const TOKEN_SHOP_TYPE_LABELS = {
  avatarSkin: 'Avatar',
  avatarFrame: 'Frame',
  shopBadge: 'Pin',
  profileBanner: 'Banner',
  victoryEffect: 'Effect',
  titleBadge: 'Titel'
};

export const TOKEN_SHOP_RARITY_LABELS = {
  common: 'Basis',
  rare: 'Speciaal',
  epic: 'Premium',
  legendary: 'Legendary'
};

export const TOKEN_SHOP_TARGET_SLOT_BY_TYPE = {
  avatarSkin: 'avatarSkin',
  avatarFrame: 'avatarFrame',
  shopBadge: 'pin',
  profileBanner: 'profileBanner',
  victoryEffect: 'victoryEffect',
  titleBadge: 'titleBadge'
};

export const TOKEN_SHOP_LOADOUT_FIELDS = [
  'activeAvatarSkinId',
  'activeAvatarFrameId',
  'activeProfileBannerId',
  'activeVictoryEffectId',
  'activeTitleBadgeId'
];

export const DEFAULT_TOKEN_SHOP_ITEMS = [];

export const getRewardTypeLabel = (itemType = '') => (
  TOKEN_SHOP_TYPE_LABELS[itemType] || 'Gadget'
);

export const getRewardRarityLabel = (rarity = '') => (
  TOKEN_SHOP_RARITY_LABELS[rarity] || TOKEN_SHOP_RARITY_LABELS.common
);

export const normalizeLoadout = (loadout = {}) => ({
  activeAvatarFrameId: String(loadout.activeAvatarFrameId || ''),
  activeAvatarSkinId: String(loadout.activeAvatarSkinId || ''),
  activeProfileBannerId: String(loadout.activeProfileBannerId || ''),
  activeVictoryEffectId: String(loadout.activeVictoryEffectId || ''),
  activeTitleBadgeId: String(loadout.activeTitleBadgeId || ''),
  activePinIds: Array.isArray(loadout.activePinIds)
    ? loadout.activePinIds.map((id) => String(id || '')).filter(Boolean).slice(0, 3)
    : []
});

export const getActiveRewardItems = ({ loadout = {}, items = [] } = {}) => {
  const normalized = normalizeLoadout(loadout);
  const itemById = new Map(items.map((item) => [item.id || item.itemId, item]));
  const activeIds = [
    normalized.activeAvatarFrameId,
    normalized.activeAvatarSkinId,
    normalized.activeProfileBannerId,
    normalized.activeVictoryEffectId,
    normalized.activeTitleBadgeId,
    ...normalized.activePinIds
  ].filter(Boolean);

  return activeIds.map((id) => itemById.get(id)).filter(Boolean);
};

export const buildShopSeedPayload = (item) => ({
  ...item,
  targetSlot: TOKEN_SHOP_TARGET_SLOT_BY_TYPE[item.itemType] || 'pin',
  enabled: item.enabled !== false,
  imageStoragePath: item.imageStoragePath || ''
});
