import { CONTENT_BLOCK_LABELS } from '../../lib/contentBlockUtils.js';
import { normalizeMediaContent } from '../../lib/mediaUtils.js';
import { buildQuestionPreviewModel } from '../../lib/questionPreviewUtils.js';
import { getExerciseFields } from '../../lib/exerciseBlockUtils.js';
import {
  GRADE_REASONS,
  buildInitialOrderItems,
  getOpenModelAnswer,
  gradeQuestionAnswer
} from '../../lib/questionGrading.js';

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

const getObjectData = (object = {}) => object.data || {};

const getContent = (object = {}) =>
  object.content || object.block?.content || object.data || {};

const getQuestionSource = (object = {}) =>
  object.linkedVraag ||
  object.question ||
  object.vraag ||
  object.data?.question ||
  object.block?.linkedVraag ||
  object.block?.question ||
  object;

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

export const getPresenterImportedObjectKind = (object = {}) => {
  const dataKind = object?.data?.kind;
  if (dataKind === 'question') return 'question';
  if (dataKind === 'media') return 'media';
  if (dataKind === 'slidedeck') return 'slidedeck';
  if (dataKind === 'theory' || dataKind === 'example' || dataKind === 'summary') return 'lesson';

  return TYPE_TO_KIND[object?.type] || '';
};

export const isPresenterImportedObject = (object = {}) => Boolean(getPresenterImportedObjectKind(object));

const buildLessonModel = (object = {}) => {
  const data = getObjectData(object);
  const content = getContent(object);
  const blockType = data.kind || getBlockType(object);
  const imageUrl = firstText(data.imageUrl, content.imageUrl, content.mediaUrl, object.imageUrl, object.mediaUrl);

  return {
    kind: 'lesson',
    label: CONTENT_BLOCK_LABELS[blockType] || CONTENT_BLOCK_LABELS.theory,
    title: firstText(data.title, object.title, object.block?.title, content.title, CONTENT_BLOCK_LABELS[blockType], 'Lesblok'),
    bodyHtml: stripEmptyHtml(firstText(data.html, content.html, content.bodyHtml, content.text, object.bodyHtml, object.text)),
    imageUrl,
    caption: firstText(data.caption, content.caption, content.altText, object.caption)
  };
};

const buildMediaModel = (object = {}) => {
  const data = getObjectData(object);
  const content = getContent(object);
  const dataMedia = data.media || {};
  const media = normalizeMediaContent({
    ...dataMedia,
    ...content,
    mediaUrl: firstText(dataMedia.mediaUrl, content.mediaUrl, object.mediaUrl, content.imageUrl, object.imageUrl, content.pdfUrl, object.pdfUrl, content.videoUrl, object.videoUrl),
    mediaKind: dataMedia.mediaKind || content.mediaKind || object.mediaKind,
    contentType: dataMedia.contentType || content.contentType || object.contentType,
    caption: firstText(dataMedia.caption, content.caption, object.caption),
    altText: firstText(dataMedia.altText, content.altText, object.altText, object.title)
  });

  return {
    kind: 'media',
    label: CONTENT_BLOCK_LABELS.media,
    title: firstText(data.title, object.title, object.block?.title, content.title, 'Media'),
    bodyHtml: stripEmptyHtml(firstText(data.html, content.html, content.bodyHtml, content.text)),
    media
  };
};

const buildSlidedeckModel = (object = {}) => {
  const data = getObjectData(object);
  const content = getContent(object);
  const slidedeck = data.slidedeck || {};
  const pdfUrl = firstText(
    slidedeck.pdfUrl,
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
    title: firstText(slidedeck.deckTitle, data.title, content.deckTitle, object.title, object.block?.title, 'Slidedeck'),
    bodyHtml: stripEmptyHtml(firstText(data.html, content.html, content.bodyHtml, content.text)),
    pdfUrl,
    packageId: firstText(slidedeck.slidedeckPackageId, content.slidedeckPackageId, object.slidedeckPackageId),
    storagePath: firstText(slidedeck.pdfStoragePath, content.generatedDeckStoragePath, content.pdfStoragePath, object.pdfStoragePath)
  };
};

// Tokens horen nooit in de Presenter zichtbaar te zijn. De import strijkt ze
// al weg, maar het bordmodel mag ook nooit per ongeluk een tokenveld uit een
// oudere sessie of een direct meegegeven object doorgeven.
const stripTokenKeys = (value) => {
  if (Array.isArray(value)) return value.map(stripTokenKeys);
  if (value === null || typeof value !== 'object') return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.toLowerCase().includes('token'))
      .map(([key, entryValue]) => [key, stripTokenKeys(entryValue)])
  );
};

