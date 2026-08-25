import test from 'node:test';
import assert from 'node:assert/strict';
import {
  appendAttemptHistory,
  ATTEMPT_HISTORY_LIMIT,
  buildAttemptHistoryEntry,
  buildPartScore,
  normalizeGradeParts
} from './voortgangAttemptLog.js';

test('normalizeGradeParts keeps the shape the shared grading layer returns', () => {
  assert.deepEqual(
    normalizeGradeParts([{ id: 'gap-1', label: 'Invulveld 1', isCorrect: true }, {}]),
    [
      { id: 'gap-1', label: 'Invulveld 1', isCorrect: true },
      { id: 'part-2', label: 'Onderdeel 2', isCorrect: false }
    ]
  );
  assert.deepEqual(normalizeGradeParts(null), []);
});

test('buildPartScore turns part statuses into a score the teacher can read', () => {
  assert.deepEqual(
    buildPartScore({
      parts: [
        { id: 'a', isCorrect: true },
        { id: 'b', isCorrect: false },
        { id: 'c', isCorrect: true }
      ],
      isCorrect: false
    }),
    { score: 2, maxScore: 3 }
  );
});

test('buildPartScore falls back to all-or-nothing without part statuses', () => {
  // Bij meerkeuze houdt de Cloud Function de deelstatussen bewust leeg tot het
  // geheel goed is; dan is alles-of-niets de enige eerlijke score.
  assert.deepEqual(buildPartScore({ parts: [], isCorrect: true }), { score: 1, maxScore: 1 });
  assert.deepEqual(buildPartScore({ parts: [], isCorrect: false }), { score: 0, maxScore: 1 });
});

test('buildPartScore scores nothing when the answer was never graded', () => {
  assert.deepEqual(
    buildPartScore({ parts: [{ id: 'a', isCorrect: true }], isCorrect: true, graded: false }),
    { score: 0, maxScore: 1 }
  );
});

test('attempt history is append-only, so a later success cannot hide the struggle', () => {
  const first = appendAttemptHistory([], buildAttemptHistoryEntry({
    attemptNr: 1,
    answer: 'option-2',
    isCorrect: false,
    aiHelpCount: 0,
    at: '2026-08-25T10:00:00.000Z'
  }));
  const second = appendAttemptHistory(first, buildAttemptHistoryEntry({
    attemptNr: 2,
    answer: 'option-1',
    isCorrect: true,
    aiHelpCount: 2,
    at: '2026-08-25T10:02:00.000Z'
  }));

  assert.equal(second.length, 2);
  assert.deepEqual(second.map((entry) => entry.attemptNr), [1, 2]);
  assert.deepEqual(second.map((entry) => entry.isCorrect), [false, true]);
  assert.equal(second[0].answer, 'option-2');
  assert.equal(second[1].aiHelpCount, 2);
  assert.equal(second[1].at, '2026-08-25T10:02:00.000Z');
});

test('attempt history keeps the existing log when there is nothing new to add', () => {
  const existing = [{ attemptNr: 1, answer: 'a', isCorrect: false }];
  assert.deepEqual(appendAttemptHistory(existing, null).map((entry) => entry.attemptNr), [1]);
});

test('attempt history stops growing at the safety limit', () => {
  let history = [];
  for (let attempt = 1; attempt <= ATTEMPT_HISTORY_LIMIT + 5; attempt += 1) {
    history = appendAttemptHistory(history, buildAttemptHistoryEntry({ attemptNr: attempt }));
  }

  assert.equal(history.length, ATTEMPT_HISTORY_LIMIT);
  assert.equal(history.at(-1).attemptNr, ATTEMPT_HISTORY_LIMIT + 5);
});
