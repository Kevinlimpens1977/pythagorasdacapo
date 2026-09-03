import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildRetryItemProgressPayload,
  buildRetryRoundPlan,
  describeRetryRound,
  isRetryCandidate,
  resolveRetryPolicy
} from './assessmentRetryRound.js';
import { buildAssessmentItemVoortgangUpdate, summarizeAssessmentItemProgress } from './voortgangPayload.js';

const quiz = (extra = {}) => ({ id: 'quiz-1', type: 'quiz', content: { attemptPolicy: { maxAttempts: null }, ...extra } });
const items = [{ id: 'v1' }, { id: 'v2' }, { id: 'v3' }];
const klaar = (isCorrect, extra = {}) => ({
  completed: true,
  isCorrect,
  score: isCorrect ? 3 : 0,
  maxScore: 3,
  attempts: 1,
  aiHelpCount: 0,
  resultTier: isCorrect ? 'independent' : 'failed',
  ronde1: { isCorrect, score: isCorrect ? 3 : 0, maxScore: 3, attempts: 1, aiHelpCount: 0 },
  ...extra
});

test('de herkansing staat standaard aan voor quiz en toets, en nooit voor andere blokken', () => {
  assert.deepEqual(resolveRetryPolicy(quiz()), { enabled: true, aiHelp: true });
  assert.deepEqual(resolveRetryPolicy({ type: 'toets', content: {} }), { enabled: true, aiHelp: true });
  assert.deepEqual(resolveRetryPolicy(quiz({ retryPolicy: { enabled: false } })), { enabled: false, aiHelp: false });
  assert.deepEqual(resolveRetryPolicy(quiz({ retryPolicy: { aiHelp: false } })), { enabled: true, aiHelp: false });
  assert.deepEqual(resolveRetryPolicy({ type: 'question' }), { enabled: false, aiHelp: false });
});

test('alleen een afgeronde foute vraag die niet bij de docent ligt is een herkansingskandidaat', () => {
  assert.equal(isRetryCandidate(klaar(false)), true);
  assert.equal(isRetryCandidate(klaar(true)), false);
  assert.equal(isRetryCandidate({ completed: false, isCorrect: false }), false);
  assert.equal(isRetryCandidate(klaar(false, { attemptStatus: 'pending_teacher_review' })), false);
  // Oud record zonder bevroren eerste ronde: de bovenste velden tellen.
  assert.equal(isRetryCandidate({ completed: true, isCorrect: false }), true);
});

test('het herkansingsplan wacht tot ronde 1 klaar is en telt daarna alleen de foute vragen', () => {
  const nogBezig = buildRetryRoundPlan({ block: quiz(), items, records: { v1: klaar(false), v2: klaar(true) } });
  assert.equal(nogBezig.ronde1Klaar, false);
  assert.equal(nogBezig.beschikbaar, false);

  const plan = buildRetryRoundPlan({ block: quiz(), items, records: { v1: klaar(false), v2: klaar(true), v3: klaar(false) } });
  assert.equal(plan.ronde1Klaar, true);
  assert.equal(plan.beschikbaar, true);
  assert.deepEqual(plan.kandidaatIds, ['v1', 'v3']);
  assert.equal(plan.herkansingKlaar, false);

  const uit = buildRetryRoundPlan({ block: quiz({ retryPolicy: { enabled: false } }), items, records: { v1: klaar(false), v2: klaar(true), v3: klaar(false) } });
  assert.equal(uit.beschikbaar, false);

  const allesGoed = buildRetryRoundPlan({ block: quiz(), items, records: { v1: klaar(true), v2: klaar(true), v3: klaar(true) } });
  assert.equal(allesGoed.beschikbaar, false);
});

test('een goede herkansing werkt de score na hulp bij en laat de eerste score staan', () => {
  const record = klaar(false, { aiHelpCount: 0 });
  const { payload, outcome } = buildRetryItemProgressPayload({
    block: quiz(),
    item: { id: 'v1' },
    record,
    answer: 'v1-b',
    isCorrect: true,
    aiHelpCount: 2,
    score: { score: 3, maxScore: 3 },
    now: '2026-09-03T08:00:00.000Z'
  });

  assert.equal(outcome.completed, true);
  assert.equal(payload.isCorrect, true);
  assert.equal(payload.resultTier, 'guided');
  assert.equal(payload.completionReason, 'retry_correct');
  assert.equal(payload.herkansing.attempts, 1);
  assert.equal(payload.herkansing.isCorrect, true);
  assert.equal(payload.herkansing.aiHelpCount, 2);
  assert.equal(payload.attemptEntry.round, 2);

  const update = buildAssessmentItemVoortgangUpdate({
    userId: 'u1', blockId: 'quiz-1', itemId: 'v1', paragraafId: 'p1', klasId: 'k1',
    data: payload, existingData: record, timestamp: 'ts'
  });
  assert.equal(update.isCorrect, true);
  assert.equal(update.score, 3);
  assert.deepEqual(update.ronde1, record.ronde1);
  assert.equal(update.herkansing.completed, true);
});

