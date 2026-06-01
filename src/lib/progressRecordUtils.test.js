import test from 'node:test';
import assert from 'node:assert/strict';
import { groupProgressRecordsByStudent } from './progressRecordUtils.js';

test('groupProgressRecordsByStudent groups records by userId and ignores orphan records', () => {
  assert.deepEqual(
    groupProgressRecordsByStudent([
      { id: 'r1', userId: 'student-1', blockId: 'b1' },
      { id: 'r2', userId: 'student-2', blockId: 'b2' },
      { id: 'r3', userId: 'student-1', blockId: 'b3' },
      { id: 'orphan', blockId: 'b4' }
    ]),
    {
      'student-1': [
        { id: 'r1', userId: 'student-1', blockId: 'b1' },
        { id: 'r3', userId: 'student-1', blockId: 'b3' }
      ],
      'student-2': [
        { id: 'r2', userId: 'student-2', blockId: 'b2' }
      ]
    }
  );
});
