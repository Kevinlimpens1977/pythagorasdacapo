import { normalizeMediaContent } from './mediaUtils.js';

export const CONTENT_BLOCK_TYPES = [
  'theory',
  'example',
  'question',
  'media',
  'summary',
  'game',
  'slidedeck'
];

export const CONTENT_BLOCK_LABELS = {
  theory: 'Theorie',
  example: 'Voorbeeld',
  question: 'Vraag',
  media: 'Media',
  summary: 'Samenvatting',
  game: 'Game',
  slidedeck: 'Slidedeck'
};

export const DEFAULT_CONTENT_BLOCK_SETTINGS = {
  allowAiHelp: false,
  allowMathToolbox: false
};

export const normalizeContentBlockSettings = (settings = {}, blockType = '') => ({
  allowAiHelp: settings.allowAiHelp ?? (blockType === 'question' ? true : DEFAULT_CONTENT_BLOCK_SETTINGS.allowAiHelp),
  allowMathToolbox: settings.allowMathToolbox ?? settings.allowCalculator ?? DEFAULT_CONTENT_BLOCK_SETTINGS.allowMathToolbox
});

export const buildContentBlockFromSnapshot = (snapshot) => {
  const data = snapshot?.data?.() || {};
  const { id: sourceDataId, ...rest } = data;
  return {
    ...rest,
    ...(sourceDataId ? { sourceDataId } : {}),
    id: snapshot.id
  };
};

export const getDefaultContentForBlockType = (type) => {
  if (type === 'example') {
    return { html: '', steps: [], imageUrl: '', crops: [] };
  }

  if (type === 'media') {
    return {
      html: '',
      mediaKind: 'image',
      mediaUrl: '',
      storagePath: '',
      fileName: '',
      contentType: '',
      size: 0,
      caption: '',
      altText: '',
      thumbnailUrl: '',
      crops: []
    };
  }

  if (type === 'question') {
    return { html: '', exercise: { fields: [] }, crops: [] };
  }

  if (type === 'game') {
    return { html: '', gameId: '', settings: {}, crops: [] };
  }

  if (type === 'slidedeck') {
    return {
      html: '',
      slidedeckPackageId: '',
      deckTitle: '',
      generatedDeckUrl: '',
      generatedDeckStoragePath: '',
      sourcePdfUrl: '',
      sourcePdfStoragePath: ''
    };
  }

  return { html: '', imageUrl: '', crops: [] };
};

export const normalizeContentBlocks = (blocks = []) => {
  return [...blocks]
    .filter((block) => block && block.isArchived !== true)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((block, index) => ({
      ...block,
      order: index + 1,
      settings: normalizeContentBlockSettings(block.settings, block.type)
    }));
};

export const getReorderedBlocks = (blocks = [], blockId, direction) => {
  const normalized = normalizeContentBlocks(blocks);
  const currentIndex = normalized.findIndex((block) => block.id === blockId);

  if (currentIndex === -1) return normalized;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= normalized.length) return normalized;

  const reordered = [...normalized];
  const [movedBlock] = reordered.splice(currentIndex, 1);
  reordered.splice(targetIndex, 0, movedBlock);

  return reordered.map((block, index) => ({
    ...block,
    order: index + 1
  }));
};

export const getReorderedBlocksByIndex = (blocks = [], blockId, targetIndex) => {
  const normalized = normalizeContentBlocks(blocks);
  const currentIndex = normalized.findIndex((block) => block.id === blockId);

  if (currentIndex === -1) return normalized;

  const safeTargetIndex = Math.min(
    Math.max(Number.isFinite(targetIndex) ? targetIndex : currentIndex, 0),
    normalized.length - 1
  );

  if (safeTargetIndex === currentIndex) return normalized;

  const reordered = [...normalized];
  const [movedBlock] = reordered.splice(currentIndex, 1);
  reordered.splice(safeTargetIndex, 0, movedBlock);

  return reordered.map((block, index) => ({
    ...block,
    order: index + 1
  }));
};

