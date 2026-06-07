import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_TOKEN_SHOP_ITEMS,
  getActiveRewardItems,
  getRewardTypeLabel,
  normalizeLoadout
} from './tokenShopRewards.js';

test('default token shop catalog is subject-neutral and covers visible reward types', () => {
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.length >= 18, true);
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.every((item) => item.title && item.price > 0 && item.imageUrl), true);
  assert.deepEqual(
    [...new Set(DEFAULT_TOKEN_SHOP_ITEMS.map((item) => item.itemType))].sort(),
    ['avatarFrame', 'avatarSkin', 'profileBanner', 'shopBadge', 'titleBadge', 'victoryEffect'].sort()
  );

  const forbiddenSubjectWords = /(AI|Excel|Mediawijs|Debug|Data|Bron|Microsoft|Wachtwoord|Formule)/i;
  assert.equal(DEFAULT_TOKEN_SHOP_ITEMS.some((item) => forbiddenSubjectWords.test(`${item.title} ${item.description}`)), false);
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
