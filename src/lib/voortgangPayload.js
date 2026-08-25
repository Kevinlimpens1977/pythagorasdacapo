import { buildLearningResultMetadata } from './learningResultUtils.js';
import { buildAnswerSignature, isAssessmentForAnswer } from './openAnswerAssessmentFeedback.js';
import { appendAttemptHistory, buildPartScore, normalizeGradeParts } from './voortgangAttemptLog.js';

const asArray = (value) => (Array.isArray(value) ? value : []);

const normalizeCount = (value, fallback = 0) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
};

/**
 * Beoordeling door een docent, in opslagvorm. Firestore weigert `undefined`,
 * dus een ontbrekende beoordeling is expliciet `null` en niet een half object.
 */
export const normalizeTeacherReview = (review) => {
  if (!review || typeof review !== 'object') return null;

  const besluit = String(review.besluit || '').trim();
  if (!besluit) return null;

  return {
    besluit,
    besluitLabel: String(review.besluitLabel || '').trim(),
    opmerking: String(review.opmerking || '').trim(),
    docentId: String(review.docentId || '').trim(),
    docentNaam: String(review.docentNaam || '').trim(),
    beoordeeldOp: review.beoordeeldOp ?? null
  };
};

const buildAssessmentPayload = ({ data = {}, existingData = {}, lastAnswer = null } = {}) => {
  if (data.openAnswerAssessment) {
    return {
      ...data.openAnswerAssessment,
      answerSignature: data.openAnswerAssessment.answerSignature || buildAnswerSignature(lastAnswer || data.lastAnswer || {})
    };
  }

  if (existingData.openAnswerAssessment && isAssessmentForAnswer(existingData.openAnswerAssessment, lastAnswer || existingData.lastAnswer || {})) {
    return existingData.openAnswerAssessment;
  }

  return null;
};

const buildLastAssessmentPayload = ({ data = {}, existingData = {}, lastAnswer = null } = {}) => {
  if (data.lastAssessment) {
    return {
      ...data.lastAssessment,
      answerSignature: data.lastAssessment.answerSignature || buildAnswerSignature(lastAnswer || data.lastAnswer || {})
    };
  }

  if (existingData.lastAssessment && isAssessmentForAnswer(existingData.lastAssessment, lastAnswer || existingData.lastAnswer || {})) {
    return existingData.lastAssessment;
  }

  return null;
};

