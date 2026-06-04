import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BUG_REPORT_CATEGORIES,
  BUG_REPORT_STATUSES,
  buildStudentBugReportRecentQuerySpec,
  buildStudentBugReportPayload,
  getStudentBugReportRateLimitState,
  isOpenBugReportStatus
} from './studentBugReportUtils.js';

test('bug report categories stay concise for students', () => {
  assert.deepEqual(BUG_REPORT_CATEGORIES.map((item) => item.id), [
    'answer_model',
    'text_error',
    'unclear_assignment',
    'technical_problem',
    'broken_media',
    'other'
  ]);
});

test('bug report statuses support admin workflow', () => {
  assert.deepEqual(BUG_REPORT_STATUSES.map((item) => item.id), [
    'new',
    'in_progress',
    'resolved',
    'rejected'
  ]);
});

test('open bug report status is limited to unresolved admin work', () => {
  assert.equal(isOpenBugReportStatus('new'), true);
  assert.equal(isOpenBugReportStatus('in_progress'), true);
  assert.equal(isOpenBugReportStatus('resolved'), false);
  assert.equal(isOpenBugReportStatus('rejected'), false);
});

test('buildStudentBugReportPayload includes student identity and lesson context', () => {
  const payload = buildStudentBugReportPayload({
    category: 'answer_model',
    description: 'Het antwoordmodel klopt volgens mij niet.',
    currentUser: {
      uid: 'student-1',
      email: 'leerling@example.test',
      displayName: 'Jazmae Smit'
    },
    userData: {
      firstName: 'Jazmae',
      lastName: 'Smit',
      klasId: 'klas-1',
      studentNumber: '50123'
    },
    klasData: {
      id: 'klas-1',
      name: 'EOA'
    },
    context: {
      paragraafId: 'p-1',
      paragraafTitle: '1.1 Wat zijn digitale vaardigheden',
      blockId: 'block-4',
      blockTitle: 'Vraag 4',
      vraagId: 'vraag-4',
      vraagTitle: 'Vraag 4'
    },
    location: {
      href: 'http://localhost:5173/chapter/p-1',
      pathname: '/chapter/p-1'
    },
    now: new Date('2026-06-02T10:15:00.000Z')
  });

  assert.equal(payload.status, 'new');
  assert.equal(payload.category, 'answer_model');
  assert.equal(payload.student.uid, 'student-1');
  assert.equal(payload.student.displayName, 'Jazmae Smit');
  assert.equal(payload.klas.id, 'klas-1');
  assert.equal(payload.context.blockId, 'block-4');
  assert.equal(payload.page.href, 'http://localhost:5173/chapter/p-1');
  assert.equal(payload.clientCreatedAtMs, Date.parse('2026-06-02T10:15:00.000Z'));
});

test('getStudentBugReportRateLimitState allows at most three reports per ten minutes', () => {
  const now = Date.parse('2026-06-02T10:10:00.000Z');
  const state = getStudentBugReportRateLimitState({
    existingTimestamps: [
      now - 9 * 60 * 1000,
      now - 5 * 60 * 1000,
      now - 30 * 1000,
      now - 11 * 60 * 1000
    ],
    nowMs: now
  });

  assert.equal(state.allowed, false);
  assert.equal(state.recentCount, 3);
});

test('recent bug report query is scoped to the current student before reading Firestore', () => {
  const spec = buildStudentBugReportRecentQuerySpec({
    studentUid: ' student-1 ',
    sinceMs: 1_234,
    maxResults: 500
  });

  assert.deepEqual(spec.filters, [
    { field: 'student.uid', operator: '==', value: 'student-1' },
    { field: 'clientCreatedAtMs', operator: '>=', value: 1_234 }
  ]);
  assert.deepEqual(spec.orderBy, { field: 'clientCreatedAtMs', direction: 'desc' });
  assert.equal(spec.limit, 300);
});
