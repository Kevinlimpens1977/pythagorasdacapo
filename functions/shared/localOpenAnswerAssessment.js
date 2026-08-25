import { evaluateCalculatorExpression } from './calculatorEvaluator.js';

const normalizeMathText = (value = '') =>
  String(value || '')
    .toLowerCase()
    .replace(/,/g, '.')
    .replace(/\u221a\s*(\d+(?:\.\d+)?)/g, 'sqrt($1)')
    .replace(/wortel\s+van\s+(-?\d+(?:\.\d+)?)/g, 'sqrt($1)')
    .replace(/keer/g, '*')
    .replace(/gedeeld\s+door/g, '/')
    .replace(/\s+/g, ' ')
    .trim();

const candidateAfterEquals = (value = '') => {
  const parts = String(value || '').split('=');
  return parts.length > 1 ? parts.at(-1) : value;
};

const stripKnownUnits = (value = '') =>
  String(value || '')
    .replace(/\b(cm|mm|m|km|procent|%)\b/gi, '')
    .trim();

const canEvaluateExpression = (value = '') => {
  const normalized = normalizeMathText(stripKnownUnits(candidateAfterEquals(value)));
  return /^[\d\s.+\-*/^():sqrt]+$/i.test(normalized) && /\d/.test(normalized);
};

const toNumber = (value = '') => {
  const normalized = normalizeMathText(stripKnownUnits(candidateAfterEquals(value)));
  if (!canEvaluateExpression(normalized)) return null;

  try {
    const result = evaluateCalculatorExpression(normalized);
    return Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
};

const numbersAreEqual = (left, right) =>
  Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) <= 0.000001;

export const assessOpenAnswerLocally = ({
  modelAnswer = '',
  studentAnswer = ''
} = {}) => {
  const expected = toNumber(modelAnswer);
  const actual = toNumber(studentAnswer);

  if (expected === null || actual === null) {
    return { canAssess: false };
  }

  const isCorrect = numbersAreEqual(actual, expected);
  return {
    canAssess: true,
    isCorrect,
    feedback: isCorrect
      ? 'Goed gerekend. Je antwoord klopt.'
      : 'Kijk nog eens naar je berekening en controleer het getal dat eruit komt.',
    missing: isCorrect ? [] : ['controleer de berekening']
  };
};
