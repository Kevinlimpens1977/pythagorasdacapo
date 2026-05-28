import { CONTENT_BLOCK_LABELS } from '../../lib/contentBlockUtils.js';
import { normalizeMediaContent } from '../../lib/mediaUtils.js';
import { isAnswerCorrect } from '../../lib/answerNormalization.js';
import { buildQuestionPreviewModel } from '../../lib/questionPreviewUtils.js';

const TYPE_TO_KIND = {
  lessonBlock: 'lesson',
  contentBlock: 'lesson',
  theoryBlock: 'lesson',
  exampleBlock: 'lesson',
  summaryBlock: 'lesson',
  questionWindow: 'question',
  questionBlock: 'question',
  question: 'question',
  mediaBlock: 'media',
  media: 'media',
  slidedeckBlock: 'slidedeck',
  slidedeck: 'slidedeck'
};

const stripEmptyHtml = (value = '') => {
  const normalized = String(value || '').trim();
  return normalized === '<p></p>' ? '' : normalized;
};

const firstText = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';

const getContent = (object = {}) => object.content || object.block?.content || {};

const getQuestionSource = (object = {}) =>
  object.linkedVraag || object.question || object.vraag || object.block?.linkedVraag || object.block?.question || object;

const getBlockType = (object = {}) => {
  const contentType = object.blockType || object.contentBlockType || object.block?.type;
  if (contentType && contentType !== object.type) return contentType;

  if (object.type === 'theoryBlock') return 'theory';
  if (object.type === 'exampleBlock') return 'example';
  if (object.type === 'summaryBlock') return 'summary';
  if (object.type === 'mediaBlock') return 'media';
  if (object.type === 'slidedeckBlock') return 'slidedeck';
  if (object.type === 'questionWindow' || object.type === 'questionBlock') return 'question';
  return object.block?.type || object.type || 'theory';
};

export const getPresenterImportedObjectKind = (object = {}) => TYPE_TO_KIND[object?.type] || '';

export const isPresenterImportedObject = (object = {}) => Boolean(getPresenterImportedObjectKind(object));

const buildLessonModel = (object = {}) => {
  const content = getContent(object);
  const blockType = getBlockType(object);
  const imageUrl = firstText(content.imageUrl, content.mediaUrl, object.imageUrl, object.mediaUrl);

  return {
    kind: 'lesson',
    label: CONTENT_BLOCK_LABELS[blockType] || CONTENT_BLOCK_LABELS.theory,
    title: firstText(object.title, object.block?.title, content.title, CONTENT_BLOCK_LABELS[blockType], 'Lesblok'),
    bodyHtml: stripEmptyHtml(firstText(content.html, content.bodyHtml, content.text, object.bodyHtml, object.text)),
    imageUrl,
    caption: firstText(content.caption, content.altText, object.caption)
  };
};

const buildMediaModel = (object = {}) => {
  const content = getContent(object);
  const media = normalizeMediaContent({
    ...content,
    mediaUrl: firstText(content.mediaUrl, object.mediaUrl, content.imageUrl, object.imageUrl, content.pdfUrl, object.pdfUrl, content.videoUrl, object.videoUrl),
    mediaKind: content.mediaKind || object.mediaKind,
    contentType: content.contentType || object.contentType,
    caption: firstText(content.caption, object.caption),
    altText: firstText(content.altText, object.altText, object.title)
  });

  return {
    kind: 'media',
    label: CONTENT_BLOCK_LABELS.media,
    title: firstText(object.title, object.block?.title, content.title, 'Media'),
    bodyHtml: stripEmptyHtml(firstText(content.html, content.bodyHtml, content.text)),
    media
  };
};

