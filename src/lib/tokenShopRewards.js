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
  description: 'De eerste badge die automatisch voor iedere leerling klaarstaat.',
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
    title: 'Bronzen Badge',
    description: 'Een warme eerste upgrade voor leerlingen die op gang komen.',
    price: 50,
    itemType: 'avatarSkin',
    rarity: 'common',
    sortOrder: 20,
    imageUrl: avatarImage(2),
    previewStyle: { accent: '#c47a2c', motion: 'shine', sparkle: 'bronze' }
  },
  {
    itemId: 'avatar-3',
    title: 'Zilveren Badge',
    description: 'Een glanzende zilveren badge voor de volgende stap.',
    price: 90,
    itemType: 'avatarSkin',
    rarity: 'common',
    sortOrder: 30,
    imageUrl: avatarImage(3),
    previewStyle: { accent: '#94a3b8', motion: 'twinkle', sparkle: 'silver' }
  },
  {
    itemId: 'avatar-4',
    title: 'Gouden Badge',
    description: 'Een opvallende gouden badge voor leerlingen die goed sparen.',
    price: 150,
    itemType: 'avatarSkin',
    rarity: 'rare',
    sortOrder: 40,
    imageUrl: avatarImage(4),
    previewStyle: { accent: '#2563eb', motion: 'pulse', sparkle: 'blue' }
  },
  {
    itemId: 'avatar-5',
    title: 'Ster Badge',
    description: 'Een stralende badge met extra sterrenglans.',
    price: 230,
    itemType: 'avatarSkin',
    rarity: 'rare',
    sortOrder: 50,
    imageUrl: avatarImage(5),
    previewStyle: { accent: '#f6b72f', motion: 'star', sparkle: 'gold' }
  },
  {
    itemId: 'avatar-6',
    title: 'Master Badge',
    description: 'Een groene meesterbadge voor leerlingen die stevig doorgroeien.',
    price: 330,
    itemType: 'avatarSkin',
    rarity: 'epic',
    sortOrder: 60,
    imageUrl: avatarImage(6),
    previewStyle: { accent: '#0f8a4b', motion: 'leaf', sparkle: 'green' }
  },
  {
    itemId: 'avatar-7',
    title: 'Legend Badge',
    description: 'Een paarse legendebadge met veel sprankeling.',
    price: 460,
    itemType: 'avatarSkin',
    rarity: 'legendary',
    sortOrder: 70,
    imageUrl: avatarImage(7),
    previewStyle: { accent: '#7c3aed', motion: 'orbit', sparkle: 'violet' }
  },
  {
    itemId: 'avatar-8',
    title: 'Kosmos Badge',
    description: 'Een kosmische badge met blauwe sterrenenergie.',
    price: 620,
    itemType: 'avatarSkin',
    rarity: 'platinum',
    sortOrder: 80,
    imageUrl: avatarImage(8),
    previewStyle: { accent: '#2563eb', motion: 'orbit', sparkle: 'blue' }
  },
  {
    itemId: 'avatar-9',
    title: 'Diamant Badge',
    description: 'Een zeldzame diamantbadge met heldere schittering.',
    price: 820,
    itemType: 'avatarSkin',
    rarity: 'platinum',
    sortOrder: 90,
    imageUrl: avatarImage(9),
    previewStyle: { accent: '#d7e2f2', motion: 'crystal', sparkle: 'platinum' }
  },
  {
    itemId: 'avatar-10',
    title: 'Platinum Badge',
    description: 'De hoogste badge met zilveren platinumglans.',
    price: 1100,
    itemType: 'avatarSkin',
    rarity: 'platinum',
    sortOrder: 100,
    imageUrl: avatarImage(10),
    previewStyle: { accent: '#c7d7f2', motion: 'platinum', sparkle: 'platinum' }
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
