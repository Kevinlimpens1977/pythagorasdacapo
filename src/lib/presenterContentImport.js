import { CONTENT_BLOCK_LABELS, normalizeContentBlocks } from './contentBlockUtils.js';
import { getExerciseFields } from './exerciseBlockUtils.js';
import { normalizeMediaContent } from './mediaUtils.js';
import { createPresenterPage } from './presenterModel.js';
import { createPresenterObject } from './presenterObjects.js';
import { hasRenderableLessonHtml } from './lessonBlockPresentation.js';
import {
  buildGradableQuestionFromAssessmentItem,
  getAssessmentGradingType
} from './assessmentItemGrading.js';

const SNAPSHOT_VERSION = 1;
const DEFAULT_OBJECT_WIDTH = 1480;
const DEFAULT_OBJECT_HEIGHT = 880;
const DEFAULT_OBJECT_X = 220;
const DEFAULT_OBJECT_Y = 180;

// Een quiz of toets komt niet als één blok op het bord, maar als een
// inleidingspagina plus één vraagvenster per gekozen vraag (zie
// buildAssessmentPages). De docent kiest in de importdialoog welke vragen.
const ASSESSMENT_BLOCK_TYPES = new Set(['quiz', 'toets']);
const CONTENT_OBJECT_TYPES = new Set(['theory', 'example', 'media', 'question', 'slidedeck', ...ASSESSMENT_BLOCK_TYPES]);

const ASSESSMENT_ITEM_TYPE_LABELS = {
  meerkeuze: 'Meerkeuze',
  'waar-niet-waar': 'Waar of niet waar',
  numeriek: 'Getal',
  invullen: 'Invullen',
  volgorde: 'Volgorde',
  koppelen: 'Koppelen',
  open: 'Open vraag'
};

export const isPresenterAssessmentBlock = (block = {}) => ASSESSMENT_BLOCK_TYPES.has(block?.type);

const stripHtmlToText = (value = '') =>
  String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * De vragen van een quiz of toets zoals de importdialoog ze toont: nummer,
 * type en de vraagtekst. Zonder sleutel; die gaat pas mee in het bordvenster.
 */
export const getPresenterAssessmentItems = (block = {}) => {
  const items = Array.isArray(block?.content?.items) ? block.content.items : [];
  return items.map((item, index) => {
    const rawType = item?.type || item?.vraagtype || item?.answer?.type || item?.antwoord?.type || 'open';
    return {
      id: item?.id || `assessment-${index + 1}`,
      nummer: index + 1,
      type: rawType,
      typeLabel: ASSESSMENT_ITEM_TYPE_LABELS[rawType] || ASSESSMENT_ITEM_TYPE_LABELS[getAssessmentGradingType(item)] || 'Vraag',
      prompt: stripHtmlToText(item?.prompt || item?.question || item?.title || '') || `Vraag ${index + 1}`
    };
  });
};

const hasAssessmentIntro = (block = {}) => hasRenderableLessonHtml(block?.content?.html || '');

const resolveSelectedItemIds = (block, itemSelections) => {
  const all = getPresenterAssessmentItems(block).map((item) => item.id);
  const chosen = itemSelections?.[block.id];
  if (!Array.isArray(chosen)) return all;
  return all.filter((id) => chosen.includes(id));
};

/**
 * Hoeveel pagina's een import oplevert, zodat de dialoog dat vooraf kan
 * melden: gewone blokken tellen voor één, een quiz of toets voor de inleiding
 * plus het aantal gekozen vragen.
 */
export const countPresenterImportPages = ({ contentBlocks = [], itemSelections = {} } = {}) =>
  (Array.isArray(contentBlocks) ? contentBlocks : []).reduce((sum, block) => {
    if (!isPresenterAssessmentBlock(block)) return sum + 1;
    return sum + (hasAssessmentIntro(block) ? 1 : 0) + resolveSelectedItemIds(block, itemSelections).length;
  }, 0);

const createId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const stripTokenMetadata = (value) => {
  if (Array.isArray(value)) return value.map(stripTokenMetadata);
  if (!isPlainObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !key.toLowerCase().includes('token'))
      .map(([key, entryValue]) => [key, stripTokenMetadata(entryValue)])
  );
};

const toSerializableSnapshot = (value) => {
  if (value === undefined) return null;
  return JSON.parse(JSON.stringify(stripTokenMetadata(value)));
};

const compactObject = (value) => {
  if (Array.isArray(value)) return value.map(compactObject);
  if (!isPlainObject(value)) return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, compactObject(entryValue)])
  );
};

