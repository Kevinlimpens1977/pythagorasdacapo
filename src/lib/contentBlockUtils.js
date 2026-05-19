export const CONTENT_BLOCK_TYPES = [
  'theory',
  'example',
  'question',
  'media',
  'summary'
];

export const CONTENT_BLOCK_LABELS = {
  theory: 'Theorie',
  example: 'Voorbeeld',
  question: 'Vraag',
  media: 'Media',
  summary: 'Samenvatting'
};

export const normalizeContentBlocks = (blocks = []) => {
  return [...blocks]
    .filter((block) => block && block.isArchived !== true)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((block, index) => ({
      ...block,
      order: index + 1
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
    return {
      ...base,
      type: 'theory',
      content: htmlToPlainText(block.content?.caption || block.content?.html || ''),
      image: block.content?.mediaUrl || block.content?.imageUrl || null
    };
  }

  if (block.type === 'question') {
    return {
      ...base,
      type: 'exercise',
      exercise: block.content?.exercise || { fields: [] }
    };
  }

  return base;
};

export const blocksToSlides = (blocks = []) => {
  return normalizeContentBlocks(blocks)
    .filter((block) => block.status === 'published' || block.status === undefined)
    .map(blockToSlide);
};
