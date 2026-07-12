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
const shopImage = (name) => `/token-shop/${name}.png`;

export const VICTORY_EFFECT_KEYS = ['confetti', 'starfall', 'aurora'];

export const VICTORY_EFFECT_LABELS = {
  confetti: 'Confettiregen',
  starfall: 'Sterrenregen',
  aurora: 'Aurora golf'
};

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

export const DEFAULT_AVATAR_ITEMS = [
  {
    itemId: 'avatar-2',
    title: 'Bronzen Badge',
    description: 'Een warme eerste upgrade voor leerlingen die op gang komen.',
    price: 100,
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
    price: 180,
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
    price: 300,
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
    price: 460,
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
    price: 660,
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
    price: 920,
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
    price: 1240,
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
    price: 1640,
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
    price: 2200,
    itemType: 'avatarSkin',
    rarity: 'platinum',
    sortOrder: 100,
    imageUrl: avatarImage(10),
    previewStyle: { accent: '#c7d7f2', motion: 'platinum', sparkle: 'platinum' }
  }
];

export const DEFAULT_FRAME_ITEMS = [
  {
    itemId: 'frame-neon-blauw',
    title: 'Neon Blauw Frame',
    description: 'Een strakke blauwe gloedrand om je avatar, overal zichtbaar.',
    price: 150,
    itemType: 'avatarFrame',
    rarity: 'common',
    sortOrder: 210,
    imageUrl: shopImage('frame-neon-blauw'),
    previewStyle: { accent: '#38bdf8', motion: 'shine', sparkle: 'blue' }
  },
  {
    itemId: 'frame-smaragd',
    title: 'Smaragd Frame',
    description: 'Een groene edelsteenrand voor leerlingen die stug doorwerken.',
    price: 260,
    itemType: 'avatarFrame',
    rarity: 'rare',
    sortOrder: 220,
    imageUrl: shopImage('frame-smaragd'),
    previewStyle: { accent: '#10b981', motion: 'twinkle', sparkle: 'green' }
  },
  {
    itemId: 'frame-zonnegoud',
    title: 'Zonnegoud Frame',
    description: 'Een warme gouden rand die laat zien dat je flink gespaard hebt.',
    price: 420,
    itemType: 'avatarFrame',
    rarity: 'epic',
    sortOrder: 230,
    imageUrl: shopImage('frame-zonnegoud'),
    previewStyle: { accent: '#f59e0b', motion: 'shine', sparkle: 'gold' }
  },
  {
    itemId: 'frame-robijn',
    title: 'Robijn Frame',
    description: 'Een dieprode rand met flair, voor de echte verzamelaars.',
    price: 640,
    itemType: 'avatarFrame',
    rarity: 'platinum',
    sortOrder: 240,
    imageUrl: shopImage('frame-robijn'),
    previewStyle: { accent: '#e11d48', motion: 'pulse', sparkle: 'platinum' }
  },
  {
    itemId: 'frame-prisma',
    title: 'Prisma Frame',
    description: 'De zeldzaamste rand van de shop, met paarse prismaglans.',
    price: 900,
    itemType: 'avatarFrame',
    rarity: 'legendary',
    sortOrder: 250,
    imageUrl: shopImage('frame-prisma'),
    previewStyle: { accent: '#a855f7', motion: 'orbit', sparkle: 'violet' }
  }
];

