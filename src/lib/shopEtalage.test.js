import test from 'node:test';
import assert from 'node:assert/strict';
import { dagenTotNieuweEtalage, etalageVoorWeek, spaarVoortgang } from './shopEtalage.js';

const items = [
  ...Array.from({ length: 5 }, (_, i) => ({ id: `pin-${i}`, itemType: 'shopBadge' })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `frame-${i}`, itemType: 'avatarFrame' })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `titel-${i}`, itemType: 'titleBadge' })),
  { id: 'uit', itemType: 'shopBadge', enabled: false }
];

test('etalage: 6 items, vast per week, anders in een andere week', () => {
  const a = etalageVoorWeek(items, { week: '2026-W39' });
  assert.equal(a.length, 6);
  assert.deepEqual(etalageVoorWeek(items, { week: '2026-W39' }).map((i) => i.id), a.map((i) => i.id));
  const b = etalageVoorWeek(items, { week: '2026-W40' });
  assert.notDeepEqual(b.map((i) => i.id), a.map((i) => i.id));
});

test('etalage: hooguit twee per soort, geen uitgeschakelde of al gekochte items', () => {
  const a = etalageVoorWeek(items, { week: '2026-W39', bezit: new Set(['pin-0', 'pin-1']) });
  const perSoort = {};
  a.forEach((i) => { perSoort[i.itemType] = (perSoort[i.itemType] || 0) + 1; });
  assert.ok(Object.values(perSoort).every((n) => n <= 2));
  assert.ok(!a.some((i) => i.id === 'uit' || i.id === 'pin-0' || i.id === 'pin-1'));
});

test('etalage: elk item komt binnen een half jaar een keer voorbij', () => {
  const gezien = new Set();
  for (let w = 1; w <= 26; w += 1) {
    etalageVoorWeek(items, { week: `2027-W${String(w).padStart(2, '0')}` }).forEach((i) => gezien.add(i.id));
  }
  assert.equal(gezien.size, 15);
});

test('dagen tot nieuwe etalage en spaarvoortgang', () => {
  assert.equal(dagenTotNieuweEtalage(new Date('2026-09-23T10:00:00Z')), 5); // woensdag -> maandag
  assert.equal(dagenTotNieuweEtalage(new Date('2026-09-27T10:00:00Z')), 1); // zondag
  assert.equal(spaarVoortgang(50, 200), 25);
  assert.equal(spaarVoortgang(500, 200), 100);
  assert.equal(spaarVoortgang(10, 0), 100);
});