export const buildContentBlockVoortgangUpdate = ({
  userId,
  blockId,
  paragraafId,
  hoofdstukId = '',
  klasId,
  data = {},
  existingData = {},
  timestamp
}) => {
  const hasFreshResultInput = data.completed !== undefined || data.isCorrect !== undefined || data.resultTier !== undefined;
  const resultMetadata = buildLearningResultMetadata({
    completed: data.completed ?? existingData.completed ?? false,
    isCorrect: data.isCorrect ?? existingData.isCorrect ?? false,
    aiHelpCount: data.aiHelpCount ?? existingData.aiHelpCount ?? 0,
    resultTier: data.resultTier ?? (hasFreshResultInput ? '' : existingData.resultTier ?? ''),
    helpTier: data.helpTier ?? (hasFreshResultInput ? '' : existingData.helpTier ?? '')
  });

  const lastAnswer = data.lastAnswer || existingData.lastAnswer || null;
  const updates = {
    userId,
    blockId,
    paragraafId,
    hoofdstukId,
    klasId,
    progressType: data.progressType || existingData.progressType || 'contentBlock',
    blockTitle: data.blockTitle || existingData.blockTitle || '',
    blockType: data.blockType || existingData.blockType || '',
    vraagTitle: data.vraagTitle || existingData.vraagTitle || '',
    vraagType: data.vraagType || existingData.vraagType || '',
    questionPlainText: data.questionPlainText ?? existingData.questionPlainText ?? '',
    expectedAnswer: data.expectedAnswer ?? existingData.expectedAnswer ?? '',
    modelAnswer: data.modelAnswer ?? existingData.modelAnswer ?? '',
    // De nakijkpunten van de vraag. Ze reizen mee met de voortgang omdat het
    // docentdashboard de lesstof zelf niet inleest: zonder dit veld staat een
    // open antwoord daar zonder enige referentie.
    rubric: data.rubric ?? existingData.rubric ?? '',
    hints: data.hints ?? existingData.hints ?? [],
    completed: data.completed || false,
    isCorrect: data.isCorrect || false,
    attempts: data.attempts ?? existingData.attempts ?? 0,
    lastAnswer,
    openAnswerAssessment: buildAssessmentPayload({ data, existingData, lastAnswer }),
    assignmentKind: data.assignmentKind ?? existingData.assignmentKind ?? 'core',
    completionReason: data.completionReason ?? existingData.completionReason ?? '',
    attemptStatus: data.attemptStatus ?? existingData.attemptStatus ?? (data.completed ? 'completed' : 'open'),
    maxAttempts: data.maxAttempts ?? existingData.maxAttempts ?? null,
    lastAssessment: buildLastAssessmentPayload({ data, existingData, lastAnswer }),
    teacherSignal: data.teacherSignal ?? existingData.teacherSignal ?? '',
    teacherFeedbackSummary: data.teacherFeedbackSummary ?? existingData.teacherFeedbackSummary ?? '',
    // Wie heeft dit nagekeken, wanneer en met welk besluit. Blijft staan als de
    // leerling daarna nog een poging doet: de beoordeling is geschiedenis, geen
    // vlag die opnieuw gezet moet worden.
    teacherReview: normalizeTeacherReview(data.teacherReview ?? existingData.teacherReview),
    draftSaved: data.completed === true ? false : (data.draftSaved ?? existingData.draftSaved ?? false),
    // Deelscores van de gedeelde beoordelingslaag. Hier stond eerder alleen
    // "goed of fout", terwijl de docent juist wil zien welk onderdeel misging.
    parts: data.parts ? normalizeGradeParts(data.parts) : normalizeGradeParts(existingData.parts),
    score: data.score ?? existingData.score ?? 0,
    maxScore: data.maxScore ?? existingData.maxScore ?? 0,
    // Opgetelde stand van een toets of quiz. De losse vragen staan in de
    // subcollectie `items`; dit is wat de lesnavigatie en de voortgangsbalk
    // van het blok zelf nodig hebben.
    itemCount: data.itemCount ?? existingData.itemCount ?? 0,
    itemsCompleted: data.itemsCompleted ?? existingData.itemsCompleted ?? 0,
    itemsCorrect: data.itemsCorrect ?? existingData.itemsCorrect ?? 0,
    // Pogingen worden geteld EN gelogd: `attempts` is het getal, dit is het
    // verhaal erachter. Alleen aanvullen bij een echte nakijkbeurt.
    attemptHistory: appendAttemptHistory(existingData.attemptHistory, data.attemptEntry || null),
    ...resultMetadata,
    updatedAt: timestamp,
    firstAttemptAt: existingData.firstAttemptAt || timestamp
  };

  if (data.completed && !existingData.completedAt) {
    updates.completedAt = timestamp;
  }

  return updates;
};

/**
 * Voortgang van EEN vraag binnen een toets of quiz.
 *
 * Woont in de subcollectie `voortgang/{userId}_{blockId}/items/{itemId}`.
 * Waarom een subcollectie en geen aparte collectie: het ouderdocument is al de
 * plek waar dit blok wordt bijgehouden, de bestaande queries op `voortgang`
 * blijven ongemoeid, en de Firestore-regels kunnen dezelfde eigenaarstoets
 * gebruiken. Waarom niet in het ouderdocument zelf: een toets met tien items
 * zou dan tien antwoordgeschiedenissen in een document proppen, en er is geen
 * plek om "vraag 3" apart te lezen of te herstellen.
 *
 * De velden zijn met opzet DEZELFDE als bij een gewone vraag, met itemId,
 * itemIndex en de deelscores erbij. Een toetsitem is voor de docent geen ander
 * soort ding dan een losse vraag.
 */