export const DEFAULT_PIN_ITEMS = [
  {
    itemId: 'pin-superster',
    title: 'Superster Pin',
    description: 'Je allereerste pin, al te koop na één goede les.',
    price: 60,
    itemType: 'shopBadge',
    rarity: 'common',
    sortOrder: 310,
    imageUrl: shopImage('pin-superster'),
    previewStyle: { accent: '#f59e0b', motion: 'twinkle', sparkle: 'gold', shortLabel: 'STER' }
  },
  {
    itemId: 'pin-bliksem',
    title: 'Bliksem Pin',
    description: 'Voor snelle denkers die vlot door hun lesroute gaan.',
    price: 80,
    itemType: 'shopBadge',
    rarity: 'common',
    sortOrder: 320,
    imageUrl: shopImage('pin-bliksem'),
    previewStyle: { accent: '#0ea5e9', motion: 'twinkle', sparkle: 'blue', shortLabel: 'ZAP' }
  },
  {
    itemId: 'pin-breinbaas',
    title: 'Breinbaas Pin',
    description: 'Laat zien dat jij je hersens aan het werk zet.',
    price: 120,
    itemType: 'shopBadge',
    rarity: 'common',
    sortOrder: 330,
    imageUrl: shopImage('pin-breinbaas'),
    previewStyle: { accent: '#8b5cf6', motion: 'twinkle', sparkle: 'violet', shortLabel: 'BREIN' }
  },
  {
    itemId: 'pin-op-dreef',
    title: 'Op Dreef Pin',
    description: 'Voor wie lekker op dreef is en vraag na vraag goed maakt.',
    price: 160,
    itemType: 'shopBadge',
    rarity: 'rare',
    sortOrder: 340,
    imageUrl: shopImage('pin-op-dreef'),
    previewStyle: { accent: '#ef4444', motion: 'pulse', sparkle: 'gold', shortLabel: 'VUUR' }
  },
  {
    itemId: 'pin-goud',
    title: 'Gouden Pin',
    description: 'Een klassieker: puur goud voor trouwe spaarders.',
    price: 240,
    itemType: 'shopBadge',
    rarity: 'rare',
    sortOrder: 350,
    imageUrl: shopImage('pin-goud'),
    previewStyle: { accent: '#eab308', motion: 'shine', sparkle: 'gold', shortLabel: 'GOUD' }
  },
  {
    itemId: 'pin-ninja',
    title: 'Ninja Pin',
    description: 'Stil, scherp en supersnel: de pin voor oefenkanjers.',
    price: 320,
    itemType: 'shopBadge',
    rarity: 'epic',
    sortOrder: 360,
    imageUrl: shopImage('pin-ninja'),
    previewStyle: { accent: '#10b981', motion: 'twinkle', sparkle: 'green', shortLabel: 'NINJA' }
  },
  {
    itemId: 'pin-kosmos',
    title: 'Kosmos Pin',
    description: 'Een pin uit een ander sterrenstelsel, voor grote spaarders.',
    price: 480,
    itemType: 'shopBadge',
    rarity: 'platinum',
    sortOrder: 370,
    imageUrl: shopImage('pin-kosmos'),
    previewStyle: { accent: '#3b82f6', motion: 'orbit', sparkle: 'blue', shortLabel: 'KOSMOS' }
  },
  {
    itemId: 'pin-legende',
    title: 'Legende Pin',
    description: 'De zeldzaamste pin van HELIX. Wie hem draagt, hoort erbij.',
    price: 700,
    itemType: 'shopBadge',
    rarity: 'legendary',
    sortOrder: 380,
    imageUrl: shopImage('pin-legende'),
    previewStyle: { accent: '#a21caf', motion: 'orbit', sparkle: 'violet', shortLabel: 'LEGEND' }
  }
];

export const DEFAULT_BANNER_ITEMS = [
  {
    itemId: 'banner-oceaan',
    title: 'Oceaan Banner',
    description: 'Geeft je profiel een rustige blauwe oceaanuitstraling.',
    price: 200,
    itemType: 'profileBanner',
    rarity: 'common',
    sortOrder: 410,
    imageUrl: shopImage('banner-oceaan'),
    previewStyle: { accent: '#0ea5e9', motion: 'shine', sparkle: 'blue' }
  },
  {
    itemId: 'banner-zonsondergang',
    title: 'Zonsondergang Banner',
    description: 'Warme oranje gloed over je hele profielkaart.',
    price: 340,
    itemType: 'profileBanner',
    rarity: 'rare',
    sortOrder: 420,
    imageUrl: shopImage('banner-zonsondergang'),
    previewStyle: { accent: '#f97316', motion: 'shine', sparkle: 'gold' }
  },
  {
    itemId: 'banner-galaxy',
    title: 'Galaxy Banner',
    description: 'Je profiel als sterrenstelsel: diep paarsblauw met sterren.',
    price: 560,
    itemType: 'profileBanner',
    rarity: 'epic',
    sortOrder: 430,
    imageUrl: shopImage('banner-galaxy'),
    previewStyle: { accent: '#6366f1', motion: 'twinkle', sparkle: 'violet' }
  },
  {
    itemId: 'banner-erehal',
    title: 'Gouden Erehal Banner',
    description: 'De duurste banner van de shop: een gouden erehal-look.',
    price: 1000,
    itemType: 'profileBanner',
    rarity: 'legendary',
    sortOrder: 440,
    imageUrl: shopImage('banner-erehal'),
    previewStyle: { accent: '#d4af37', motion: 'shine', sparkle: 'gold' }
  }
];

