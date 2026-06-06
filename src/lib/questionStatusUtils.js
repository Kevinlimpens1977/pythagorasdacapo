export const QUESTION_STATUS_OPTIONS = [
  { id: 'draft', label: 'Concept' },
  { id: 'published', label: 'Gepubliceerd' }
];

export const normalizeQuestionStatus = (status = '') =>
  QUESTION_STATUS_OPTIONS.some((option) => option.id === status) ? status : 'draft';

export const getQuestionStatusLabel = (status = '') =>
  QUESTION_STATUS_OPTIONS.find((option) => option.id === normalizeQuestionStatus(status))?.label || 'Concept';
