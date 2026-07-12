import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_AVATAR_ITEMS,
  DEFAULT_BANNER_ITEMS,
  DEFAULT_FRAME_ITEMS,
  DEFAULT_PIN_ITEMS,
  DEFAULT_TITLE_ITEMS,
  DEFAULT_TOKEN_SHOP_ITEMS,
  DEFAULT_VICTORY_EFFECT_ITEMS,
  STARTER_AVATAR_ITEM,
  VICTORY_EFFECT_KEYS,
  getActiveRewardItems,
  getRewardTypeLabel,
  normalizeLoadout
} from './tokenShopRewards.js';

test('default token shop catalog contains purchasable avatars 2 through 10', () => {
  assert.equal(DEFAULT_AVATAR_ITEMS.length, 9);
  assert.deepEqual(DEFAULT_AVATAR_ITEMS.map((item) => item.itemId), [
    'avatar-2',
    'avatar-3',
    'avatar-4',
    'avatar-5',
    'avatar-6',
    'avatar-7',
    'avatar-8',
    'avatar-9',
    'avatar-10'
  ]);
  assert.equal(DEFAULT_AVATAR_ITEMS.every((item) => item.itemType === 'avatarSkin'), true);
  assert.equal(DEFAULT_AVATAR_ITEMS.every((item, index, items) => index === 0 || item.price > items[index - 1].price), true);
  assert.equal(DEFAULT_AVATAR_ITEMS.every((item) => item.imageUrl === `/token-shop/${item.sortOrder / 10}.png`), true);
});

test('default token shop catalog covers every cosmetic category', () => {
  assert.equal(DEFAULT_FRAME_ITEMS.length, 5);
  assert.equal(DEFAULT_PIN_ITEMS.length, 8);
  assert.equal(DEFAULT_BANNER_ITEMS.length, 4);
  assert.equal(DEFAULT_TITLE_ITEMS.length, 6);
  assert.equal(DEFAULT_VICTORY_EFFECT_ITEMS.length, 3);
  assert.equal(
    DEFAULT_TOKEN_SHOP_ITEMS.length,
    DEFAULT_AVATAR_ITEMS.length + DEFAULT_FRAME_ITEMS.length + DEFAULT_PIN_ITEMS.length
      + DEFAULT_BANNER_ITEMS.length + DEFAULT_TITLE_ITEMS.length + DEFAULT_VICTORY_EFFECT_ITEMS.length
  );

  const itemIds = DEFAULT_TOKEN_SHOP_ITEMS.map((item) => item.itemId);
  assert.equal(new Set(itemIds).size, itemIds.length, 'itemIds moeten uniek zijn');

  assert.equal(DEFAULT_FRAME_ITEMS.every((item) => item.itemType === 'avatarFrame' && item.previewStyle.accent), true);
  assert.equal(DEFAULT_PIN_ITEMS.every((item) => item.itemType === 'shopBadge' && item.previewStyle.shortLabel), true);
  assert.equal(DEFAULT_BANNER_ITEMS.every((item) => item.itemType === 'profileBanner' && item.previewStyle.accent), true);
  assert.equal(DEFAULT_TITLE_ITEMS.every((item) => item.itemType === 'titleBadge'), true);
  assert.equal(
    DEFAULT_VICTORY_EFFECT_ITEMS.every((item) => item.itemType === 'victoryEffect' && VICTORY_EFFECT_KEYS.includes(item.previewStyle.effect)),
    true
  );

  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.every((item) => item.imageUrl && item.price > 0), true);
});

test('cheapest items stay reachable after roughly one full lesson of 200 tokens', () => {
  const cheapestPrice = Math.min(...DEFAULT_TOKEN_SHOP_ITEMS.map((item) => item.price));
  assert.equal(cheapestPrice <= 200, true, 'er moet iets te koop zijn na ongeveer één les');

  const priceCap = Math.max(...DEFAULT_TOKEN_SHOP_ITEMS.map((item) => item.price));
  assert.equal(priceCap <= 2200, true, 'topitem mag maximaal ~11 lessen sparen kosten');
});

test('starter avatar is the default active avatar without a database loadout', () => {
  assert.equal(STARTER_AVATAR_ITEM.id, 'avatar-1');
  assert.equal(normalizeLoadout({}).activeAvatarSkinId, 'avatar-1');
});

test('normalizeLoadout keeps only known active equipment fields', () => {
  assert.deepEqual(normalizeLoadout({
    activeAvatarFrameId: 'frame-1',
    activeAvatarSkinId: 'skin-1',
    activeProfileBannerId: 'banner-1',
    activeVictoryEffectId: 'effect-1',
    activeTitleBadgeId: 'title-1',
    activePinIds: ['pin-1', '', 'pin-2', 'pin-3', 'pin-4'],
    ignored: 'value'
  }), {
    activeAvatarFrameId: 'frame-1',
    activeAvatarSkinId: 'skin-1',
    activeProfileBannerId: 'banner-1',
    activeVictoryEffectId: 'effect-1',
    activeTitleBadgeId: 'title-1',
    activePinIds: ['pin-1', 'pin-2', 'pin-3']
  });
});

test('getActiveRewardItems resolves loadout ids to catalog items', () => {
  const items = [
    STARTER_AVATAR_ITEM,
    { id: 'frame-1', title: 'Frame', itemType: 'avatarFrame' },
    { id: 'pin-1', title: 'Pin 1', itemType: 'shopBadge' },
    { id: 'pin-2', title: 'Pin 2', itemType: 'shopBadge' }
  ];

  assert.deepEqual(getActiveRewardItems({
    loadout: { activeAvatarFrameId: 'frame-1', activePinIds: ['pin-2', 'missing'] },
    items
  }).map((item) => item.id), ['frame-1', 'avatar-1', 'pin-2']);
});

test('getRewardTypeLabel returns learner-friendly labels', () => {
  assert.equal(getRewardTypeLabel('avatarSkin'), 'Avatar');
  assert.equal(getRewardTypeLabel('shopBadge'), 'Pin');
  assert.equal(getRewardTypeLabel('unknown'), 'Gadget');
});
