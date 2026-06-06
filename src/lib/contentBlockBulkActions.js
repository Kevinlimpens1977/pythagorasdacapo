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