export const DEFAULT_TITLE_ITEMS = [
  {
    itemId: 'titel-topper',
    title: 'Topper',
    description: 'Je eerste eigen titel onder je naam. Iedereen begint ergens.',
    price: 80,
    itemType: 'titleBadge',
    rarity: 'common',
    sortOrder: 510,
    imageUrl: shopImage('titel-topper'),
    previewStyle: { accent: '#8b5cf6', motion: 'shine', sparkle: 'violet' }
  },
  {
    itemId: 'titel-doorzetter',
    title: 'Doorzetter',
    description: 'Voor leerlingen die niet opgeven, ook als het lastig wordt.',
    price: 140,
    itemType: 'titleBadge',
    rarity: 'common',
    sortOrder: 520,
    imageUrl: shopImage('titel-doorzetter'),
    previewStyle: { accent: '#0ea5e9', motion: 'shine', sparkle: 'blue' }
  },
  {
    itemId: 'titel-leerheld',
    title: 'Leerheld',
    description: 'Draag deze titel als bewijs dat geen enkel vak jou bang maakt.',
    price: 240,
    itemType: 'titleBadge',
    rarity: 'rare',
    sortOrder: 530,
    imageUrl: shopImage('titel-leerheld'),
    previewStyle: { accent: '#10b981', motion: 'shine', sparkle: 'green' }
  },
  {
    itemId: 'titel-meesterspaarder',
    title: 'Meesterspaarder',
    description: 'Alleen voor wie tokens kan sparen zonder alles uit te geven.',
    price: 400,
    itemType: 'titleBadge',
    rarity: 'epic',
    sortOrder: 540,
    imageUrl: shopImage('titel-meesterspaarder'),
    previewStyle: { accent: '#f59e0b', motion: 'shine', sparkle: 'gold' }
  },
  {
    itemId: 'titel-klaskampioen',
    title: 'Klaskampioen',
    description: 'De titel waar de hele klas een beetje jaloers op is.',
    price: 640,
    itemType: 'titleBadge',
    rarity: 'platinum',
    sortOrder: 550,
    imageUrl: shopImage('titel-klaskampioen'),
    previewStyle: { accent: '#e11d48', motion: 'pulse', sparkle: 'platinum' }
  },
  {
    itemId: 'titel-legende-van-helix',
    title: 'Legende van HELIX',
    description: 'De allerhoogste titel. Hier spaar je een periode voor.',
    price: 1500,
    itemType: 'titleBadge',
    rarity: 'legendary',
    sortOrder: 560,
    imageUrl: shopImage('titel-legende-van-helix'),
    previewStyle: { accent: '#7c3aed', motion: 'orbit', sparkle: 'violet' }
  }
];

export const DEFAULT_VICTORY_EFFECT_ITEMS = [
  {
    itemId: 'effect-confetti',
    title: 'Confettiregen',
    description: 'Confetti zodra je een paragraaf afrondt of een reeks goed maakt.',
    price: 400,
    itemType: 'victoryEffect',
    rarity: 'rare',
    sortOrder: 610,
    imageUrl: shopImage('effect-confetti'),
    previewStyle: { accent: '#f43f5e', motion: 'pulse', sparkle: 'gold', effect: 'confetti' }
  },
  {
    itemId: 'effect-sterrenregen',
    title: 'Sterrenregen',
    description: 'Gouden sterren dwarrelen over je scherm bij elke afgeronde paragraaf.',
    price: 650,
    itemType: 'victoryEffect',
    rarity: 'epic',
    sortOrder: 620,
    imageUrl: shopImage('effect-sterrenregen'),
    previewStyle: { accent: '#f59e0b', motion: 'twinkle', sparkle: 'gold', effect: 'starfall' }
  },
  {
    itemId: 'effect-aurora',
    title: 'Aurora Golf',
    description: 'Een rustige noorderlicht-golf als bekroning op je paragraaf.',
    price: 950,
    itemType: 'victoryEffect',
    rarity: 'platinum',
    sortOrder: 630,
    imageUrl: shopImage('effect-aurora'),
    previewStyle: { accent: '#22d3ee', motion: 'orbit', sparkle: 'blue', effect: 'aurora' }
  }
];

export const DEFAULT_TOKEN_SHOP_ITEMS = [
  ...DEFAULT_AVATAR_ITEMS,
  ...DEFAULT_FRAME_ITEMS,
  ...DEFAULT_PIN_ITEMS,
  ...DEFAULT_BANNER_ITEMS,
  ...DEFAULT_TITLE_ITEMS,
  ...DEFAULT_VICTORY_EFFECT_ITEMS
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
