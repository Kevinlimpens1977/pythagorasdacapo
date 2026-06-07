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

const rewardImage = (slug) => `/token-shop/rewards/${slug}.svg`;

export const DEFAULT_TOKEN_SHOP_ITEMS = [
  {
    itemId: 'gouden-starterframe',
    title: 'Gouden Starterframe',
    description: 'Geef je avatar een warme gouden rand.',
    price: 50,
    itemType: 'avatarFrame',
    rarity: 'common',
    sortOrder: 10,
    imageUrl: rewardImage('gouden-starterframe'),
    previewStyle: { accent: '#f3b83f', tone: 'gold' }
  },
  {
    itemId: 'neon-blauw-frame',
    title: 'Neonblauw Frame',
    description: 'Een frisse blauwe glow rond je profielfoto.',
    price: 125,
    itemType: 'avatarFrame',
    rarity: 'rare',
    sortOrder: 20,
    imageUrl: rewardImage('neon-blauw-frame'),
    previewStyle: { accent: '#3b82f6', tone: 'neon' }
  },
  {
    itemId: 'sterrennacht-frame',
    title: 'Sterrennacht Frame',
    description: 'Een rustig frame met kleine sterren.',
    price: 250,
    itemType: 'avatarFrame',
    rarity: 'epic',
    sortOrder: 30,
    imageUrl: rewardImage('sterrennacht-frame'),
    previewStyle: { accent: '#7c3aed', tone: 'stars' }
  },
  {
    itemId: 'robot-maatje',
    title: 'Robot Maatje',
    description: 'Een vriendelijke robotlook voor je avatar.',
    price: 100,
    itemType: 'avatarSkin',
    rarity: 'common',
    sortOrder: 40,
    imageUrl: rewardImage('robot-maatje'),
    previewStyle: { accent: '#94a3b8', tone: 'robot' }
  },
  {
    itemId: 'kosmosreiziger',
    title: 'Kosmosreiziger',
    description: 'Een vrolijke ruimtereiziger die bij elk vak past.',
    price: 120,
    itemType: 'avatarSkin',
    rarity: 'rare',
    sortOrder: 50,
    imageUrl: rewardImage('kosmosreiziger'),
    previewStyle: { accent: '#2563eb', tone: 'space' }
  },
  {
    itemId: 'bliksemsprinter',
    title: 'Bliksemsprinter',
    description: 'Een snelle, sportieve avatarstijl.',
    price: 180,
    itemType: 'avatarSkin',
    rarity: 'rare',
    sortOrder: 60,
    imageUrl: rewardImage('bliksemsprinter'),
    previewStyle: { accent: '#f59e0b', tone: 'bolt' }
  },
  {
    itemId: 'gouden-topper',
    title: 'Gouden Topper',
    description: 'Een opvallende premium avatarlook voor spaarders.',
    price: 300,
    itemType: 'avatarSkin',
    rarity: 'epic',
    sortOrder: 70,
    imageUrl: rewardImage('gouden-topper'),
    previewStyle: { accent: '#f3b83f', tone: 'premium' }
  },
  {
    itemId: 'sterrenstarter-pin',
    title: 'Sterrenstarter Pin',
    description: 'Een kleine ster voor je profiel.',
    price: 50,
    itemType: 'shopBadge',
    rarity: 'common',
    sortOrder: 80,
    imageUrl: rewardImage('sterrenstarter-pin'),
    previewStyle: { accent: '#2563eb', shortLabel: 'STAR' }
  },
  {
    itemId: 'bliksemboost-pin',
    title: 'Bliksemboost Pin',
    description: 'Laat zien dat jij graag tempo maakt.',
    price: 75,
    itemType: 'shopBadge',
    rarity: 'common',
    sortOrder: 90,
    imageUrl: rewardImage('bliksemboost-pin'),
    previewStyle: { accent: '#f59e0b', shortLabel: 'GO' }
  },
  {
    itemId: 'superster-pin',
    title: 'Superster Pin',
    description: 'Een zichtbare pin voor je naamkaart.',
    price: 90,
    itemType: 'shopBadge',
    rarity: 'rare',
    sortOrder: 100,
    imageUrl: rewardImage('superster-pin'),
    previewStyle: { accent: '#e44f70', shortLabel: 'TOP' }
  },
  {
    itemId: 'focus-pro-pin',
    title: 'Focus Pro Pin',
    description: 'Een rustige pin voor geconcentreerd werken.',
    price: 110,
    itemType: 'shopBadge',
    rarity: 'rare',
    sortOrder: 110,
    imageUrl: rewardImage('focus-pro-pin'),
    previewStyle: { accent: '#14956d', shortLabel: 'PRO' }
  },
  {
    itemId: 'teamtopper-pin',
    title: 'Teamtopper Pin',
    description: 'Een pin voor leerlingen die graag samen optrekken.',
    price: 125,
    itemType: 'shopBadge',
    rarity: 'rare',
    sortOrder: 120,
    imageUrl: rewardImage('teamtopper-pin'),
    previewStyle: { accent: '#7c3aed', shortLabel: 'TEAM' }
  },
  {
    itemId: 'geluksbrenger-pin',
    title: 'Geluksbrenger Pin',
    description: 'Een vrolijke pin die je profiel net iets extra geeft.',
    price: 140,
    itemType: 'shopBadge',
    rarity: 'epic',
    sortOrder: 130,
    imageUrl: rewardImage('geluksbrenger-pin'),
    previewStyle: { accent: '#f3b83f', shortLabel: 'LUCK' }
  },
  {
    itemId: 'kosmosbanner',
    title: 'Kosmosbanner',
    description: 'Geef je profielachtergrond een sterrenstijl.',
    price: 180,
    itemType: 'profileBanner',
    rarity: 'rare',
    sortOrder: 140,
    imageUrl: rewardImage('kosmosbanner'),
    previewStyle: { accent: '#2563eb', tone: 'space' }
  },
  {
    itemId: 'neonstad-banner',
    title: 'Neonstad Banner',
    description: 'Een moderne achtergrond met felle lichtlijnen.',
    price: 200,
    itemType: 'profileBanner',
    rarity: 'epic',
    sortOrder: 150,
    imageUrl: rewardImage('neonstad-banner'),
    previewStyle: { accent: '#7c3aed', tone: 'neon' }
  },
  {
    itemId: 'confetti-banner',
    title: 'Confetti Banner',
    description: 'Een feestelijke achtergrond voor je profiel.',
    price: 160,
    itemType: 'profileBanner',
    rarity: 'rare',
    sortOrder: 160,
    imageUrl: rewardImage('confetti-banner'),
    previewStyle: { accent: '#e44f70', tone: 'confetti' }
  },
  {
    itemId: 'muntregen',
    title: 'Muntregen',
    description: 'Een korte muntanimatie na een succesmoment.',
    price: 220,
    itemType: 'victoryEffect',
    rarity: 'epic',
    sortOrder: 170,
    imageUrl: rewardImage('muntregen'),
    previewStyle: { accent: '#f3b83f', tone: 'coins' }
  },
  {
    itemId: 'sterrensprong',
    title: 'Sterrensprong',
    description: 'Een subtiel stereffect na afronden.',
    price: 260,
    itemType: 'victoryEffect',
    rarity: 'epic',
    sortOrder: 180,
    imageUrl: rewardImage('sterrensprong'),
    previewStyle: { accent: '#2563eb', tone: 'stars' }
  },
  {
    itemId: 'focuskampioen-titel',
    title: 'Focuskampioen Titel',
    description: 'Een titel onder je naam voor geconcentreerd doorzetten.',
    price: 150,
    itemType: 'titleBadge',
    rarity: 'rare',
    sortOrder: 190,
    imageUrl: rewardImage('focuskampioen-titel'),
    previewStyle: { accent: '#14956d', shortLabel: 'FOCUS' }
  },
  {
    itemId: 'rustige-kracht-titel',
    title: 'Rustige Kracht Titel',
    description: 'Een titel voor leerlingen die steady blijven werken.',
    price: 150,
    itemType: 'titleBadge',
    rarity: 'rare',
    sortOrder: 200,
    imageUrl: rewardImage('rustige-kracht-titel'),
    previewStyle: { accent: '#64748b', shortLabel: 'KALM' }
  },
  {
    itemId: 'legendary-helix-set',
    title: 'Legendary HELIX Set',
    description: 'Een luxe set voor echte spaarders: frame, banner en pin in dezelfde stijl.',
    price: 750,
    itemType: 'profileBanner',
    rarity: 'legendary',
    sortOrder: 210,
    imageUrl: rewardImage('legendary-helix-set'),
    previewStyle: { accent: '#f3b83f', tone: 'legendary' }
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
