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
