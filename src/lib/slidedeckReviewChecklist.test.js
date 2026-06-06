import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SLIDEDECK_REVIEW_CHECKLIST_ITEMS,
  isSlidedeckReviewChecklistComplete,
  normalizeSlidedeckReviewChecklist
} from './slidedeckReviewChecklist.js';

test('normalizeSlidedeckReviewChecklist keeps known review checks only', () => {
  const checklist = normalizeSlidedeckReviewChecklist({
    sourceFaithful: true,
    answersChecked: 1,
    unknown: true
  });

  assert.deepEqual(checklist, {
    sourceFaithful: true,
    answersChecked: true,
    languageLevelChecked: false,
    privacyChecked: false
  });
});

test('isSlidedeckReviewChecklistComplete requires every checklist item', () => {
  const complete = Object.fromEntries(SLIDEDECK_REVIEW_CHECKLIST_ITEMS.map((item) => [item.id, true]));

  assert.equal(isSlidedeckReviewChecklistComplete(complete), true);
  assert.equal(isSlidedeckReviewChecklistComplete({ ...complete, privacyChecked: false }), false);
});
