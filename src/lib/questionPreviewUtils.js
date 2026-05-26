import {
  buildSegmentsFromLegacyFillBlank,
  getFillBlankGapsFromSegments
} from './fillBlankUtils.js';
import { isAnswerCorrect } from './answerNormalization.js';

const stripEmptyHtml = (html = '') => {
  const normalized = String(html || '').trim();
  return normalized === '<p></p>' ? '' : normalized;
};

export const buildQuestionPreviewModel = (vraag = {}) => {
  const type = vraag.vraagtype || vraag.antwoord?.type || 'open';
  const antwoord = vraag.antwoord || {};
  const promptHtml = stripEmptyHtml(vraag.content?.text || '');

  if (type === 'invullen') {
    const segments = Array.isArray(antwoord.segments) && antwoord.segments.length > 0
      ? antwoord.segments
      : buildSegmentsFromLegacyFillBlank(antwoord.text || '', antwoord.gaps || []);
    const fields = getFillBlankGapsFromSegments(segments).map((gap, index) => ({
      ...gap,
      label: `Invulveld ${index + 1}`
    }));

    return {
      type,
      promptHtml,
      segments,
      fields,
      empty: !promptHtml && segments.every((segment) => !segment.text && segment.type !== 'gap')
    };
  }

  return {
    type,
    promptHtml,
    segments: [],
    fields: [],
    empty: !promptHtml
  };
};

export const getPreviewAnswerStatus = (studentAnswer, correctAnswer) => {
  if (!String(studentAnswer || '').trim()) return 'empty';
  return isAnswerCorrect(studentAnswer, correctAnswer) ? 'correct' : 'incorrect';
};
