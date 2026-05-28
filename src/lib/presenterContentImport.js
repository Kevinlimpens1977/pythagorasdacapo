import { normalizeContentBlocks } from './contentBlockUtils.js';
import { normalizeMediaContent } from './mediaUtils.js';
import { createPresenterPage } from './presenterModel.js';
import { createPresenterObject } from './presenterObjects.js';

const SNAPSHOT_VERSION = 1;
const DEFAULT_OBJECT_WIDTH = 1480;
const DEFAULT_OBJECT_HEIGHT = 880;
const DEFAULT_OBJECT_X = 220;
const DEFAULT_OBJECT_Y = 180;

const CONTENT_OBJECT_TYPES = new Set(['theory', 'example', 'media', 'question', 'slidedeck']);

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

const buildQuestionBlockData = (block, question) =>
  toSerializableSnapshot({
    kind: 'question',
    title: question?.title || block.title || '',
    blockPromptHtml: getBlockHtml(block),
    question: question || {
      id: block.linkedVraagId || null,
      title: block.linkedVraagTitle || block.title || '',
      vraagtype: block.content?.exercise?.type || 'open',
      content: { text: getBlockHtml(block) },
      antwoord: block.content?.exercise || { fields: [] }
    }
  });

const buildObjectData = (block, question) => {
  if (block.type === 'media') return buildMediaBlockData(block);
  if (block.type === 'slidedeck') return buildSlidedeckBlockData(block);
  if (block.type === 'question') return buildQuestionBlockData(block, question);
  return buildLessonBlockData(block);
};

const getObjectType = (blockType) => (blockType === 'question' ? 'questionWindow' : 'lessonBlock');

const getObjectHeight = (blockType) => {
  if (blockType === 'question') return 720;
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

export const getPublishedPresenterContentBlocks = (contentBlocks = []) =>
  normalizeContentBlocks(contentBlocks).filter(
    (block) => block?.status === 'published' && CONTENT_OBJECT_TYPES.has(block.type)
  );

export const buildPresenterPagesFromHelixContent = ({
  paragraaf = {},
  contentBlocks = [],
  linkedQuestions = [],
  importedAt = new Date().toISOString()
} = {}) => {
  const questionsById = questionListToMap(linkedQuestions);

  return getPublishedPresenterContentBlocks(contentBlocks).map((block) =>
    buildPresenterPageFromBlock({
      block,
      paragraaf,
      question: block.linkedVraagId ? questionsById.get(block.linkedVraagId) || null : null,
      importedAt
    })
  );
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