const buildSlidedeckModel = (object = {}) => {
  const content = getContent(object);
  const pdfUrl = firstText(
    content.generatedDeckUrl,
    content.pdfUrl,
    content.sourcePdfUrl,
    object.generatedDeckUrl,
    object.pdfUrl,
    object.sourcePdfUrl
  );

  return {
    kind: 'slidedeck',
    label: CONTENT_BLOCK_LABELS.slidedeck,
    title: firstText(content.deckTitle, object.title, object.block?.title, 'Slidedeck'),
    bodyHtml: stripEmptyHtml(firstText(content.html, content.bodyHtml, content.text)),
    pdfUrl,
    packageId: firstText(content.slidedeckPackageId, object.slidedeckPackageId),
    storagePath: firstText(content.generatedDeckStoragePath, content.pdfStoragePath, object.pdfStoragePath)
  };
};

const buildQuestionModel = (object = {}) => {
  const question = getQuestionSource(object);
  const content = getContent(object);
  const preview = buildQuestionPreviewModel(question);
  const answer = question?.antwoord || object.antwoord || {};

  return {
    kind: 'question',
    label: CONTENT_BLOCK_LABELS.question,
    title: firstText(object.title, object.block?.title, question?.title, 'Vraag'),
    type: preview.type,
    promptHtml: stripEmptyHtml(firstText(preview.promptHtml, content.html, content.text, question?.content?.text)),
    segments: preview.segments || [],
    fields: preview.fields || [],
    orderItems: preview.orderItems || [],
    options: Array.isArray(answer.options)
      ? answer.options.map((option, index) => ({
          id: option.id || `option-${index + 1}`,
          text: option.text || `Optie ${index + 1}`,
          correct: Boolean(option.correct)
        }))
      : [],
    correctAnswer: answer.expected ?? answer.correctValue ?? answer.modelAnswer ?? answer.answer ?? ''
  };
};

export const getPresenterImportedObjectModel = (object = {}) => {
  const kind = getPresenterImportedObjectKind(object);

  if (kind === 'question') return buildQuestionModel(object);
  if (kind === 'media') return buildMediaModel(object);
  if (kind === 'slidedeck') return buildSlidedeckModel(object);
  if (kind === 'lesson') return buildLessonModel(object);

  return null;
};

export const getQuestionControlState = (model, answers = {}) => {
  if (!model || model.kind !== 'question') return { hasInput: false };

  if (model.type === 'invullen') {
    const hasInput = model.fields.some((field) => String(answers[field.id] || '').trim());
    return { hasInput };
  }

  if (model.type === 'meerkeuze') {
    const hasInput = Object.values(answers).some(Boolean);
    return { hasInput };
  }

  if (model.type === 'volgorde') {
    return { hasInput: Boolean(answers.orderTouched) };
  }

  if (model.type === 'numeriek') {
    return { hasInput: Boolean(String(answers.expectedValue || '').trim()) };
  }

  return { hasInput: Boolean(String(answers.openAnswer || '').trim()) };
};

export const getQuestionFeedbackStatus = (model, answers = {}, checked = false) => {
  if (!checked || !getQuestionControlState(model, answers).hasInput) return 'idle';

  if (model.type === 'invullen') {
    const correct = model.fields.length > 0 && model.fields.every((field) => isAnswerCorrect(answers[field.id], field.answer));
    return correct ? 'correct' : 'incorrect';
  }

  if (model.type === 'meerkeuze') {
    const correct = model.options.length > 0 && model.options.every((option) => Boolean(answers[option.id]) === option.correct);
    return correct ? 'correct' : 'incorrect';
  }

  if (model.type === 'volgorde') {
    const items = Array.isArray(answers.orderItems) ? answers.orderItems : [];
    const correct = items.length === model.orderItems.length && items.every((item, index) => item.id === model.orderItems[index]?.id);
    return correct ? 'correct' : 'incorrect';
  }

  if (model.type === 'numeriek') {
    return isAnswerCorrect(answers.expectedValue, model.correctAnswer) ? 'correct' : 'incorrect';
  }

  return isAnswerCorrect(answers.openAnswer, model.correctAnswer) ? 'correct' : 'incorrect';
};
