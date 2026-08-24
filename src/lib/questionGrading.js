// Gedeelde beoordelingslaag voor vragen.
//
// Dit is de ENIGE plek waar een antwoord tegen een antwoordsleutel wordt
// gelegd. De leerlingroute (StudentLessonPage) en het digibord (Presenter)
// roepen allebei `gradeQuestionAnswer` aan; er hoort nooit een tweede
// vergelijking naast te ontstaan.
//
// Harde grenzen van deze module, zodat een toekomstig toetssysteem hem
// ongewijzigd kan hergebruiken (ook server-side in een Cloud Function):
//   - geen React, geen Firebase, geen services, geen browser-API's;
//   - geen pogingen, tiers, tokens of voortgang: dat is boekhouding en hoort
//     in de leerlingroute, niet hier;
//   - nooit stilzwijgend "fout" bij een ontbrekende antwoordsleutel. Dan is
//     het `canGrade: false` en kijkt een mens na.
//
// Contract:
//   gradeQuestionAnswer({ vraag, preview, answers }) -> {
//     canGrade, isCorrect, parts: [{ id, label, isCorrect }], reason, source
//   }
// `parts` volgt `getAnswerPartsForQuestionType`, zodat deelscores later
// beschikbaar zijn zonder de graders te herschrijven.

import { getPreviewAnswerStatus } from './questionPreviewUtils.js';
import { assessOpenAnswerLocally } from './localOpenAnswerAssessment.js';
import { hasQuestionAnswerKey } from './publicQuestionView.js';
import { getAnswerPartsForQuestionType } from './questionTypeRegistry.js';

export const GRADE_REASONS = {
  GRADED: 'graded',
  NO_ANSWER_KEY: 'no-answer-key',
  NEEDS_HUMAN: 'needs-human',
  NOT_SCORED: 'not-scored'
};

// Inleverblokken uit de DV-seed (content.exercise) hebben per ontwerp geen
// antwoordsleutel. Ze worden getoond en besproken, niet nagekeken.
export const NON_SCORING_QUESTION_TYPES = new Set(['exercise']);

const cleanText = (value) => String(value ?? '').trim();

const asArray = (value) => (Array.isArray(value) ? value : []);

export const getGradingQuestionType = (vraag = {}, preview = null) =>
  preview?.type || vraag?.vraagtype || vraag?.antwoord?.type || 'open';

// Beide routes draaien de items om als startvolgorde. Eén implementatie,
// zodat "de leerling ziet iets anders dan het bord" niet kan ontstaan.
export const buildInitialOrderItems = (orderItems) => {
  const items = asArray(orderItems);
  return items.length > 1 ? [...items].reverse() : items;
};

const hasInvullenAnswerKey = (antwoord = {}) => {
  const fromGaps = asArray(antwoord.gaps).some((gap) => cleanText(gap?.answer || gap?.correctAnswer));
  const fromSegments = asArray(antwoord.segments).some(
    (segment) => segment?.type === 'gap' && cleanText(segment?.answer)
  );
  return fromGaps || fromSegments;
};

const hasKoppelenAnswerKey = (antwoord = {}) =>
  asArray(antwoord.pairs).some((pair) => cleanText(pair?.left) && cleanText(pair?.right));

/**
 * Is er genoeg antwoordsleutel om automatisch na te kijken?
 *
 * Dit is bewust een superset van `hasQuestionAnswerKey`: koppelen en
 * invullen-met-antwoorden-in-segments zijn wél nakijkbaar zodra de volledige
 * vraag beschikbaar is (het digibord), terwijl een publieke leerlingsnapshot
 * die sleutel juist niet meekrijgt. Bord en leerlingroute mogen daardoor
 * legitiem verschillen; dat hoort zichtbaar te zijn ("docent kijkt na"),
 * niet weggemoffeld.
 */
