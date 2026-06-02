import { buildLearningResultMetadata } from './learningResultUtils.js';
import { buildAnswerSignature, isAssessmentForAnswer } from './openAnswerAssessmentFeedback.js';

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
    draftSaved: data.completed === true ? false : (data.draftSaved ?? existingData.draftSaved ?? false),
    ...resultMetadata,
    updatedAt: timestamp,
    firstAttemptAt: existingData.firstAttemptAt || timestamp
  };

  if (data.completed && !existingData.completedAt) {
    updates.completedAt = timestamp;
  }

  return updates;
};
