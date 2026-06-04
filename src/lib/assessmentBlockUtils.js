const createId = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const ASSESSMENT_ITEM_TYPES = [
  { id: 'waar-niet-waar', label: 'Waar / niet waar' },
  { id: 'meerkeuze', label: 'Meerkeuze' },
  { id: 'open', label: 'Open vraag' }
];

export const getAssessmentItemType = (type) =>
  ASSESSMENT_ITEM_TYPES.some((itemType) => itemType.id === type) ? type : 'meerkeuze';

export const createAssessmentOption = ({ text = '', correct = false } = {}) => ({
  id: createId('option'),
  text,
  correct
});

const defaultOptionsForType = (type) => {
  if (type === 'open') return [];
  if (type === 'waar-niet-waar') {
    return [
      createAssessmentOption({ text: 'Waar', correct: true }),
      createAssessmentOption({ text: 'Niet waar', correct: false })
    ];
  }
  return [
    createAssessmentOption({ text: 'Antwoord A', correct: true }),
    createAssessmentOption({ text: 'Antwoord B', correct: false })
  ];
};

export const createAssessmentItem = ({ type = 'meerkeuze', tokens = 0, prompt = '' } = {}) => {
  const itemType = getAssessmentItemType(type);
  return {
    id: createId('assessment'),
    type: itemType,
    prompt,
    options: defaultOptionsForType(itemType),
    feedback: '',
    tokens: Math.max(0, Math.round(Number(tokens) || 0))
  };
};

export const normalizeAssessmentOption = (option = {}, index = 0) => ({
  id: option.id || createId('option'),
  text: String(option.text ?? option.label ?? `Antwoord ${index + 1}`),
  correct: option.correct === true
});

export const normalizeAssessmentItem = (item = {}, index = 0) => {
  const itemType = getAssessmentItemType(item.type);
  const rawOptions = Array.isArray(item.options) ? item.options : [];
  const normalizedOptions = itemType === 'open'
    ? []
    : (rawOptions.length > 0 ? rawOptions : defaultOptionsForType(itemType)).map(normalizeAssessmentOption);

  if (itemType !== 'open' && normalizedOptions.every((option) => option.correct !== true)) {
    normalizedOptions[0] = { ...normalizedOptions[0], correct: true };
  }

  return {
    id: item.id || createId(`assessment-${index + 1}`),
    type: itemType,
    prompt: String(item.prompt ?? item.question ?? ''),
    options: normalizedOptions,
    feedback: String(item.feedback ?? ''),
    tokens: Math.max(0, Math.round(Number(item.tokens) || 0))
  };
};

export const normalizeAssessmentItems = (items = []) =>
  (Array.isArray(items) ? items : []).map(normalizeAssessmentItem);

export const sumAssessmentItemTokens = (items = []) =>
  normalizeAssessmentItems(items).reduce((sum, item) => sum + item.tokens, 0);

export const moveAssessmentItem = (items = [], fromIndex, toIndex) => {
  const normalized = normalizeAssessmentItems(items);
  if (fromIndex < 0 || fromIndex >= normalized.length || toIndex < 0 || toIndex >= normalized.length) return normalized;
  const next = [...normalized];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export const duplicateAssessmentItem = (items = [], index) => {
  const normalized = normalizeAssessmentItems(items);
  const source = normalized[index];
  if (!source) return normalized;
  const duplicate = {
    ...source,
    id: createId('assessment-copy'),
    prompt: source.prompt ? `${source.prompt} (kopie)` : '',
    options: source.options.map((option) => ({ ...option, id: createId('option') }))
  };
  return [
    ...normalized.slice(0, index + 1),
    duplicate,
    ...normalized.slice(index + 1)
  ];
};

export const removeAssessmentItem = (items = [], index) =>
  normalizeAssessmentItems(items).filter((_, itemIndex) => itemIndex !== index);

export const updateAssessmentItemType = (item = {}, type) => {
  const nextType = getAssessmentItemType(type);
  return normalizeAssessmentItem({
    ...item,
    type: nextType,
    options: defaultOptionsForType(nextType)
  });
};
