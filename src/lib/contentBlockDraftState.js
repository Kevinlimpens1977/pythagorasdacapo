const sortValue = (value) => {
  if (Array.isArray(value)) return value.map(sortValue);
  if (!value || typeof value !== 'object') return value;

  return Object.keys(value)
    .sort()
    .reduce((result, key) => ({
      ...result,
      [key]: sortValue(value[key])
    }), {});
};

const stableStringify = (value) => JSON.stringify(sortValue(value));

export const buildContentBlockDraftSnapshot = ({
  title = '',
  status = 'draft',
  content = {},
  settings = {},
  linkedVraagId = ''
} = {}) => ({
  title,
  status,
  content,
  settings,
  linkedVraagId: linkedVraagId || ''
});

export const hasContentBlockDraftChanges = (initial = {}, current = {}) =>
  stableStringify(buildContentBlockDraftSnapshot(initial)) !== stableStringify(buildContentBlockDraftSnapshot(current));

export const shouldCloseContentBlockDraft = (
  hasDraftChanges,
  confirmFn = () => true
) => !hasDraftChanges || confirmFn('Je hebt niet-opgeslagen wijzigingen. Weet je zeker dat je de lesblokstudio wilt sluiten?');

export const getContentBlockDraftStorageKey = (blockId = '') => {
  const safeBlockId = String(blockId || '').trim();
  return safeBlockId ? `helix:content-block-draft:${safeBlockId}` : '';
};

export const buildStoredContentBlockDraft = ({
  blockId = '',
  snapshot = {},
  savedAt = Date.now()
} = {}) => ({
  version: 1,
  blockId: String(blockId || ''),
  savedAt,
  snapshot: buildContentBlockDraftSnapshot(snapshot)
});

export const parseStoredContentBlockDraft = (rawValue = '', expectedBlockId = '') => {
  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed || parsed.version !== 1) return null;
    if (String(parsed.blockId || '') !== String(expectedBlockId || '')) return null;
    if (!parsed.snapshot || typeof parsed.snapshot !== 'object') return null;
    return {
      version: 1,
      blockId: parsed.blockId,
      savedAt: Number(parsed.savedAt) || 0,
      snapshot: buildContentBlockDraftSnapshot(parsed.snapshot)
    };
  } catch {
    return null;
  }
};

export const shouldRecoverStoredContentBlockDraft = (initial = {}, storedDraft = null) =>
  Boolean(storedDraft?.snapshot) &&
  hasContentBlockDraftChanges(initial, storedDraft.snapshot);
