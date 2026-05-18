import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAdminDashboardStats } from './adminDashboardStats.js';

test('buildAdminDashboardStats counts classes, students and unique active paragraphs', () => {
  const stats = buildAdminDashboardStats([
    {
      id: 'klas-1',
      enabledParagrafen: ['para-71', 'para-72'],
      students: [{ uid: 'student-1' }, { uid: 'student-2' }]
    },
    {
      id: 'klas-2',
      enabledParagrafen: ['para-72', 'para-73'],
      students: [{ uid: 'student-3' }]
    }
  ]);

  assert.deepEqual(stats, {
    classCount: 2,
    studentCount: 3,
    activeParagraphCount: 3
  });
});

test('buildAdminDashboardStats handles missing arrays as empty dashboard data', () => {
  const stats = buildAdminDashboardStats([
    { id: 'klas-1' },
    { id: 'klas-2', enabledParagrafen: null, students: null }
  ]);

  assert.deepEqual(stats, {
    classCount: 2,
    studentCount: 0,
    activeParagraphCount: 0
  });
});