export const buildAssessmentItemVoortgangUpdate = ({
  userId,
  blockId,
  itemId,
  itemIndex = 0,
  paragraafId,
  hoofdstukId = '',
  klasId,
  data = {},
  existingData = {},
  timestamp
}) => {
  const hasFreshResultInput = data.completed !== undefined || data.isCorrect !== undefined || data.resultTier !== undefined;
  const resultMetadata = buildLearningResultMetadata({
    completed: data.completed ?? existingData.completed ?? false,
    isCorrect: data.isCorrect ?? existingData.isCorrect ?? false,
    aiHelpCount: data.aiHelpCount ?? existingData.aiHelpCount ?? 0,
    resultTier: data.resultTier ?? (hasFreshResultInput ? '' : existingData.resultTier ?? ''),
    helpTier: data.helpTier ?? (hasFreshResultInput ? '' : existingData.helpTier ?? '')
  });

  const parts = data.parts ? normalizeGradeParts(data.parts) : normalizeGradeParts(existingData.parts);
  const partScore = data.score === undefined
    ? buildPartScore({ parts, isCorrect: data.isCorrect === true, graded: data.graded !== false })
    : { score: data.score, maxScore: data.maxScore ?? parts.length ?? 1 };

  const updates = {
    userId,
    blockId,
    itemId,
    itemIndex: normalizeCount(itemIndex, 0),
    paragraafId,
    hoofdstukId,
    klasId,
    progressType: 'assessmentItem',
    blockTitle: data.blockTitle ?? existingData.blockTitle ?? '',
    blockType: data.blockType ?? existingData.blockType ?? '',
    vraagTitle: data.vraagTitle ?? existingData.vraagTitle ?? '',
    vraagType: data.vraagType ?? existingData.vraagType ?? '',
    questionPlainText: data.questionPlainText ?? existingData.questionPlainText ?? '',
    // Zelfde reden als bij een losse vraag: het modelantwoord en de nakijkpunten
    // horen bij het antwoord dat de docent straks beoordeelt, en het dashboard
    // heeft de toetsinhoud niet bij de hand.
    modelAnswer: data.modelAnswer ?? existingData.modelAnswer ?? '',
    rubric: data.rubric ?? existingData.rubric ?? '',
    completed: data.completed || false,
    isCorrect: data.isCorrect || false,
    attempts: data.attempts ?? existingData.attempts ?? 0,
    maxAttempts: data.maxAttempts ?? existingData.maxAttempts ?? null,
    attemptStatus: data.attemptStatus ?? existingData.attemptStatus ?? (data.completed ? 'completed' : 'open'),
    completionReason: data.completionReason ?? existingData.completionReason ?? '',
    teacherSignal: data.teacherSignal ?? existingData.teacherSignal ?? '',
    teacherReview: normalizeTeacherReview(data.teacherReview ?? existingData.teacherReview),
    lastAnswer: data.lastAnswer ?? existingData.lastAnswer ?? null,
    lastAssessment: data.lastAssessment ?? existingData.lastAssessment ?? null,
    parts,
    score: partScore.score,
    maxScore: partScore.maxScore,
    attemptHistory: appendAttemptHistory(existingData.attemptHistory, data.attemptEntry || null),
    tokens: normalizeCount(data.tokens ?? existingData.tokens, 0),
    ...resultMetadata,
    updatedAt: timestamp,
    firstAttemptAt: existingData.firstAttemptAt || timestamp
  };

  if (data.completed && !existingData.completedAt) {
    updates.completedAt = timestamp;
  }

  return updates;
};

/**
 * Rolt de itemvoortgang op tot de stand van het toets- of quizblok zelf, zodat
 * de lesnavigatie, de voortgangsbalk en de tokentoekenning met precies dezelfde
 * velden blijven werken als bij een gewone vraag.
 */
export const summarizeAssessmentItemProgress = ({ items = [], records = {} } = {}) => {
  const itemList = asArray(items);
  const recordFor = (item) => records?.[item?.id] || null;
  const answered = itemList.filter((item) => recordFor(item));
  const completedItems = itemList.filter((item) => recordFor(item)?.completed === true);
  const correctItems = itemList.filter((item) => recordFor(item)?.isCorrect === true);
  const pendingReview = itemList.filter(
    (item) => recordFor(item)?.attemptStatus === 'pending_teacher_review'
  );
  const failedItems = itemList.filter((item) => recordFor(item)?.resultTier === 'failed');

  const score = itemList.reduce((sum, item) => sum + normalizeCount(recordFor(item)?.score, 0), 0);
  const maxScore = itemList.reduce((sum, item) => {
    const record = recordFor(item);
    return sum + (record ? normalizeCount(record.maxScore, 1) || 1 : 1);
  }, 0);
  const aiHelpCount = itemList.reduce((sum, item) => sum + normalizeCount(recordFor(item)?.aiHelpCount, 0), 0);

  const completed = itemList.length > 0 && completedItems.length === itemList.length;
  const isCorrect = completed && correctItems.length === itemList.length;

  return {
    itemCount: itemList.length,
    itemsAnswered: answered.length,
    itemsCompleted: completedItems.length,
    itemsCorrect: correctItems.length,
    itemsPendingReview: pendingReview.length,
    itemsFailed: failedItems.length,
    score,
    maxScore,
    aiHelpCount,
    completed,
    isCorrect,
    resultTier: !completed
      ? 'in_progress'
      : pendingReview.length > 0
        ? 'pending_teacher_review'
        : !isCorrect
          ? 'failed'
          : aiHelpCount > 0
            ? 'guided'
            : 'independent',
    attemptStatus: !completed
      ? 'open'
      : pendingReview.length > 0
        ? 'pending_teacher_review'
        : 'completed'
  };
};