export const hasGradableAnswerKey = (vraag = {}) => {
  const type = getGradingQuestionType(vraag);
  if (NON_SCORING_QUESTION_TYPES.has(type)) return false;

  const antwoord = vraag?.antwoord || vraag?.answer || {};
  if (type === 'koppelen') return hasKoppelenAnswerKey(antwoord);
  if (type === 'invullen') return hasInvullenAnswerKey(antwoord) || hasQuestionAnswerKey(vraag);

  return hasQuestionAnswerKey(vraag);
};

const toComparableNumber = (value) => {
  const normalized = cleanText(value).replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const isWithinTolerance = (studentAnswer, expected, tolerance) => {
  const margin = toComparableNumber(tolerance);
  if (margin === null || margin <= 0) return false;

  const actual = toComparableNumber(studentAnswer);
  const target = toComparableNumber(expected);
  if (actual === null || target === null) return false;

  return Math.abs(actual - target) <= margin + 1e-9;
};

const labelForPart = (type, answer, index, fallbackId) => {
  const parts = getAnswerPartsForQuestionType(type, answer);
  return parts[index]?.label || fallbackId;
};

const buildResult = ({ canGrade, isCorrect = false, parts = [], reason, source = 'local' }) => ({
  canGrade,
  isCorrect: canGrade ? Boolean(isCorrect) : false,
  parts,
  reason,
  source
});

const gradeInvullen = ({ preview, answers }) => {
  const fields = asArray(preview?.fields);
  const parts = fields.map((field, index) => ({
    id: field.id,
    label: field.label || `Invulveld ${index + 1}`,
    isCorrect: getPreviewAnswerStatus(answers[field.id], field.answer) === 'correct'
  }));

  return buildResult({
    canGrade: true,
    isCorrect: parts.length > 0 && parts.every((part) => part.isCorrect),
    parts,
    reason: GRADE_REASONS.GRADED
  });
};

const gradeMeerkeuze = ({ vraag, answers }) => {
  const antwoord = vraag?.antwoord || {};
  const options = asArray(antwoord.options);
  const parts = options.map((option, index) => {
    const id = option?.id || `option-${index + 1}`;
    return {
      id,
      label: labelForPart('meerkeuze', antwoord, index, id),
      isCorrect: Boolean(answers[id]) === Boolean(option?.correct)
    };
  });

  return buildResult({
    canGrade: true,
    isCorrect: parts.length > 0 && parts.every((part) => part.isCorrect),
    parts,
    reason: GRADE_REASONS.GRADED
  });
};

const gradeVolgorde = ({ vraag, preview, answers }) => {
  const expected = asArray(preview?.orderItems);
  const current = Array.isArray(answers?.orderItems)
    ? answers.orderItems
    : buildInitialOrderItems(expected);
  const antwoord = vraag?.antwoord || {};

  const parts = expected.map((item, index) => ({
    id: item.id,
    label: labelForPart('volgorde', antwoord, index, item.id),
    isCorrect: current[index]?.id === item.id
  }));

  return buildResult({
    canGrade: true,
    isCorrect: current.length > 0 && current.every((item, index) => item.id === expected[index]?.id),
    parts,
    reason: GRADE_REASONS.GRADED
  });
};

const gradeNumeriek = ({ vraag, answers }) => {
  const antwoord = vraag?.antwoord || {};
  const expected = antwoord.expected ?? antwoord.correctValue ?? antwoord.correctAnswer;

  if (expected === undefined || expected === null || cleanText(expected) === '') {
    return buildResult({ canGrade: false, reason: GRADE_REASONS.NO_ANSWER_KEY });
  }

  const submitted = answers?.expectedValue;
  const isCorrect =
    getPreviewAnswerStatus(submitted, expected) === 'correct' ||
    isWithinTolerance(submitted, expected, antwoord.tolerance);

  return buildResult({
    canGrade: true,
    isCorrect,
    parts: [{ id: 'expected-value', label: 'Correct getal', isCorrect }],
    reason: GRADE_REASONS.GRADED
  });
};

const gradeKoppelen = ({ vraag, answers }) => {
  const antwoord = vraag?.antwoord || {};
  const pairs = asArray(antwoord.pairs);
  const submitted = answers?.pairs || {};

  const parts = pairs.map((pair, index) => {
    const id = pair?.id || `pair-${index + 1}`;
    return {
      id,
      label: labelForPart('koppelen', antwoord, index, id),
      isCorrect: submitted[id] === id
    };
  });

  return buildResult({
    canGrade: true,
    isCorrect: parts.length > 0 && parts.every((part) => part.isCorrect),
    parts,
    reason: GRADE_REASONS.GRADED
  });
};

export const getOpenModelAnswer = (vraag = {}) => {
  const antwoord = vraag?.antwoord || {};
  return cleanText(
    antwoord.modelAnswer || antwoord.answer || antwoord.expected || antwoord.correctValue || ''
  );
};

const gradeOpen = ({ vraag, answers }) => {
  const modelAnswer = getOpenModelAnswer(vraag);
  const studentAnswer = cleanText(answers?.openAnswer);
  const local = assessOpenAnswerLocally({ modelAnswer, studentAnswer });

  if (!local.canAssess) {
    return buildResult({ canGrade: false, reason: GRADE_REASONS.NEEDS_HUMAN });
  }

  return buildResult({
    canGrade: true,
    isCorrect: local.isCorrect,
    parts: [{ id: 'model-answer', label: 'Modelantwoord', isCorrect: local.isCorrect }],
    reason: GRADE_REASONS.GRADED,
    source: 'local-math'
  });
};

// Inleverblok: tonen en bespreken, nooit scoren.
const gradeExercise = () => buildResult({ canGrade: false, reason: GRADE_REASONS.NOT_SCORED });

// Onbekende of nog niet ondersteunde typen volgen de bestaande staartlogica
// van de leerlingroute: alleen vergelijken als er een modelantwoord ligt.
const gradeFallback = ({ vraag, answers }) => {
  const antwoord = vraag?.antwoord || {};
  const correctAnswer = cleanText(antwoord.modelAnswer || antwoord.answer);
  if (!correctAnswer) {
    return buildResult({ canGrade: false, reason: GRADE_REASONS.NEEDS_HUMAN });
  }

  const isCorrect = getPreviewAnswerStatus(answers?.openAnswer, correctAnswer) === 'correct';
  return buildResult({
    canGrade: true,
    isCorrect,
    parts: [{ id: 'model-answer', label: 'Modelantwoord', isCorrect }],
    reason: GRADE_REASONS.GRADED
  });
};

// Elk vraagtype uit questionTypeRegistry MOET hier staan. De regressietest
// in questionGrading.test.js faalt zodra iemand een type toevoegt zonder
// grader, zodat bord en leerlingroute niet opnieuw uiteen kunnen lopen.
export const QUESTION_GRADERS = {
  open: gradeOpen,
  meerkeuze: gradeMeerkeuze,
  numeriek: gradeNumeriek,
  koppelen: gradeKoppelen,
  invullen: gradeInvullen,
  volgorde: gradeVolgorde,
  exercise: gradeExercise
};

export const gradeQuestionAnswer = ({ vraag = {}, preview = null, answers = {} } = {}) => {
  const type = getGradingQuestionType(vraag, preview);

  if (NON_SCORING_QUESTION_TYPES.has(type)) {
    return gradeExercise();
  }

  if (!hasGradableAnswerKey({ ...vraag, vraagtype: type })) {
    return buildResult({ canGrade: false, reason: GRADE_REASONS.NO_ANSWER_KEY });
  }

  const grader = QUESTION_GRADERS[type] || gradeFallback;
  return grader({ vraag, preview: preview || { type }, answers: answers || {} });
};
