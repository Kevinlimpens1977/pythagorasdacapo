export const LESSON_PREVIEW_MODES = ['published', 'draft'];

export const getLessonPreviewMode = (value = '') =>
  LESSON_PREVIEW_MODES.includes(value) ? value : 'published';

export const shouldIncludeDraftBlocksForPreview = ({
  isAdmin = false,
  previewMode = 'published'
} = {}) => Boolean(isAdmin && getLessonPreviewMode(previewMode) === 'draft');
