import { normalizeParagraphMetadata } from './paragraphMetadata.js';

export const CONTENT_BLOCK_STATUSES = ['draft', 'needs_review', 'ready', 'published', 'archived'];

export const CONTENT_BLOCK_STATUS_LABELS = {
  draft: 'Concept',
  needs_review: 'Review nodig',
  ready: 'Klaar',
  published: 'Gepubliceerd',
  archived: 'Gearchiveerd'
};

const READY_STATUSES = new Set(['ready', 'published']);
const TEXT_BLOCK_TYPES = new Set(['theory', 'example', 'summary']);
const ASSESSMENT_BLOCK_TYPES = new Set(['quiz', 'toets']);

export const normalizeContentBlockStatus = (status) =>
  CONTENT_BLOCK_STATUSES.includes(status) ? status : 'draft';

export const getContentBlockStatusLabel = (status) =>
  CONTENT_BLOCK_STATUS_LABELS[normalizeContentBlockStatus(status)];

const stripHtml = (value = '') =>
  String(value || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const hasText = (value) => stripHtml(value).length > 0;

const createIssue = (code, message, severity = 'error') => ({
  code,
  message,
  severity
});

const getAnswerType = (question = {}) =>
  question.vraagtype || question.questionType || question.antwoord?.type || question.answer?.type || 'open';

const hasChoiceAnswer = (answer = {}) =>
  Array.isArray(answer.options) &&
  answer.options.length >= 2 &&
  answer.options.some((option) => option.correct === true) &&
  answer.options.every((option) => hasText(option.text || option.label));

const hasNumericAnswer = (answer = {}) =>
  answer.expected !== undefined ||
  answer.value !== undefined ||
  answer.correctValue !== undefined ||
  answer.correctAnswer !== undefined;

const hasMatchingAnswer = (answer = {}) =>
  Array.isArray(answer.pairs) &&
  answer.pairs.length > 0 &&
  answer.pairs.every((pair) => hasText(pair.left || pair.term) && hasText(pair.right || pair.match));

const hasFillInAnswer = (answer = {}) =>
  Array.isArray(answer.gaps) &&
  answer.gaps.length > 0 &&
  answer.gaps.every((gap) => hasText(gap.answer || gap.correctAnswer));

const hasOrderAnswer = (answer = {}) =>
  Array.isArray(answer.items) &&
  answer.items.length >= 2 &&
  answer.items.every((item) => hasText(item.text || item.label));

const hasOpenAnswer = (answer = {}) =>
  hasText(answer.modelAnswer || answer.correctAnswer || answer.answer || answer.rubric);

const validateAnswerContract = (type, answer = {}) => {
  if (type === 'meerkeuze' || type === 'waar-niet-waar') return hasChoiceAnswer(answer);
  if (type === 'numeriek') return hasNumericAnswer(answer);
  if (type === 'koppelen') return hasMatchingAnswer(answer);
  if (type === 'invullen') return hasFillInAnswer(answer);
  if (type === 'volgorde') return hasOrderAnswer(answer);
  return hasOpenAnswer(answer);
};

const validateQuestionBlock = (block = {}) => {
  const errors = [];
  const linkedVraag = block.linkedVraag || block.question || null;
  const linkedVraagId = block.linkedVraagId || linkedVraag?.id || '';

  if (!linkedVraagId) {
    errors.push(createIssue('question_missing', 'Koppel eerst een vraag aan dit lesblok.'));
    return errors;
  }

  if (!linkedVraag) {
    errors.push(createIssue('question_unavailable', 'De gekoppelde vraag kon niet worden gevonden.'));
    return errors;
  }

  const questionStatus = normalizeContentBlockStatus(linkedVraag.status);
  if (!READY_STATUSES.has(questionStatus)) {
    errors.push(createIssue('question_not_ready', 'De gekoppelde vraag moet eerst klaar of gepubliceerd zijn.'));
  }

  const questionText = linkedVraag.content?.text || linkedVraag.content?.html || linkedVraag.prompt || linkedVraag.title || '';
  if (!hasText(questionText)) {
    errors.push(createIssue('question_text_missing', 'De gekoppelde vraag heeft nog geen vraagtekst.'));
  }

  const answer = linkedVraag.antwoord || linkedVraag.answer || {};
  if (!validateAnswerContract(getAnswerType(linkedVraag), answer)) {
    errors.push(createIssue('question_answer_missing', 'De gekoppelde vraag heeft nog geen bruikbaar antwoordcontract.'));
  }

  return errors;
};

const validateAssessmentItem = (item = {}, index = 0) => {
  const errors = [];
  const type = item.type || item.vraagtype || item.answer?.type || 'meerkeuze';

  if (!hasText(item.prompt || item.question || item.title)) {
    errors.push(createIssue('assessment_item_prompt_missing', `Vraag ${index + 1} heeft nog geen vraagtekst.`));
  }

  if (!validateAnswerContract(type, item.answer || item.antwoord || {})) {
    errors.push(createIssue('assessment_item_answer_missing', `Vraag ${index + 1} heeft nog geen bruikbaar antwoord.`));
  }

  return errors;
};

const validateAssessmentBlock = (block = {}) => {
  const items = Array.isArray(block.content?.items) ? block.content.items : [];
  if (items.length === 0) {
    return [createIssue('assessment_items_missing', 'Voeg minimaal een toets- of quizvraag toe.')];
  }

  return items.flatMap(validateAssessmentItem);
};

const validateMediaBlock = (block = {}) => {
  const content = block.content || {};
  const hasMediaSource = Boolean(content.mediaUrl || content.imageUrl || content.storagePath || content.thumbnailUrl);
  if (!hasMediaSource && !hasText(content.html)) {
    return [createIssue('media_missing', 'Voeg media, een afbeelding, link of korte instructietekst toe.')];
  }
  return [];
};

const validateSlidedeckBlock = (block = {}) => {
  const content = block.content || {};
  if (!content.slidedeckPackageId) {
    return [createIssue('slidedeck_package_missing', 'Kies eerst een NotebookLM-slidedeckpakket.')];
  }
  if (!content.generatedDeckUrl && !content.generatedDeckStoragePath) {
    return [createIssue('slidedeck_pdf_missing', 'Upload eerst de gegenereerde NotebookLM-PDF bij dit slidedeckpakket.')];
  }
  return [];
};

const validateGameBlock = (block = {}) => {
  const content = block.content || {};
  if (!content.gameId && content.placeholderStatus !== 'planned') {
    return [createIssue('game_missing', 'Kies een game of markeer dit blok als geplande placeholder.')];
  }
  return [];
};

export const validateContentBlockReadiness = (block = {}) => {
  const status = normalizeContentBlockStatus(block.status);
  const errors = [];
  const warnings = [];
  const content = block.content || {};

  if (TEXT_BLOCK_TYPES.has(block.type) && !hasText(content.html)) {
    errors.push(createIssue('content_missing', 'Vul eerst zichtbare lesinhoud in.'));
  }

  if (block.type === 'question') {
    errors.push(...validateQuestionBlock(block));
  }

  if (block.type === 'media') {
    errors.push(...validateMediaBlock(block));
  }

  if (block.type === 'slidedeck') {
    errors.push(...validateSlidedeckBlock(block));
  }

  if (ASSESSMENT_BLOCK_TYPES.has(block.type)) {
    errors.push(...validateAssessmentBlock(block));
  }

  if (block.type === 'game') {
    errors.push(...validateGameBlock(block));
  }

  return {
    status,
    isPublicationIntent: READY_STATUSES.has(status),
    canPublish: errors.length === 0,
    errors,
    warnings
  };
};

const hasListOrText = (value) =>
  Array.isArray(value) ? value.some((item) => hasText(item)) : hasText(value);

export const getReadinessIssueRenderKey = (issue = {}, index = 0) =>
  `${issue.code || 'issue'}-${index}`;

export const validateParagraphReadiness = ({ paragraaf = {}, blocks = [] } = {}) => {
  const errors = [];
  const warnings = [];
  const metadata = normalizeParagraphMetadata(paragraaf);

  if (!hasListOrText(metadata.learningGoals)) {
    errors.push(createIssue('paragraph_learning_goals_missing', 'Vul minimaal een leerdoel voor deze paragraaf in.'));
  }

  if (!hasListOrText(metadata.evidenceProduct)) {
    errors.push(createIssue('paragraph_evidence_missing', 'Vul het bewijsproduct of de eindprestatie voor deze paragraaf in.'));
  }

  const blockResults = blocks.map((block) => ({
    blockId: block.id || '',
    blockTitle: block.title || '',
    blockType: block.type || '',
    ...validateContentBlockReadiness(block)
  }));

  const blockingBlockResults = blockResults.filter(
    (result) => result.isPublicationIntent && result.canPublish === false
  );

  blockingBlockResults.forEach((result) => {
    result.errors.forEach((issue) => {
      errors.push(createIssue(
        `block_${issue.code}`,
        `${result.blockTitle || result.blockType || 'Lesblok'}: ${issue.message}`
      ));
    });
  });

  return {
    canPublish: errors.length === 0,
    errors,
    warnings,
    blockResults
  };
};
