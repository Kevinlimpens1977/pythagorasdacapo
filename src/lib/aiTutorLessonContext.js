import { getMathToolSummary } from './mathToolboxUtils.js';
import { sanitizeOpenAnswerAssessmentFeedback } from './openAnswerAssessmentFeedback.js';

const stripHtml = (value = '') =>
  String(value || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const summarizeAnswer = (answer = {}) => {
  const parts = [];
  if (answer.openAnswer) parts.push(`Antwoord of aanpak: ${String(answer.openAnswer).trim()}`);
  if (answer.expectedValue) parts.push(`Numeriek antwoord: ${String(answer.expectedValue).trim()}`);

  const filledGaps = Object.entries(answer)
    .filter(([key, value]) => /^gap_/i.test(key) && String(value || '').trim())
    .map(([key, value]) => `${key}: ${String(value).trim()}`);
  if (filledGaps.length) parts.push(`Invulantwoorden: ${filledGaps.join(', ')}`);

  const selectedOptions = Object.entries(answer)
    .filter(([key, value]) => /^option-/i.test(key) && value === true)
    .map(([key]) => key);
  if (selectedOptions.length) parts.push(`Gekozen opties: ${selectedOptions.join(', ')}`);

  const mathSummary = getMathToolSummary(answer.mathTools);
  if (mathSummary) parts.push(mathSummary);

  return parts.join('\n');
};

const blockTitleForRecord = (record = {}, blocksById = new Map()) => {
  const blockId = record.blockId || record.vraagId || '';
  const block = blocksById.get(blockId);
  return record.blockTitle || record.vraagTitle || block?.title || block?.linkedVraag?.title || blockId || 'Vraag';
};

const summarizeProgressRecord = (record = {}, blocksById = new Map()) => {
  const feedback = sanitizeOpenAnswerAssessmentFeedback(record.openAnswerAssessment?.feedback || '');
  const status = record.completed || record.isCorrect ? 'afgerond' : 'nog niet goed';
  return [
    `${blockTitleForRecord(record, blocksById)}: ${status}`,
    `${record.attempts || 0} poging${record.attempts === 1 ? '' : 'en'}`,
    feedback ? `laatste feedback: ${feedback}` : '',
    summarizeAnswer(record.lastAnswer || '')
  ].filter(Boolean).join('; ');
};

export const buildAiTutorLessonContext = ({
  paragraaf = null,
  hoofdstuk = null,
  blocks = [],
  currentBlock = null,
  currentPreviewAnswers = {},
  currentAssessmentFeedback = '',
  progressRecords = []
} = {}) => {
  const linkedVraag = currentBlock?.linkedVraag || {};
  const prompt = stripHtml(linkedVraag?.content?.text || currentBlock?.content?.html || currentBlock?.content?.text || '');
  const currentAnswerSummary = summarizeAnswer(currentPreviewAnswers);
  const unit = linkedVraag?.antwoord?.unit || '';
  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const currentId = currentBlock?.id || '';

  const history = progressRecords
    .filter((record) => (record.blockId || record.vraagId) !== currentId)
    .slice(-6)
    .map((record) => summarizeProgressRecord(record, blocksById))
    .filter(Boolean);

  return [
    paragraaf?.title ? `Paragraaf: ${paragraaf.title}` : '',
    hoofdstuk?.title ? `Hoofdstuk: ${hoofdstuk.title}` : '',
    currentBlock?.title || linkedVraag?.title ? `Huidige vraag: ${currentBlock?.title || linkedVraag?.title}` : '',
    prompt ? `Vraagtekst op scherm: ${prompt}` : '',
    currentAnswerSummary,
    unit ? `Eenheid volgens vraag: ${unit}` : '',
    currentAssessmentFeedback ? `Feedback op huidige poging: ${sanitizeOpenAnswerAssessmentFeedback(currentAssessmentFeedback)}` : '',
    history.length ? `Eerdere vragen in deze paragraaf:\n- ${history.join('\n- ')}` : 'Eerdere vragen in deze paragraaf: nog geen opgeslagen fouten of pogingen.'
  ].filter(Boolean).join('\n');
};
