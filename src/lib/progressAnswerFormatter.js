import { getMathToolSummary, hasFilledMathToolWork } from './mathToolboxUtils.js';

const hasValue = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return String(value ?? '').trim().length > 0;
};

const formatBooleanOptions = (answer = {}) => {
  const chosen = Object.entries(answer)
    .filter(([, value]) => value === true)
    .map(([key]) => `${key}: gekozen`);
  return chosen.length ? chosen.join('; ') : '';
};

const formatKeyValueAnswers = (answer = {}) =>
  Object.entries(answer)
    .filter(([key, value]) => key !== 'mathTools' && key !== 'openAnswer' && key !== 'orderTouched' && hasValue(value))
    .map(([key, value]) => {
      if (value === true) return `${key}: gekozen`;
      if (value === false) return '';
      if (Array.isArray(value)) return `${key}: ${value.map((item) => item.text || item.label || item.id || item).join(' > ')}`;
      if (typeof value === 'object') return `${key}: ${JSON.stringify(value)}`;
      return `${key}: ${value}`;
    })
    .filter(Boolean)
    .join('; ');

export const formatProgressAnswer = (answer) => {
  if (!hasValue(answer)) return 'Geen antwoord opgeslagen';
  if (typeof answer === 'string' || typeof answer === 'number' || typeof answer === 'boolean') {
    return String(answer);
  }

  const parts = [];

  if (String(answer.openAnswer || '').trim()) {
    parts.push(`Open antwoord: ${String(answer.openAnswer).trim()}`);
  }

  const optionText = formatBooleanOptions(answer);
  if (optionText) {
    parts.push(optionText);
  } else {
    const keyValueText = formatKeyValueAnswers(answer);
    if (keyValueText) parts.push(keyValueText);
  }

  if (hasFilledMathToolWork(answer.mathTools)) {
    parts.push(`Wiskunde: ${getMathToolSummary(answer.mathTools).replace(/\n/g, ' | ')}`);
  }

  return parts.join(' | ') || 'Antwoord opgeslagen';
};
