import test from 'node:test';
import assert from 'node:assert/strict';
import {
  enrichStudentsWithClassName,
  filterStudentAccounts
} from './studentAccountUtils.js';

test('enrichStudentsWithClassName attaches class labels when available', () => {
  const students = [
    { uid: 's1', displayName: 'Ada', email: 'ada@example.com', klasId: 'k1' },
    { uid: 's2', displayName: 'Ben', email: 'ben@example.com' }
  ];
  const klassen = [{ id: 'k1', name: 'VMBO 1A' }];

  assert.deepEqual(enrichStudentsWithClassName(students, klassen), [
    { uid: 's1', displayName: 'Ada', email: 'ada@example.com', klasId: 'k1', klasName: 'VMBO 1A' },
    { uid: 's2', displayName: 'Ben', email: 'ben@example.com', klasName: 'Geen klas' }
  ]);
});

test('filterStudentAccounts searches name, email and class', () => {
  const students = [
    { displayName: 'Ada Lovelace', email: 'ada@example.com', klasName: 'VMBO 1A' },
    { displayName: 'Ben', email: 'ben@example.com', klasName: 'HAVO 2' }
  ];

  assert.equal(filterStudentAccounts(students, 'vmbo').length, 1);
  assert.equal(filterStudentAccounts(students, 'example').length, 2);
  assert.equal(filterStudentAccounts(students, 'lovelace')[0].displayName, 'Ada Lovelace');
});
