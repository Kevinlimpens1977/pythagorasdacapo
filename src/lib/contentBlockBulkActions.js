import {
  getDefaultContentForBlockType,
  normalizeContentBlockSettings
} from './contentBlockUtils.js';

const clone = (value) => JSON.parse(JSON.stringify(value ?? null));

export const getSelectedContentBlocks = (blocks = [], selectedIds = new Set()) => {
  const selected = selectedIds instanceof Set ? selectedIds : new Set(selectedIds || []);
  return blocks.filter((block) => block?.id && selected.has(block.id));
};

export const getBulkSelectionLabel = (count = 0) => {
  if (count === 0) return 'Geen blokken geselecteerd';
  if (count === 1) return '1 blok geselecteerd';
  return `${count} blokken geselecteerd`;
};

export const buildDuplicateContentBlockPayload = (block = {}) => {
  const type = block.type || 'theory';
  return {
    type,
    title: `${String(block.title || 'Lesblok').trim() || 'Lesblok'} (kopie)`,
    status: 'draft',
    content: clone(block.content || getDefaultContentForBlockType(type)),
    settings: normalizeContentBlockSettings(block.settings, type),
    linkedVraagId: null
  };
};

export const buildBulkContentBlockSettingsPatch = (block = {}, settingsPatch = {}) => {
  const type = block.type || 'theory';
  return {
    settings: normalizeContentBlockSettings({
      ...(block.settings || {}),
      ...settingsPatch
    }, type)
  };
};

export const getBulkMovedContentBlocks = (blocks = [], selectedIds = new Set(), direction = 'up') => {
  const selected = selectedIds instanceof Set ? selectedIds : new Set(selectedIds || []);
  if (selected.size === 0) return blocks.map((block, index) => ({ ...block, order: index + 1 }));

  const ordered = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));
  const indexes = ordered
    .map((block, index) => (selected.has(block.id) ? index : -1))
    .filter((index) => index >= 0);

  if (indexes.length === 0) return ordered.map((block, index) => ({ ...block, order: index + 1 }));

  const minIndex = Math.min(...indexes);
  const maxIndex = Math.max(...indexes);
  const movingDown = direction === 'down';
  if (!movingDown && minIndex === 0) return ordered.map((block, index) => ({ ...block, order: index + 1 }));
  if (movingDown && maxIndex === ordered.length - 1) return ordered.map((block, index) => ({ ...block, order: index + 1 }));

  const selectedBlocks = ordered.filter((block) => selected.has(block.id));
  const remainingBlocks = ordered.filter((block) => !selected.has(block.id));
  const insertionIndex = movingDown ? maxIndex - selectedBlocks.length + 2 : minIndex - 1;

  return [
    ...remainingBlocks.slice(0, insertionIndex),
    ...selectedBlocks,
    ...remainingBlocks.slice(insertionIndex)
  ].map((block, index) => ({
    ...block,
    order: index + 1
  }));
};