test('een foute herkansing houdt de eerste stand vast totdat de pogingen op zijn', () => {
  const record = klaar(false);
  const eerste = buildRetryItemProgressPayload({
    block: quiz(), item: { id: 'v1' }, record, answer: 'v1-c', isCorrect: false, aiHelpCount: 0,
    score: { score: 0, maxScore: 3 }, now: '2026-09-03T08:00:00.000Z'
  });
  assert.equal(eerste.outcome.completed, false);
  assert.equal(eerste.payload.completed, undefined);
  assert.equal(eerste.payload.isCorrect, undefined);
  assert.equal(eerste.payload.herkansing.attempts, 1);
  assert.equal(eerste.payload.herkansing.completed, false);

  const update = buildAssessmentItemVoortgangUpdate({
    userId: 'u1', blockId: 'quiz-1', itemId: 'v1', paragraafId: 'p1', klasId: 'k1',
    data: eerste.payload, existingData: record, timestamp: 'ts'
  });
  // De bovenste stand blijft die van ronde 1 (fout), de herkansing loopt.
  assert.equal(update.isCorrect, false);
  assert.equal(update.completed, true);
  assert.equal(update.herkansing.attempts, 1);
});

test('een record van vóór de herkansingsronde krijgt alsnog zijn bevroren eerste stand', () => {
  const oud = { completed: true, isCorrect: false, score: 0, maxScore: 3, attempts: 2, aiHelpCount: 0, resultTier: 'failed' };
  const { payload } = buildRetryItemProgressPayload({
    block: quiz(), item: { id: 'v1' }, record: oud, answer: 'v1-b', isCorrect: true, score: { score: 3, maxScore: 3 }
  });
  assert.equal(payload.ronde1.isCorrect, false);
  assert.equal(payload.ronde1.attempts, 2);
  const update = buildAssessmentItemVoortgangUpdate({
    userId: 'u1', blockId: 'quiz-1', itemId: 'v1', paragraafId: 'p1', klasId: 'k1',
    data: payload, existingData: oud, timestamp: 'ts'
  });
  assert.equal(update.ronde1.isCorrect, false);
  assert.equal(update.isCorrect, true);
});

test('de blokstand toont eerste score en herkansing naast elkaar', () => {
  const summary = summarizeAssessmentItemProgress({
    items,
    records: {
      v1: klaar(true),
      v2: { ...klaar(false), isCorrect: true, score: 3, herkansing: { completed: true, isCorrect: true, aiHelpCount: 1, attempts: 1 } },
      v3: { ...klaar(false), herkansing: { completed: false, isCorrect: false, aiHelpCount: 0, attempts: 1 } }
    }
  });
  assert.deepEqual(summary.eersteScore, { itemCount: 3, itemsCorrect: 1, score: 3, maxScore: 9 });
  assert.deepEqual(summary.herkansing, { itemsHerkanst: 2, itemsAfgerond: 1, itemsGoed: 1, aiHelpCount: 1, completed: false });
  assert.equal(summary.itemsCorrect, 2);

  const tekst = describeRetryRound({ summary });
  assert.equal(tekst.eersteTekst, '1 van 3 goed');
  assert.equal(tekst.herkansingTekst, '1 van 2 herkanste vragen goed (1x Digidocent)');
  assert.equal(tekst.naHerkansingTekst, '2 van 3 goed');
});

test('ronde 1 wordt eenmalig bevroren zodra een vraag voor het eerst af is', () => {
  const eerste = buildAssessmentItemVoortgangUpdate({
    userId: 'u1', blockId: 'quiz-1', itemId: 'v1', paragraafId: 'p1', klasId: 'k1',
    data: { completed: true, isCorrect: false, attempts: 2, score: 0, maxScore: 3, resultTier: 'failed' },
    existingData: {}, timestamp: 'ts'
  });
  assert.deepEqual(eerste.ronde1, { isCorrect: false, score: 0, maxScore: 3, attempts: 2, aiHelpCount: 0, resultTier: 'failed', attemptStatus: 'completed' });

  const nogNietAf = buildAssessmentItemVoortgangUpdate({
    userId: 'u1', blockId: 'quiz-1', itemId: 'v1', paragraafId: 'p1', klasId: 'k1',
    data: { completed: false, isCorrect: false, attempts: 1 }, existingData: {}, timestamp: 'ts'
  });
  assert.equal(nogNietAf.ronde1, undefined);
});
