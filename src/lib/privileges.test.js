import test from 'node:test';
import assert from 'node:assert/strict';
import { eventActief, magPrivilegeAanvragen, schooljaarSleutel, STANDAARD_PRIVILEGES } from './privileges.js';

test('schooljaar loopt van 1 augustus tot en met 31 juli', () => {
  assert.equal(schooljaarSleutel(new Date('2026-09-23T10:00:00Z')), '2026-2027');
  assert.equal(schooljaarSleutel(new Date('2027-07-31T10:00:00Z')), '2026-2027');
  assert.equal(schooljaarSleutel(new Date('2027-08-01T10:00:00Z')), '2027-2028');
});

test('privileges: 1 per week, voorraad per klas, en DJ hooguit 2 per schooljaar', () => {
  const dj = STANDAARD_PRIVILEGES.find((item) => item.id === 'privilege-dj');
  const muziek = STANDAARD_PRIVILEGES.find((item) => item.id === 'privilege-muziek');
  const basis = { week: '2026-W39', schooljaar: '2026-2027' };

  assert.equal(magPrivilegeAanvragen({ ...basis, item: muziek }).mag, true);
  assert.equal(magPrivilegeAanvragen({ ...basis, item: muziek, eigen: [{ week: '2026-W39', status: 'aangevraagd' }] }).mag, false);
  assert.equal(magPrivilegeAanvragen({ ...basis, item: muziek, eigen: [{ week: '2026-W39', status: 'afgewezen' }] }).mag, true, 'afgewezen telt niet');
  const vol = [1, 2, 3].map(() => ({ status: 'goedgekeurd' }));
  assert.equal(magPrivilegeAanvragen({ ...basis, item: muziek, klasDezeWeek: vol }).mag, false);
  const tweeKeerDj = [{ itemId: 'privilege-dj', schooljaar: '2026-2027', week: '2026-W10', status: 'ingewisseld' }, { itemId: 'privilege-dj', schooljaar: '2026-2027', week: '2026-W20', status: 'goedgekeurd' }];
  assert.equal(magPrivilegeAanvragen({ ...basis, item: dj, eigen: tweeKeerDj }).mag, false);
  assert.equal(magPrivilegeAanvragen({ ...basis, schooljaar: '2027-2028', item: dj, eigen: tweeKeerDj }).mag, true);
});

test('event dubbele XP geldt van begin tot en met einde', () => {
  const event = { soort: 'dubbeleXp', van: '2026-09-28', tot: '2026-10-04' };
  assert.equal(eventActief(event, new Date('2026-09-27T12:00:00Z')), false);
  assert.equal(eventActief(event, new Date('2026-09-28T12:00:00Z')), true);
  assert.equal(eventActief(event, new Date('2026-10-04T20:00:00Z')), true);
  assert.equal(eventActief(event, new Date('2026-10-05T08:00:00Z')), false);
  assert.equal(eventActief(null), false);
});
