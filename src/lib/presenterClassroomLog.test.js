import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CLASSROOM_OUTCOMES,
  applyClassroomLogToObject,
  buildClassroomLogEntry,
  clearClassroomLogFromObject,
  feedbackStatusToClassroomOutcome,
  getClassroomLogSummary
} from './presenterClassroomLog.js';

test('board feedback maps to a lesson outcome, including "not checked"', () => {
  assert.equal(feedbackStatusToClassroomOutcome('correct'), CLASSROOM_OUTCOMES.GOED);
  assert.equal(feedbackStatusToClassroomOutcome('incorrect'), CLASSROOM_OUTCOMES.FOUT);
  assert.equal(feedbackStatusToClassroomOutcome('unknown'), CLASSROOM_OUTCOMES.NIET_NAGEKEKEN);
  assert.equal(feedbackStatusToClassroomOutcome('idle'), CLASSROOM_OUTCOMES.BESPROKEN);
});

test('an unknown outcome falls back to "besproken" instead of inventing a score', () => {
  const entry = buildClassroomLogEntry({ uitkomst: 'geweldig', behandeldOp: '2026-08-25T10:00:00.000Z' });
  assert.deepEqual(entry, {
    behandeld: true,
    behandeldOp: '2026-08-25T10:00:00.000Z',
    uitkomst: CLASSROOM_OUTCOMES.BESPROKEN
  });
});

test('the classroom log holds no student, class or token data', () => {
  const entry = buildClassroomLogEntry({ uitkomst: CLASSROOM_OUTCOMES.GOED });
  assert.deepEqual(Object.keys(entry).sort(), ['behandeld', 'behandeldOp', 'uitkomst']);

  const serialized = JSON.stringify(entry).toLowerCase();
  ['leerling', 'klas', 'token', 'score', 'attempt'].forEach((forbidden) => {
    assert.equal(serialized.includes(forbidden), false, `lesregistratie lekt ${forbidden}`);
  });
});

test('applying the log keeps the object identity when nothing changed', () => {
  const object = { id: 'obj-1', type: 'questionWindow' };
  const logged = applyClassroomLogToObject(object, { uitkomst: CLASSROOM_OUTCOMES.GOED });

  assert.equal(logged.classroomLog.uitkomst, CLASSROOM_OUTCOMES.GOED);
  assert.equal(logged.id, 'obj-1');
  assert.equal(logged.type, 'questionWindow');
  assert.equal(applyClassroomLogToObject(logged, { uitkomst: CLASSROOM_OUTCOMES.GOED }), logged);
});

test('resetting an answer removes the log again', () => {
  const logged = applyClassroomLogToObject({ id: 'obj-1' }, { uitkomst: CLASSROOM_OUTCOMES.FOUT });
  const cleared = clearClassroomLogFromObject(logged);

  assert.equal('classroomLog' in cleared, false);
  assert.equal(cleared.id, 'obj-1');
  assert.equal(clearClassroomLogFromObject(cleared), cleared);
});

test('the summary lists handled questions with their source ids', () => {
  const pages = [
    {
      id: 'page-1',
      objects: [
        { id: 'obj-a', type: 'rectangle' },
        {
          id: 'obj-b',
          type: 'questionWindow',
          data: { title: 'Vraag 3' },
          source: { block: { id: 'block-3' }, question: { id: 'vraag-3' } },
          classroomLog: { behandeld: true, uitkomst: CLASSROOM_OUTCOMES.GOED, behandeldOp: '2026-08-25T10:00:00.000Z' }
        }
      ]
    }
  ];

  assert.deepEqual(getClassroomLogSummary(pages), [
    {
      pageId: 'page-1',
      objectId: 'obj-b',
      title: 'Vraag 3',
      blockId: 'block-3',
      questionId: 'vraag-3',
      uitkomst: CLASSROOM_OUTCOMES.GOED,
      behandeldOp: '2026-08-25T10:00:00.000Z'
    }
  ]);
  assert.deepEqual(getClassroomLogSummary(), []);
});
