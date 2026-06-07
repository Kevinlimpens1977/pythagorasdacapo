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
  platinum: 'Platinum',
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

const avatarImage = (number) => `/token-shop/${number}.png`;

export const STARTER_AVATAR_ITEM = {
  id: 'avatar-1',
  itemId: 'avatar-1',
  title: 'Starter Avatar',
  description: 'Je eerste HELIX-avatar. Deze staat automatisch klaar.',
  price: 0,
  itemType: 'avatarSkin',
  rarity: 'common',
  targetSlot: 'avatarSkin',
  sortOrder: 10,
  enabled: false,
  ownedByDefault: true,
  imageUrl: avatarImage(1),
  previewStyle: {
    accent: '#7a3cff',
    motion: 'starter',
    sparkle: 'soft'
  }
};

export const DEFAULT_TOKEN_SHOP_ITEMS = [
  {
    itemId: 'avatar-2',
    title: 'Bronzen Blink',
    description: 'Een vriendelijke eerste upgrade voor je profiel.',
    price: 50,
    itemType: 'avatarSkin',
    rarity: 'common',
    sortOrder: 20,
    imageUrl: avatarImage(2),
    previewStyle: { accent: '#c47a2c', motion: 'shine', sparkle: 'bronze' }
  },
  {
    itemId: 'avatar-3',
    title: 'Zilveren Sprong',
    description: 'Net iets exclusiever, met een frisse zilveren glans.',
    price: 90,
    itemType: 'avatarSkin',
    rarity: 'common',
    sortOrder: 30,
    imageUrl: avatarImage(3),
    previewStyle: { accent: '#94a3b8', motion: 'twinkle', sparkle: 'silver' }
  },
  {
    itemId: 'avatar-4',
    title: 'Blauwe Bliksem',
    description: 'Een energieke avatar voor leerlingen die lekker op gang zijn.',
    price: 150,
    itemType: 'avatarSkin',
    rarity: 'rare',
    sortOrder: 40,
    imageUrl: avatarImage(4),
    previewStyle: { accent: '#2563eb', motion: 'pulse', sparkle: 'blue' }
  },
  {
    itemId: 'avatar-5',
    title: 'Groene Glans',
    description: 'Een rustige upgrade met een heldere groeistijl.',
    price: 230,
    itemType: 'avatarSkin',
    rarity: 'rare',
    sortOrder: 50,
    imageUrl: avatarImage(5),
    previewStyle: { accent: '#16a34a', motion: 'leaf', sparkle: 'green' }
  },
  {
    itemId: 'avatar-6',
    title: 'Roze Ster',
    description: 'Een opvallende avatar met zachte sterrenenergie.',
    price: 330,
    itemType: 'avatarSkin',
    rarity: 'epic',
    sortOrder: 60,
    imageUrl: avatarImage(6),
    previewStyle: { accent: '#e44f70', motion: 'star', sparkle: 'pink' }
  },
  {
    itemId: 'avatar-7',
    title: 'Kosmische Vonk',
    description: 'Een diepe, sprankelende stijl voor echte spaarders.',
    price: 460,
    itemType: 'avatarSkin',
    rarity: 'epic',
    sortOrder: 70,
    imageUrl: avatarImage(7),
    previewStyle: { accent: '#7c3aed', motion: 'orbit', sparkle: 'violet' }
  },
  {
    itemId: 'avatar-8',
    title: 'Kristallen Kampioen',
    description: 'Een glanzende avatar met premium uitstraling.',
    price: 620,
    itemType: 'avatarSkin',
    rarity: 'platinum',
    sortOrder: 80,
    imageUrl: avatarImage(8),
    previewStyle: { accent: '#b8c7ff', motion: 'crystal', sparkle: 'platinum' }
  },
  {
    itemId: 'avatar-9',
    title: 'Platinum Piek',
    description: 'Een zeldzame avatar met zilveren vonkjes.',
    price: 820,
    itemType: 'avatarSkin',
    rarity: 'platinum',
    sortOrder: 90,
    imageUrl: avatarImage(9),
    previewStyle: { accent: '#d7e2f2', motion: 'platinum', sparkle: 'platinum' }
  },
  {
    itemId: 'avatar-10',
    title: 'Helix Legende',
    description: 'De hoogste avatarupgrade voor leerlingen die lang sparen.',
    price: 1100,
    itemType: 'avatarSkin',
    rarity: 'legendary',
    sortOrder: 100,
    imageUrl: avatarImage(10),
    previewStyle: { accent: '#f3b83f', motion: 'legendary', sparkle: 'gold' }
  }
];

export const getRewardTypeLabel = (itemType = '') => (
  TOKEN_SHOP_TYPE_LABELS[itemType] || 'Gadget'
);

export const getRewardRarityLabel = (rarity = '') => (
  TOKEN_SHOP_RARITY_LABELS[rarity] || TOKEN_SHOP_RARITY_LABELS.common
);

export const normalizeLoadout = (loadout = {}) => ({
  activeAvatarFrameId: String(loadout.activeAvatarFrameId || ''),
  activeAvatarSkinId: String(loadout.activeAvatarSkinId || STARTER_AVATAR_ITEM.id),
  activeProfileBannerId: String(loadout.activeProfileBannerId || ''),
  activeVictoryEffectId: String(loadout.activeVictoryEffectId || ''),
  activeTitleBadgeId: String(loadout.activeTitleBadgeId || ''),
  activePinIds: Array.isArray(loadout.activePinIds)
    ? loadout.activePinIds.map((id) => String(id || '')).filter(Boolean).slice(0, 3)
    : []
});

export const getActiveRewardItems = ({ loadout = {}, items = [] } = {}) => {
  const normalized = normalizeLoadout(loadout);
  const itemById = new Map([
    [STARTER_AVATAR_ITEM.id, STARTER_AVATAR_ITEM],
    ...items.map((item) => [item.id || item.itemId, item])
  ]);
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
