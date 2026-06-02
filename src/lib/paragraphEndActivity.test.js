import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildParagraphEndActivity,
  buildParagraphEndProgressPayload
} from './paragraphEndActivity.js';

test('buildParagraphEndActivity creates remediation from failed question records', () => {
  const activity = buildParagraphEndActivity({
    kind: 'remediation',
    paragraaf: { title: 'Procenten' },
    records: [
      {
        blockTitle: 'Vraag 1',
        vraagTitle: '20 procent van 250',
        teacherFeedbackSummary: 'verwisselt percentage en geheel',
        lastAssessment: { feedback: 'Je stap met 20 procent mist nog.' }
      }
    ]
  });

  assert.equal(activity.assignmentKind, 'remediation');
  assert.equal(activity.required, true);
  assert.ok(activity.explanation.includes('Procenten'));
  assert.equal(activity.tasks.length >= 2, true);
  assert.equal(activity.tasks.length <= 4, true);
});

test('buildParagraphEndActivity creates one required challenge for a green paragraph', () => {
  const activity = buildParagraphEndActivity({
    kind: 'challenge',
    paragraaf: { title: 'Digitale vaardigheden' },
    records: [
      { blockTitle: 'Vraag 1', vraagTitle: 'Computers en internet' }
    ]
  });

  assert.equal(activity.assignmentKind, 'challenge');
  assert.equal(activity.required, true);
  assert.equal(activity.maxAttempts, 1);
  assert.equal(activity.tasks.length, 1);
});

test('buildParagraphEndProgressPayload stores paragraph end results separately from core scores', () => {
  const payload = buildParagraphEndProgressPayload({
    activity: {
      assignmentKind: 'challenge',
      tasks: [{ prompt: 'Leg uit waarom dit handig is.' }]
    },
    answer: 'Omdat je dan sneller werkt.',
    assessment: {
      success: true,
      isCorrect: true,
      feedback: 'Prima onderbouwing.'
    }
  });

  assert.equal(payload.progressType, 'paragraphEnd');
  assert.equal(payload.assignmentKind, 'challenge');
  assert.equal(payload.completed, true);
  assert.equal(payload.isCorrect, true);
  assert.equal(payload.completionReason, 'challenge_completed');
  assert.equal(payload.attempts, 1);
});

test('buildParagraphEndProgressPayload can mark an incorrect challenge without changing core question records', () => {
  const payload = buildParagraphEndProgressPayload({
    activity: {
      assignmentKind: 'challenge',
      tasks: [{ prompt: 'Leg uit waarom dit handig is.' }]
    },
    answer: 'kort antwoord',
    assessment: {
      success: true,
      isCorrect: false,
      feedback: 'Je uitleg is nog te algemeen.'
    }
  });

  assert.equal(payload.progressType, 'paragraphEnd');
  assert.equal(payload.assignmentKind, 'challenge');
  assert.equal(payload.completed, true);
  assert.equal(payload.isCorrect, false);
  assert.equal(payload.resultTier, 'failed');
  assert.equal(payload.teacherSignal, 'challenge_feedback');
});
