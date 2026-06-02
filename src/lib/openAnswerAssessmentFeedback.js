export const OPEN_ANSWER_ASSESSMENT_FALLBACK =
  'Digidocent kon je antwoord niet beoordelen. Probeer het nog eens.';

const rawJsonErrorPattern = /\b(?:no json object found|unexpected token|json\.parse|valid json|geen json)\b/i;

export const sanitizeOpenAnswerAssessmentFeedback = (feedback = '') => {
  const text = String(feedback || '').trim();
  if (!text) return '';
  return rawJsonErrorPattern.test(text) ? OPEN_ANSWER_ASSESSMENT_FALLBACK : text;
};
