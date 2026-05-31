import { buildLearningResultMetadata } from './learningResultUtils.js';
import { hasFilledMathToolWork } from './mathToolboxUtils.js';

const hasTextValue = (value) => String(value ?? '').trim().length > 0;

export const hasQuestionDraftAnswer = (previewAnswers = {}) => {
  if (!previewAnswers || typeof previewAnswers !== 'object') return false;
  if (hasTextValue(previewAnswers.openAnswer)) return true;
  if (hasTextValue(previewAnswers.expectedValue)) return true;
  if (hasFilledMathToolWork(previewAnswers.mathTools)) return true;
  if (previewAnswers.orderTouched && Array.isArray(previewAnswers.orderItems) && previewAnswers.orderItems.length > 0) {
    return true;
  }

  return Object.entries(previewAnswers).some(([key, value]) => {
    if (['openAnswer', 'expectedValue', 'mathTools', 'orderItems', 'orderTouched'].includes(key)) return false;
    if (typeof value === 'boolean') return value === true;
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === 'object') return Object.keys(value).length > 0;
    return hasTextValue(value);
  });
};

export const buildQuestionDraftProgressPayload = ({
  block = {},
  linkedVraag = {},
  preview = {},
  previewAnswers = {},
  attempts = 0,
  aiHelpCount = 0
} = {}) => ({
  completed: false,
  isCorrect: false,
  attempts,
  lastAnswer: previewAnswers,
  draftSaved: true,
  blockTitle: block.title || linkedVraag?.title || 'Vraag',
  blockType: block.type || 'question',
  vraagTitle: linkedVraag?.title || '',
  vraagType: preview.type || linkedVraag?.type || '',
  ...buildLearningResultMetadata({ isCorrect: false, aiHelpCount })
});
