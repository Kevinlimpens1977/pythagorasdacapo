import test from 'node:test';
import assert from 'node:assert/strict';
import { splitArchivedStudents } from './studentArchiveUtils.js';

test('gearchiveerde leerlingen gaan naar het archief, de rest blijft actief', () => {
  const { actief, archief } = splitArchivedStudents([
    { uid: 'a', isArchived: true },
    { uid: 'b' },
    { uid: 'c', isArchived: false }
  ]);
  assert.deepEqual(actief.map((s) => s.uid), ['b', 'c']);
  assert.deepEqual(archief.map((s) => s.uid), ['a']);
});

test('lege of ontbrekende invoer geeft twee lege lijsten', () => {
  assert.deepEqual(splitArchivedStudents(), { actief: [], archief: [] });
  assert.deepEqual(splitArchivedStudents([]), { actief: [], archief: [] });
});
