import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_TOKEN_SHOP_ITEMS,
  getActiveRewardItems,
  getRewardTypeLabel,
  normalizeLoadout
} from './tokenShopRewards.js';

test('default token shop catalog is empty so admins build the avatar shop manually', () => {
  assert.deepEqual(DEFAULT_TOKEN_SHOP_ITEMS, []);
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
    { id: 'frame-1', title: 'Frame', itemType: 'avatarFrame' },
    { id: 'pin-1', title: 'Pin 1', itemType: 'shopBadge' },
    { id: 'pin-2', title: 'Pin 2', itemType: 'shopBadge' }
  ];

  assert.deepEqual(getActiveRewardItems({
    loadout: { activeAvatarFrameId: 'frame-1', activePinIds: ['pin-2', 'missing'] },
    items
  }).map((item) => item.id), ['frame-1', 'pin-2']);
});

test('getRewardTypeLabel returns learner-friendly labels', () => {
  assert.equal(getRewardTypeLabel('avatarSkin'), 'Avatar');
  assert.equal(getRewardTypeLabel('shopBadge'), 'Pin');
  assert.equal(getRewardTypeLabel('unknown'), 'Gadget');
});
