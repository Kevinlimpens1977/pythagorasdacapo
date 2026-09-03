/**
 * Herkansingsronde van een toets of quiz.
 *
 * Ronde 1: de leerling maakt alle vragen; de eerste score wordt per vraag
 * bevroren (`ronde1` in het itemrecord, zie voortgangPayload.js). Ronde 2: de
 * fout beantwoorde vragen komen terug, met Digidocent als hulp op de gemaakte
 * fout. De stand na de herkansing komt in `herkansing` op het itemrecord en
 * werkt de bovenste velden bij (score na hulp), zodat de docent beide ziet.
 *
 * Puur en zonder Firebase: de leerlingroute, het docentdashboard en de tests
 * delen precies deze regels.
 */

import { buildQuestionAttemptOutcome, resolveBlockMaxAttempts } from './studentQuestionAttemptFlow.js';

const asArray = (value) => (Array.isArray(value) ? value : []);
const count = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

/** Staat de herkansing aan voor dit blok, en mag Digidocent daarbij helpen? */
export const resolveRetryPolicy = (block = {}) => {
  const type = block?.type || '';
  const policy = block?.content?.retryPolicy || block?.retryPolicy || {};
  const isAssessment = type === 'quiz' || type === 'toets';
  return {
    enabled: isAssessment && policy.enabled !== false,
    aiHelp: isAssessment && policy.enabled !== false && policy.aiHelp !== false
  };
};

const isPendingReview = (record = {}) =>
  record?.attemptStatus === 'pending_teacher_review' || record?.resultTier === 'pending_teacher_review';

/** Komt deze vraag in aanmerking voor de herkansing? Fout in ronde 1, en niet bij de docent. */
export const isRetryCandidate = (record = null) =>
  Boolean(record)
  && record.completed === true
  && (record.ronde1 ? record.ronde1.isCorrect !== true : record.isCorrect !== true)
  && !isPendingReview(record);

/**
 * Het plan voor dit blok: is ronde 1 klaar, welke vragen mogen herkanst
 * worden, en hoe staat de herkansing ervoor.
 */
export const buildRetryRoundPlan = ({ block = {}, items = [], records = {} } = {}) => {
  const policy = resolveRetryPolicy(block);
  const itemList = asArray(items);
  const recordFor = (item) => records?.[item?.id] || null;
  const ronde1Klaar = itemList.length > 0 && itemList.every((item) => recordFor(item)?.completed === true);
  const kandidaten = ronde1Klaar
    ? itemList.filter((item) => isRetryCandidate(recordFor(item)))
    : [];
  const afgerond = kandidaten.filter((item) => recordFor(item)?.herkansing?.completed === true);
  const gestart = kandidaten.filter((item) => recordFor(item)?.herkansing);
  const goedNaHerkansing = kandidaten.filter((item) => recordFor(item)?.herkansing?.isCorrect === true);

  return {
    policy,
    ronde1Klaar,
    beschikbaar: policy.enabled && ronde1Klaar && kandidaten.length > 0,
    kandidaatIds: kandidaten.map((item) => item.id),
    aantalKandidaten: kandidaten.length,
    aantalGestart: gestart.length,
    aantalAfgerond: afgerond.length,
    aantalGoedNaHerkansing: goedNaHerkansing.length,
    herkansingKlaar: kandidaten.length > 0 && afgerond.length === kandidaten.length
  };
};

/**
 * De voortgang van EEN herkanste vraag na een nakijkbeurt in ronde 2.
 *
 * De bovenste velden (isCorrect, score, resultTier) worden pas overschreven
 * als de herkansing van deze vraag klaar is: goed, of pogingen op. Tot dan
 * blijft de eerste stand staan, zodat een halve herkansing niets kapotmaakt.
 */
