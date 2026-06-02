export const OPEN_ANSWER_ASSESSMENT_FALLBACK =
  'Digidocent kon je antwoord niet beoordelen. Probeer het nog eens.';

const rawJsonErrorPattern = /\b(?:no json object found|unexpected token|json\.parse|valid json|geen json)\b/i;

export const sanitizeOpenAnswerAssessmentFeedback = (feedback = '') => {
  const text = String(feedback || '').trim();
  if (!text) return '';
  return rawJsonErrorPattern.test(text) ? OPEN_ANSWER_ASSESSMENT_FALLBACK : text;
};

export const buildAnswerSignature = (answer = {}) => {
  const normalized = JSON.stringify(answer || {}, Object.keys(answer || {}).sort());
  let hash = 0;
  for (let index = 0; index < normalized.length; index += 1) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(index)) | 0;
  }
  return `${normalized.length}:${Math.abs(hash)}`;
};

export const isAssessmentForAnswer = (assessment = null, answer = {}) => {
  if (!assessment?.answerSignature) return false;
  return assessment.answerSignature === buildAnswerSignature(answer);
};