export const htmlToPlainText = (html = '') => {
  return String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const appendText = (existing = '', text = '') => {
  const cleanExisting = String(existing || '').trim();
  const cleanText = String(text || '').trim();
  if (!cleanText) return cleanExisting;
  return cleanExisting ? `${cleanExisting}\n\n${cleanText}` : cleanText;
};

export const mergeCropResultsIntoBlockContent = (type, content = {}, cropResults = []) => {
  const text = cropResults
    .filter((crop) => crop.type === 'text' && crop.text)
    .map((crop) => crop.text.trim())
    .filter(Boolean)
    .join('\n\n');
  const firstImage = cropResults.find((crop) => crop.type === 'image' && crop.downloadURL);
  const nextContent = {
    ...content,
    crops: [
      ...(Array.isArray(content.crops) ? content.crops : []),
      ...cropResults
    ]
  };

  if (type === 'media') {
    if (text) {
      nextContent.caption = appendText(nextContent.caption || nextContent.html || '', text);
    }
    if (firstImage?.downloadURL) {
      nextContent.mediaKind = 'image';
      nextContent.mediaUrl = firstImage.downloadURL;
      nextContent.storagePath = firstImage.storagePath || nextContent.storagePath || '';
      nextContent.contentType = 'image/jpeg';
    }
    return nextContent;
  }

  if (type === 'example') {
    if (text) nextContent.html = appendText(nextContent.html || nextContent.text || '', text);
    if (!Array.isArray(nextContent.steps)) nextContent.steps = [];
    if (firstImage?.downloadURL) nextContent.imageUrl = firstImage.downloadURL;
    return nextContent;
  }

  if (type === 'summary') {
    if (text) nextContent.html = appendText(nextContent.html || nextContent.text || '', text);
    if (firstImage?.downloadURL) nextContent.imageUrl = firstImage.downloadURL;
    return nextContent;
  }

  if (text) nextContent.html = appendText(nextContent.html || nextContent.text || '', text);
  if (firstImage?.downloadURL) nextContent.imageUrl = firstImage.downloadURL;
  return nextContent;
};

export const buildContentBlockPreview = (block = {}) => {
  if (block.type === 'question') {
    return block.linkedVraagTitle || (block.linkedVraagId ? `Gekoppelde vraag: ${block.linkedVraagId}` : 'Nog geen vraag gekoppeld');
  }

  if (block.type === 'game') {
    return block.content?.gameTitle || block.content?.gameId || 'Nog geen game gekozen';
  }

  if (block.type === 'slidedeck') {
    return block.content?.deckTitle || block.content?.slidedeckPackageId || 'Nog geen slidedeck gekozen';
  }

  if (block.type === 'media') {
    const media = normalizeMediaContent(block.content || {});
    const kindLabel = {
      image: 'Afbeelding',
      youtube: 'YouTube',
      video: 'Video',
      pdf: 'PDF'
    }[media.mediaKind] || 'Media';
    return htmlToPlainText(block.content?.caption || block.content?.html || '') || (media.mediaUrl ? `${kindLabel} toegevoegd` : 'Nog geen media');
  }

  const text = htmlToPlainText(block.content?.html || block.content?.text || '');
  const details = [];
  if (Array.isArray(block.content?.steps) && block.content.steps.length > 0) {
    details.push(`${block.content.steps.length} stappen`);
  }
  if (block.content?.imageUrl || block.content?.mediaUrl) {
    details.push('afbeelding');
  }

  return [text, ...details].filter(Boolean).join(' ') || 'Nog leeg';
};

export const blockToSlide = (block) => {
  const base = {
    id: block.id,
    blockId: block.id,
    type: 'theory',
    heading: block.title || CONTENT_BLOCK_LABELS[block.type] || 'Lesblok',
    content: htmlToPlainText(block.content?.html || block.content?.text || '')
  };

  if (block.content?.imageUrl || block.content?.mediaUrl) {
    base.image = block.content.imageUrl || block.content.mediaUrl;
  }
  if (block.paragraafId) base.paragraafId = block.paragraafId;
  if (block.hoofdstukId) base.hoofdstukId = block.hoofdstukId;
  if (block.linkedVraagId) base.linkedVraagId = block.linkedVraagId;

  if (block.type === 'example') {
    return {
      ...base,
      type: 'demo_exercise',
      exercise: {
        type: 'steps',
        steps: block.content?.steps?.length
          ? block.content.steps
          : [htmlToPlainText(block.content?.html || block.content?.text || '')].filter(Boolean)
      }
    };
  }

  if (block.type === 'summary') {
    return {
      ...base,
      type: 'summary'
    };
  }

  if (block.type === 'media') {
    const media = normalizeMediaContent(block.content || {});
    return {
      ...base,
      type: 'theory',
      content: htmlToPlainText(block.content?.caption || block.content?.html || ''),
      image: media.mediaKind === 'image' ? media.mediaUrl : null,
      mediaKind: media.mediaKind,
      mediaUrl: media.mediaUrl,
      mediaStoragePath: media.storagePath
    };
  }

  if (block.type === 'question') {
    return {
      ...base,
      type: 'exercise',
      exercise: block.content?.exercise || { fields: [] }
    };
  }

  if (block.type === 'game') {
    return {
      ...base,
      type: 'game',
      gameId: block.content?.gameId || null
    };
  }

  if (block.type === 'slidedeck') {
    return {
      ...base,
      type: 'slidedeck',
      content: block.content?.html || '',
      deckTitle: block.content?.deckTitle || block.title || 'Slidedeck',
      pdfUrl: block.content?.generatedDeckUrl || '',
      pdfStoragePath: block.content?.generatedDeckStoragePath || '',
      slidedeckPackageId: block.content?.slidedeckPackageId || '',
      sourcePdfUrl: block.content?.sourcePdfUrl || ''
    };
  }

  return base;
};

export const blocksToSlides = (blocks = []) => {
  return normalizeContentBlocks(blocks)
    .filter((block) => block.status === 'published' || block.status === undefined)
    .map(blockToSlide);
};

export const getToggledContentBlockStatus = (status) =>
  status === 'published' ? 'draft' : 'published';