const pickParagraphSnapshot = (paragraaf = {}) =>
  compactObject({
    id: paragraaf.id,
    title: paragraaf.title || paragraaf.name,
    hoofdstukId: paragraaf.hoofdstukId,
    order: paragraaf.order
  });

const pickBlockSnapshot = (block = {}) =>
  compactObject({
    id: block.id,
    type: block.type,
    title: block.title,
    order: block.order
  });

const buildSourceSnapshot = ({ paragraaf, block, question, importedAt }) =>
  toSerializableSnapshot(
    compactObject({
      kind: 'helix-content-block',
      snapshotVersion: SNAPSHOT_VERSION,
      importedAt,
      paragraaf: pickParagraphSnapshot(paragraaf),
      block: pickBlockSnapshot(block),
      question: question
        ? {
            id: question.id,
            title: question.title,
            number: question.number,
            vraagtype: question.vraagtype
          }
        : undefined
    })
  );

const questionListToMap = (linkedQuestions) => {
  if (linkedQuestions instanceof Map) return linkedQuestions;
  if (Array.isArray(linkedQuestions)) {
    return new Map(linkedQuestions.filter((question) => question?.id).map((question) => [question.id, question]));
  }
  if (isPlainObject(linkedQuestions)) return new Map(Object.entries(linkedQuestions));
  return new Map();
};

const getBlockHtml = (block) => block?.content?.html || block?.content?.text || '';

const buildLessonBlockData = (block) =>
  toSerializableSnapshot({
    kind: block.type,
    title: block.title || '',
    html: getBlockHtml(block),
    imageUrl: block.content?.imageUrl || block.content?.mediaUrl || '',
    steps: Array.isArray(block.content?.steps) ? block.content.steps : [],
    crops: Array.isArray(block.content?.crops) ? block.content.crops : []
  });

const buildMediaBlockData = (block) => {
  const media = normalizeMediaContent(block.content || {});

  return toSerializableSnapshot({
    kind: 'media',
    title: block.title || '',
    html: block.content?.html || '',
    media
  });
};

const buildSlidedeckBlockData = (block) =>
  toSerializableSnapshot({
    kind: 'slidedeck',
    title: block.title || '',
    html: block.content?.html || '',
    slidedeck: {
      deckTitle: block.content?.deckTitle || block.title || '',
      pdfUrl: block.content?.generatedDeckUrl || '',
      pdfStoragePath: block.content?.generatedDeckStoragePath || '',
      slidedeckPackageId: block.content?.slidedeckPackageId || '',
      sourcePdfUrl: block.content?.sourcePdfUrl || '',
      sourcePdfStoragePath: block.content?.sourcePdfStoragePath || ''
    }
  });

// Vraagblokken zonder gekoppeld vraagdocument dragen hun opgave als
// content.exercise met genummerde invulvelden (de DV-seed). Zo'n blok is een
// inleverblok: het heeft per ontwerp geen antwoordsleutel. Het krijgt daarom
// expliciet vraagtype 'exercise' mee, zodat het bord dezelfde genummerde
// velden toont als de leerlingroute en de controleknop wegblijft. Zonder dit
// werd het 'open', verdwenen alle velden achter één tekstvak en kleurde elk
// antwoord rood.
const buildExerciseFallbackQuestion = (block) => {
  const fields = getExerciseFields(block);

  return {
    id: block.linkedVraagId || null,
    title: block.linkedVraagTitle || block.title || '',
    vraagtype: fields.length > 0 ? 'exercise' : (block.content?.exercise?.type || 'open'),
    content: { text: getBlockHtml(block) },
    antwoord: fields.length > 0
      ? { type: 'exercise', fields }
      : (block.content?.exercise || { fields: [] })
  };
};

const buildQuestionBlockData = (block, question) =>
  toSerializableSnapshot({
    kind: 'question',
    title: question?.title || block.title || '',
    blockPromptHtml: getBlockHtml(block),
    question: question || buildExerciseFallbackQuestion(block)
  });

const buildObjectData = (block, question) => {
  if (block.type === 'media') return buildMediaBlockData(block);
  if (block.type === 'slidedeck') return buildSlidedeckBlockData(block);
  if (block.type === 'question') return buildQuestionBlockData(block, question);
  return buildLessonBlockData(block);
};

const getObjectType = (blockType) => (blockType === 'question' ? 'questionWindow' : 'lessonBlock');

