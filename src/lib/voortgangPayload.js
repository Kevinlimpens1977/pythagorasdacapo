import { buildLearningResultMetadata } from './learningResultUtils.js';

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
  const resultMetadata = buildLearningResultMetadata({
    isCorrect: data.isCorrect || false,
    aiHelpCount: data.aiHelpCount ?? existingData.aiHelpCount ?? 0
  });

  const updates = {
    userId,
    blockId,
    paragraafId,
    hoofdstukId,
    klasId,
    progressType: 'contentBlock',
    blockTitle: data.blockTitle || existingData.blockTitle || '',
    blockType: data.blockType || existingData.blockType || '',
    vraagTitle: data.vraagTitle || existingData.vraagTitle || '',
    vraagType: data.vraagType || existingData.vraagType || '',
    completed: data.completed || false,
    isCorrect: data.isCorrect || false,
    attempts: data.attempts ?? existingData.attempts ?? 0,
    lastAnswer: data.lastAnswer || existingData.lastAnswer || null,
    openAnswerAssessment: data.openAnswerAssessment || existingData.openAnswerAssessment || null,
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