const buildExerciseFields = (answer = {}) =>
  getExerciseFields({ content: { exercise: answer } }).map((field, index) => ({
    ...field,
    label: field.label || `Opdracht ${index + 1}`
  }));

const buildQuestionModel = (object = {}) => {
  const data = getObjectData(object);
  const question = getQuestionSource(object);
  const content = getContent(object);
  const preview = buildQuestionPreviewModel(question);
  const answer = stripTokenKeys(question?.antwoord || object.antwoord || {});
  const isExercise = preview.type === 'exercise';

  return {
    kind: 'question',
    label: CONTENT_BLOCK_LABELS.question,
    title: firstText(data.title, object.title, object.block?.title, question?.title, 'Vraag'),
    type: preview.type,
    promptHtml: stripEmptyHtml(firstText(preview.promptHtml, data.blockPromptHtml, content.html, content.text, question?.content?.text)),
    segments: preview.segments || [],
    fields: isExercise ? buildExerciseFields(answer) : (preview.fields || []),
    orderItems: preview.orderItems || [],
    pairs: Array.isArray(answer.pairs)
      ? answer.pairs.map((pair, index) => ({
          id: pair.id || `pair-${index + 1}`,
          left: pair.left || pair.prompt || `Links ${index + 1}`,
          right: pair.right || pair.answer || `Rechts ${index + 1}`
        }))
      : [],
    options: Array.isArray(answer.options)
      ? answer.options.map((option, index) => ({
          id: option.id || `option-${index + 1}`,
          text: option.text || `Optie ${index + 1}`,
          correct: Boolean(option.correct)
        }))
      : [],
    modelAnswer: getOpenModelAnswer({ antwoord: answer }),
    // De volledige antwoordsleutel gaat mee zodat het bord kan nakijken via
    // dezelfde gedeelde grader als de leerlingroute. Deze vorm blijft
    // docent-only: nooit hergebruiken voor een leerlingscherm.
    answerKey: answer
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

export const buildQuestionInitialAnswers = (model) => ({
  orderItems: buildInitialOrderItems(model?.orderItems || [])
});

export const getQuestionControlState = (model, answers = {}) => {
  if (!model || model.kind !== 'question') return { hasInput: false };

  if (model.type === 'exercise') {
    const hasInput = (model.fields || []).some((field) => String(answers[field.id] || '').trim());
    return { hasInput };
  }

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

  if (model.type === 'koppelen') {
    return { hasInput: Object.keys(answers.pairs || {}).length > 0 };
  }

  if (model.type === 'numeriek') {
    return { hasInput: Boolean(String(answers.expectedValue || '').trim()) };
  }

  return { hasInput: Boolean(String(answers.openAnswer || '').trim()) };
};

/**
 * Vertaalt een bordmodel naar de invoer van de gedeelde grader. Het bord doet
 * hiermee GEEN eigen vergelijking meer: alles loopt via
 * src/lib/questionGrading.js, dezelfde laag als de leerlingroute.
 */
export const buildQuestionGradingInput = (model, answers = {}) => ({
  vraag: {
    vraagtype: model?.type,
    antwoord: model?.answerKey || {}
  },
  preview: {
    type: model?.type,
    fields: model?.fields || [],
    orderItems: model?.orderItems || []
  },
  answers
});

export const gradeQuestionOnBoard = (model, answers = {}) => {
  if (!model || model.kind !== 'question') {
    return { canGrade: false, isCorrect: false, parts: [], reason: GRADE_REASONS.NOT_SCORED };
  }
  return gradeQuestionAnswer(buildQuestionGradingInput(model, answers));
};

/**
 * 'idle' | 'correct' | 'incorrect' | 'unknown'
 *
 * 'unknown' is bewust een eigen status: zonder antwoordsleutel (of bij een
 * open vraag die niet lokaal te rekenen valt) zegt het bord "docent kijkt na"
 * in plaats van alles rood te kleuren.
 */
export const getQuestionFeedbackStatus = (model, answers = {}, checked = false) => {
  if (!checked || !getQuestionControlState(model, answers).hasInput) return 'idle';

  const grade = gradeQuestionOnBoard(model, answers);
  if (!grade.canGrade) return 'unknown';
  return grade.isCorrect ? 'correct' : 'incorrect';
};
