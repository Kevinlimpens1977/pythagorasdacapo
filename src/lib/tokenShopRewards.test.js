import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_TOKEN_SHOP_ITEMS,
  STARTER_AVATAR_ITEM,
  getActiveRewardItems,
  getRewardTypeLabel,
  normalizeLoadout
} from './tokenShopRewards.js';

test('default token shop catalog contains purchasable avatars 2 through 10', () => {
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.length, 9);
  assert.deepEqual(DEFAULT_TOKEN_SHOP_ITEMS.map((item) => item.itemId), [
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
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.every((item) => item.itemType === 'avatarSkin'), true);
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.every((item, index, items) => index === 0 || item.price > items[index - 1].price), true);
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.every((item) => item.imageUrl === `/token-shop/${item.sortOrder / 10}.png`), true);
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