export const buildRetryItemProgressPayload = ({
  block = {},
  record = {},
  answer = null,
  isCorrect = false,
  graded = true,
  aiHelpCount = 0,
  score = { score: 0, maxScore: 1 },
  now = new Date().toISOString()
} = {}) => {
  const bestaand = record?.herkansing || null;
  const maxAttempts = resolveBlockMaxAttempts(block);
  const outcome = buildQuestionAttemptOutcome({
    currentAttempts: bestaand?.attempts || 0,
    maxAttempts,
    isCorrect,
    aiAssessmentFailed: !graded,
    aiHelpCount
  });
  const herkansing = {
    attempts: outcome.attempts,
    maxAttempts,
    aiHelpCount: count(aiHelpCount),
    completed: outcome.completed,
    isCorrect: outcome.isCorrect,
    score: outcome.isCorrect ? count(score.score) : 0,
    maxScore: count(score.maxScore) || count(record?.maxScore) || 1,
    lastAnswer: { value: answer ?? null },
    startedAt: bestaand?.startedAt || now,
    completedAt: outcome.completed ? now : null
  };

  const payload = {
    herkansing,
    // Records van vóór de herkansingsronde hebben nog geen bevroren eerste
    // stand; die wordt hier alsnog vastgezet uit de huidige velden.
    ronde1: record?.ronde1 || {
      isCorrect: record?.isCorrect === true,
      score: count(record?.score),
      maxScore: count(record?.maxScore),
      attempts: count(record?.attempts),
      aiHelpCount: count(record?.aiHelpCount),
      resultTier: record?.resultTier || '',
      attemptStatus: record?.attemptStatus || ''
    },
    lastAnswer: { value: answer ?? null },
    attemptEntry: {
      attemptNr: (count(record?.attempts) || 0) + outcome.attempts,
      round: 2,
      answer: answer ?? null,
      isCorrect: outcome.isCorrect,
      graded,
      aiHelpCount: count(aiHelpCount),
      source: 'server',
      reviewReason: '',
      at: now
    },
    // Digidocent-hulp telt op bij de vraag als geheel.
    aiHelpCount: count(record?.ronde1?.aiHelpCount ?? record?.aiHelpCount) + count(aiHelpCount)
  };

  if (outcome.completed) {
    payload.completed = true;
    payload.isCorrect = outcome.isCorrect;
    payload.score = herkansing.score;
    payload.maxScore = herkansing.maxScore;
    payload.resultTier = outcome.isCorrect
      ? (count(aiHelpCount) > 0 ? 'guided' : 'independent')
      : 'failed';
    payload.attemptStatus = outcome.isCorrect ? 'completed' : 'locked';
    payload.completionReason = outcome.isCorrect ? 'retry_correct' : 'retry_max_attempts';
    payload.teacherSignal = outcome.isCorrect ? '' : 'remediation_needed';
  }

  return { payload, outcome };
};

/**
 * Digidocent-hulp tijdens de herkansing, vóór er opnieuw is nagekeken: de
 * teller gaat omhoog en de herkansing staat als gestart in het record, zodat
 * de hulp ook telt als de leerling de vraag daarna niet meer inlevert.
 */
export const buildRetryHelpPayload = ({ record = {}, aiHelpCount = 0, now = new Date().toISOString() } = {}) => {
  const bestaand = record?.herkansing || {};
  return {
    herkansing: {
      attempts: count(bestaand.attempts),
      maxAttempts: bestaand.maxAttempts ?? null,
      aiHelpCount: count(aiHelpCount),
      completed: bestaand.completed === true,
      isCorrect: bestaand.isCorrect === true,
      score: count(bestaand.score),
      maxScore: count(bestaand.maxScore) || count(record?.maxScore) || 1,
      lastAnswer: bestaand.lastAnswer ?? null,
      startedAt: bestaand.startedAt || now,
      completedAt: bestaand.completedAt || null
    },
    ronde1: record?.ronde1 || {
      isCorrect: record?.isCorrect === true,
      score: count(record?.score),
      maxScore: count(record?.maxScore),
      attempts: count(record?.attempts),
      aiHelpCount: count(record?.aiHelpCount),
      resultTier: record?.resultTier || '',
      attemptStatus: record?.attemptStatus || ''
    },
    aiHelpCount: count(record?.ronde1?.aiHelpCount ?? record?.aiHelpCount) + count(aiHelpCount)
  };
};

/** Korte samenvatting voor leerling en docent: eerste ronde tegenover herkansing. */
export const describeRetryRound = ({ summary = {} } = {}) => {
  const eerste = summary.eersteScore || null;
  const herkansing = summary.herkansing || null;
  return {
    eersteTekst: eerste ? `${eerste.itemsCorrect} van ${eerste.itemCount} goed` : '',
    herkansingTekst: herkansing
      ? `${herkansing.itemsGoed} van ${herkansing.itemsHerkanst} herkanste ${herkansing.itemsHerkanst === 1 ? 'vraag' : 'vragen'} goed`
        + (herkansing.aiHelpCount > 0 ? ` (${herkansing.aiHelpCount}x Digidocent)` : '')
      : '',
    naHerkansingTekst: eerste && herkansing
      ? `${count(summary.itemsCorrect)} van ${count(summary.itemCount)} goed`
      : ''
  };
};
