import test from 'node:test';
import assert from 'node:assert/strict';

import { isTestaccount, testaccountIds, zonderTestaccounts } from './testaccounts.js';

test('isTestaccount herkent alleen de expliciete vlag', () => {
  assert.equal(isTestaccount({ isTestaccount: true }), true);
  assert.equal(isTestaccount({ isTestaccount: false }), false);
  assert.equal(isTestaccount({ isTestaccount: 'true' }), false);
  assert.equal(isTestaccount({}), false);
  assert.equal(isTestaccount(null), false);
});

test('zonderTestaccounts laat gewone leerlingen staan', () => {
  const lijst = [
    { id: 'leerling-1' },
    { id: 'testleerling-h1k2', isTestaccount: true },
    { id: 'leerling-2', isTestaccount: false }
  ];

  assert.deepEqual(zonderTestaccounts(lijst).map((l) => l.id), ['leerling-1', 'leerling-2']);
  assert.deepEqual(zonderTestaccounts([]), []);
  assert.deepEqual(zonderTestaccounts(null), []);
});

test('testaccountIds geeft de uids terug, ook als die als uid staan', () => {
  const lijst = [
    { id: 'leerling-1' },
    { id: 'testleerling-h1k2', isTestaccount: true },
    { uid: 'testleerling-h1b1', isTestaccount: true },
    { isTestaccount: true }
  ];

  assert.deepEqual(testaccountIds(lijst), ['testleerling-h1k2', 'testleerling-h1b1']);
  assert.deepEqual(testaccountIds([]), []);
});