const getObjectHeight = (blockType) => {
  // Vraagvensters zijn klassikaal bedienbaar: er moet ruimte zijn voor grote
  // antwoordknoppen en het schermtoetsenbord van invul- en getalvragen.
  if (blockType === 'question') return 900;
  if (blockType === 'media' || blockType === 'slidedeck') return 900;
  return DEFAULT_OBJECT_HEIGHT;
};

const buildPresenterObjectFromBlock = ({ block, paragraaf, question, importedAt }) => {
  const source = buildSourceSnapshot({ paragraaf, block, question, importedAt });

  return createPresenterObject(getObjectType(block.type), {
    id: createId('presenter-object'),
    x: DEFAULT_OBJECT_X,
    y: DEFAULT_OBJECT_Y,
    width: DEFAULT_OBJECT_WIDTH,
    height: getObjectHeight(block.type),
    source,
    data: buildObjectData(block, question)
  });
};

const buildPresenterPageFromBlock = ({ block, paragraaf, question, importedAt }) => {
  const source = buildSourceSnapshot({ paragraaf, block, question, importedAt });

  return createPresenterPage({
    id: createId('presenter-page'),
    title: block.title || question?.title || 'Lesblok',
    source,
    objects: [
      buildPresenterObjectFromBlock({
        block,
        paragraaf,
        question,
        importedAt
      })
    ]
  });
};

/**
 * Quiz of toets -> pagina's. Eerst de inleiding (de tekst boven de vragen,
 * inclusief een eventuele situatie-afbeelding) als leskaart, daarna per
 * gekozen vraag een vraagvenster met dezelfde sleutel als de leerlingroute,
 * zodat het bord kan nakijken. Tokens worden door de snapshot weggestreept.
 */
const buildAssessmentPages = ({ block, paragraaf, importedAt, itemSelections }) => {
  const blockTitle = block.title || CONTENT_BLOCK_LABELS[block.type] || 'Toets';
  const rawItems = Array.isArray(block.content?.items) ? block.content.items : [];
  const overview = getPresenterAssessmentItems(block);
  const selectedIds = new Set(resolveSelectedItemIds(block, itemSelections));
  const pages = [];

  if (hasAssessmentIntro(block)) {
    const introBlock = {
      ...block,
      type: 'theory',
      title: `${blockTitle} - inleiding`,
      content: { html: block.content?.html || '' }
    };
    pages.push(buildPresenterPageFromBlock({ block: introBlock, paragraaf, question: null, importedAt }));
  }

  overview.forEach((item, index) => {
    if (!selectedIds.has(item.id)) return;
    const question = {
      ...buildGradableQuestionFromAssessmentItem({ ...rawItems[index], id: item.id }),
      title: `Vraag ${item.nummer}`,
      number: String(item.nummer)
    };
    const questionBlock = {
      ...block,
      type: 'question',
      title: `${blockTitle} - vraag ${item.nummer}`,
      linkedVraagId: item.id,
      content: { html: '' }
    };
    pages.push(buildPresenterPageFromBlock({ block: questionBlock, paragraaf, question, importedAt }));
  });

  return pages;
};

export const getPublishedPresenterContentBlocks = (contentBlocks = []) =>
  normalizeContentBlocks(contentBlocks).filter(
    (block) => block?.status === 'published' && CONTENT_OBJECT_TYPES.has(block.type)
  );

export const buildPresenterPagesFromHelixContent = ({
  paragraaf = {},
  contentBlocks = [],
  linkedQuestions = [],
  // Per quiz- of toetsblok de gekozen vraag-id's; ontbreekt een blok, dan
  // gaan al zijn vragen mee.
  itemSelections = {},
  importedAt = new Date().toISOString()
} = {}) => {
  const questionsById = questionListToMap(linkedQuestions);

  return getPublishedPresenterContentBlocks(contentBlocks).flatMap((block) => {
    if (isPresenterAssessmentBlock(block)) {
      return buildAssessmentPages({ block, paragraaf, importedAt, itemSelections });
    }
    return [buildPresenterPageFromBlock({
      block,
      paragraaf,
      question: block.linkedVraagId ? questionsById.get(block.linkedVraagId) || null : null,
      importedAt
    })];
  });
};

export const appendHelixContentImportToPresenterSession = (session, importOptions = {}) => {
  const pages = buildPresenterPagesFromHelixContent(importOptions);
  if (pages.length === 0) return session;

  return {
    ...session,
    pages: [...(Array.isArray(session?.pages) ? session.pages : []), ...pages],
    activePageId: pages[0].id,
    selectedObjectId: null,
    selectedObjectIds: [],
    dirty: true
  };
};
