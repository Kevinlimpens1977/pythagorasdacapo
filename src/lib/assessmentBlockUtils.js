import { QUESTION_TYPES, buildDefaultAnswerForQuestionType } from './questionTypeRegistry.js';

const createId = (prefix = 'item') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const clone = (value) => JSON.parse(JSON.stringify(value));

const trimLower = (value) => String(value ?? '').trim().toLocaleLowerCase('nl-NL');

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(String(value ?? '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const questionTypeItems = QUESTION_TYPES.map(({ id, label, description }) => ({ id, label, description }));

export const ASSESSMENT_COGNITIVE_SKILLS = [
  { id: 'herkennen', label: 'Herkennen' },
  { id: 'begrijpen', label: 'Begrijpen' },
  { id: 'toepassen', label: 'Toepassen' },
  { id: 'uitleggen', label: 'Uitleggen' },
  { id: 'maken_controleren', label: 'Maken/controleren' }
];

export const ASSESSMENT_MASTERY_LEVELS = [
  { id: 'basis', label: 'Basis' },
  { id: 'plus', label: 'Plus' },
  { id: 'verdieping', label: 'Verdieping' }
];

export const ASSESSMENT_SCAFFOLDING_ROLES = [
  { id: 'ik_doe_voor', label: 'Ik doe voor' },
  { id: 'samen_oefenen', label: 'Samen oefenen' },
  { id: 'zelf_proberen', label: 'Zelf proberen' },
  { id: 'bewijs_leveren', label: 'Bewijs leveren' },
  { id: 'reflecteren', label: 'Reflecteren' }
];

export const ASSESSMENT_ITEM_TYPES = [
  { id: 'waar-niet-waar', label: 'Waar / niet waar', description: 'Snelle ja/nee-check met twee vaste opties.' },
  ...questionTypeItems
];

export const CLOSED_ASSESSMENT_ITEM_TYPES = new Set([
  'waar-niet-waar',
  'meerkeuze',
  'numeriek',
  'koppelen',
  'invullen',
  'volgorde'
]);

export const getAssessmentItemType = (type) =>
  ASSESSMENT_ITEM_TYPES.some((itemType) => itemType.id === type) ? type : 'meerkeuze';

const getAllowedId = (value, allowedItems, fallback) =>
  allowedItems.some((item) => item.id === value) ? value : fallback;

export const normalizeAssessmentTaxonomy = (item = {}) => {
  const taxonomy = item.taxonomy || {};
  return {
    learningGoal: String(taxonomy.learningGoal ?? item.learningGoal ?? item.leerdoel ?? '').trim(),
    cognitiveSkill: getAllowedId(
      taxonomy.cognitiveSkill ?? item.cognitiveSkill ?? item.taxonomyLevel,
      ASSESSMENT_COGNITIVE_SKILLS,
      'begrijpen'
    ),
    masteryLevel: getAllowedId(
      taxonomy.masteryLevel ?? item.masteryLevel ?? item.niveau,
      ASSESSMENT_MASTERY_LEVELS,
      'basis'
    ),
    scaffoldingRole: getAllowedId(
      taxonomy.scaffoldingRole ?? item.scaffoldingRole ?? item.rol,
      ASSESSMENT_SCAFFOLDING_ROLES,
      'zelf_proberen'
    )
  };
};

export const createAssessmentOption = ({ text = '', correct = false, explanation = '', misconception = '' } = {}) => ({
  id: createId('option'),
  text,
  correct,
  explanation,
  misconception
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

const defaultAnswerForAssessmentType = (type) => {
  if (type === 'waar-niet-waar') {
    return {
      type: 'meerkeuze',
      options: defaultOptionsForType('waar-niet-waar')
    };
  }

  if (type === 'koppelen') {
    return {
      type: 'koppelen',
      pairs: [
        { id: createId('pair'), left: 'Begrip 1', right: 'Betekenis 1' },
        { id: createId('pair'), left: 'Begrip 2', right: 'Betekenis 2' }
      ]
    };
  }

  if (type === 'invullen') {
    const gapId = createId('gap');
    return {
      type: 'invullen',
      text: 'Typ hier een zin met een invulwoord.',
      segments: [
        { type: 'text', text: 'Typ hier een zin met een ' },
        { type: 'gap', id: gapId },
        { type: 'text', text: '.' }
      ],
      gaps: [{ id: gapId, answer: 'invulwoord', alternatives: [] }]
    };
  }

  if (type === 'volgorde') {
    return {
      type: 'volgorde',
      items: [
        { id: createId('item'), text: 'Stap 1' },
        { id: createId('item'), text: 'Stap 2' },
        { id: createId('item'), text: 'Stap 3' }
      ]
    };
  }

  return buildDefaultAnswerForQuestionType(type);
};

const normalizeOption = (option = {}, index = 0) => ({
  id: option.id || createId('option'),
  text: String(option.text ?? option.label ?? `Antwoord ${index + 1}`),
  correct: option.correct === true,
  explanation: String(option.explanation ?? option.feedback ?? ''),
  misconception: String(option.misconception ?? option.misconceptie ?? option.misconceptionNote ?? '')
});

export const normalizeAssessmentOption = normalizeOption;

const normalizeChoiceAnswer = (type, rawAnswer = {}, legacyOptions = []) => {
  const fallbackOptions = defaultOptionsForType(type);
  const sourceOptions = Array.isArray(rawAnswer.options) && rawAnswer.options.length > 0
    ? rawAnswer.options
    : Array.isArray(legacyOptions) && legacyOptions.length > 0
      ? legacyOptions
      : fallbackOptions;
  const options = sourceOptions.map(normalizeOption);

  if (type === 'waar-niet-waar') {
    const trueOption = options[0] || normalizeOption({ text: 'Waar', correct: true });
    const falseOption = options[1] || normalizeOption({ text: 'Niet waar', correct: false }, 1);
    const nextOptions = [
      { ...trueOption, text: trueOption.text || 'Waar' },
      { ...falseOption, text: falseOption.text || 'Niet waar' }
    ];
    if (nextOptions.every((option) => option.correct !== true)) {
      nextOptions[0] = { ...nextOptions[0], correct: true };
    }
    return { type: 'meerkeuze', options: nextOptions };
  }

  if (options.every((option) => option.correct !== true)) {
    options[0] = { ...options[0], correct: true };
  }

  return { type: 'meerkeuze', options };
};

const normalizeNumericAnswer = (rawAnswer = {}) => ({
  type: 'numeriek',
  expected: parseNumber(rawAnswer.expected ?? rawAnswer.value ?? rawAnswer.correctAnswer, 0),
  tolerance: Math.max(0, parseNumber(rawAnswer.tolerance, 0.5)),
  unit: String(rawAnswer.unit ?? ''),
  hintBijFout: String(rawAnswer.hintBijFout ?? rawAnswer.hint ?? '')
});

const normalizePair = (pair = {}, index = 0) => ({
  id: pair.id || createId('pair'),
  left: String(pair.left ?? pair.term ?? `Begrip ${index + 1}`),
  right: String(pair.right ?? pair.match ?? `Betekenis ${index + 1}`)
});

const normalizeMatchingAnswer = (rawAnswer = {}) => {
  const pairs = Array.isArray(rawAnswer.pairs) && rawAnswer.pairs.length > 0
    ? rawAnswer.pairs.map(normalizePair)
    : defaultAnswerForAssessmentType('koppelen').pairs;
  return { type: 'koppelen', pairs };
};

const normalizeGap = (gap = {}, index = 0) => ({
  id: gap.id || createId('gap'),
  answer: String(gap.answer ?? gap.correctAnswer ?? `antwoord ${index + 1}`),
  alternatives: Array.isArray(gap.alternatives)
    ? gap.alternatives.map((alternative) => String(alternative))
    : []
});

const normalizeFillInAnswer = (rawAnswer = {}) => {
  const fallback = defaultAnswerForAssessmentType('invullen');
  const gaps = Array.isArray(rawAnswer.gaps) && rawAnswer.gaps.length > 0
    ? rawAnswer.gaps.map(normalizeGap)
    : fallback.gaps;
  const segments = Array.isArray(rawAnswer.segments) && rawAnswer.segments.length > 0
    ? rawAnswer.segments
    : fallback.segments;
  return {
    type: 'invullen',
    text: String(rawAnswer.text ?? fallback.text),
    segments,
    gaps
  };
};

const normalizeOrderItem = (item = {}, index = 0) => ({
  id: item.id || createId('order'),
  text: String(item.text ?? item.label ?? `Stap ${index + 1}`)
});

const normalizeOrderAnswer = (rawAnswer = {}) => {
  const items = Array.isArray(rawAnswer.items) && rawAnswer.items.length > 0
    ? rawAnswer.items.map(normalizeOrderItem)
    : defaultAnswerForAssessmentType('volgorde').items;
  return { type: 'volgorde', items };
};

const normalizeOpenAnswer = (rawAnswer = {}) => ({
  type: 'open',
  modelAnswer: String(rawAnswer.modelAnswer ?? rawAnswer.correctAnswer ?? rawAnswer.answer ?? ''),
  rubric: String(rawAnswer.rubric ?? ''),
  teacherNotes: String(rawAnswer.teacherNotes ?? '')
});

export const normalizeAssessmentAnswer = (type, answer = {}, legacyOptions = []) => {
  const itemType = getAssessmentItemType(type);
  if (itemType === 'waar-niet-waar' || itemType === 'meerkeuze') {
    return normalizeChoiceAnswer(itemType, answer, legacyOptions);
  }
  if (itemType === 'numeriek') return normalizeNumericAnswer(answer);
  if (itemType === 'koppelen') return normalizeMatchingAnswer(answer);
  if (itemType === 'invullen') return normalizeFillInAnswer(answer);
  if (itemType === 'volgorde') return normalizeOrderAnswer(answer);
  return normalizeOpenAnswer(answer);
};

export const getAssessmentOptionsForItem = (item = {}) => {
  const answerOptions = item.answer?.options;
  const legacyOptions = item.options;
  if (Array.isArray(answerOptions)) return answerOptions.map(normalizeOption);
  if (Array.isArray(legacyOptions)) return legacyOptions.map(normalizeOption);
  return defaultOptionsForType(item.type);
};

export const createAssessmentItem = ({ type = 'meerkeuze', tokens = 0, prompt = '' } = {}) => {
  const itemType = getAssessmentItemType(type);
  const answer = normalizeAssessmentAnswer(itemType, defaultAnswerForAssessmentType(itemType));
  return {
    id: createId('assessment'),
    type: itemType,
    vraagtype: itemType,
    prompt,
    answer,
    options: itemType === 'open' || !Array.isArray(answer.options) ? [] : answer.options.map(clone),
    feedback: '',
    tokens: Math.max(0, Math.round(Number(tokens) || 0)),
    taxonomy: normalizeAssessmentTaxonomy({})
  };
};

export const normalizeAssessmentItem = (item = {}, index = 0) => {
  const itemType = getAssessmentItemType(item.type ?? item.vraagtype);
  const legacyOptions = Array.isArray(item.options) ? item.options : [];
  const answer = normalizeAssessmentAnswer(itemType, item.answer ?? item.antwoord ?? {}, legacyOptions);

  return {
    id: item.id || createId(`assessment-${index + 1}`),
    type: itemType,
    vraagtype: itemType,
    prompt: String(item.prompt ?? item.question ?? item.title ?? ''),
    answer,
    options: Array.isArray(answer.options) ? answer.options.map(clone) : [],
    feedback: String(item.feedback ?? item.explanation ?? ''),
    tokens: Math.max(0, Math.round(Number(item.tokens) || 0)),
    taxonomy: normalizeAssessmentTaxonomy(item)
  };
};

const makeUniqueItemId = (id, index, seenIds) => {
  const baseId = String(id || createId(`assessment-${index + 1}`));
  if (!seenIds.has(baseId)) {
    seenIds.add(baseId);
    return baseId;
  }

  let suffix = 2;
  let candidate = `${baseId}-${suffix}`;
  while (seenIds.has(candidate)) {
    suffix += 1;
    candidate = `${baseId}-${suffix}`;
  }
  seenIds.add(candidate);
  return candidate;
};

export const normalizeAssessmentItems = (items = []) =>
  (() => {
    const seenIds = new Set();
    return (Array.isArray(items) ? items : []).map(normalizeAssessmentItem).map((item, index) => ({
      ...item,
      id: makeUniqueItemId(item.id, index, seenIds)
    }));
  })();

export const sumAssessmentItemTokens = (items = []) =>
  normalizeAssessmentItems(items).reduce((sum, item) => sum + item.tokens, 0);

const createMatrixRow = ({ key, label, items = 0, tokens = 0 }) => ({
  key,
  label,
  items,
  tokens
});

const summarizeBy = (items = [], getKey, getLabel) => {
  const rowsByKey = new Map();
  items.forEach((item) => {
    const key = getKey(item);
    const current = rowsByKey.get(key) || createMatrixRow({
      key,
      label: getLabel(key),
      items: 0,
      tokens: 0
    });
    rowsByKey.set(key, {
      ...current,
      items: current.items + 1,
      tokens: current.tokens + item.tokens
    });
  });
  return [...rowsByKey.values()].sort((a, b) => a.label.localeCompare(b.label, 'nl-NL'));
};

const labelFor = (items, fallbackLabel) => (key) =>
  items.find((item) => item.id === key)?.label || fallbackLabel;

export const getAssessmentMatrixSummary = (items = []) => {
  const normalizedItems = normalizeAssessmentItems(items);
  return {
    totalItems: normalizedItems.length,
    totalTokens: sumAssessmentItemTokens(normalizedItems),
    byLearningGoal: summarizeBy(
      normalizedItems,
      (item) => item.taxonomy.learningGoal || 'geen_leerdoel',
      (key) => key === 'geen_leerdoel' ? 'Geen leerdoel gekoppeld' : key
    ),
    byCognitiveSkill: summarizeBy(
      normalizedItems,
      (item) => item.taxonomy.cognitiveSkill,
      labelFor(ASSESSMENT_COGNITIVE_SKILLS, 'Onbekend')
    ),
    byMasteryLevel: summarizeBy(
      normalizedItems,
      (item) => item.taxonomy.masteryLevel,
      labelFor(ASSESSMENT_MASTERY_LEVELS, 'Onbekend')
    ),
    byScaffoldingRole: summarizeBy(
      normalizedItems,
      (item) => item.taxonomy.scaffoldingRole,
      labelFor(ASSESSMENT_SCAFFOLDING_ROLES, 'Onbekend')
    )
  };
};

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
    ...clone(source),
    id: createId('assessment-copy'),
    prompt: source.prompt ? `${source.prompt} (kopie)` : '',
    options: source.options.map((option) => ({ ...option, id: createId('option') }))
  };
  if (Array.isArray(duplicate.answer?.options)) {
    duplicate.answer.options = duplicate.answer.options.map((option) => ({ ...option, id: createId('option') }));
    duplicate.options = duplicate.answer.options.map(clone);
  }
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
    vraagtype: nextType,
    answer: defaultAnswerForAssessmentType(nextType),
    options: defaultOptionsForType(nextType)
  });
};

export const isClosedAssessmentItem = (item = {}) =>
  CLOSED_ASSESSMENT_ITEM_TYPES.has(getAssessmentItemType(item.type ?? item.vraagtype));

const evaluateChoice = (item, answerValue) => {
  const selected = Array.isArray(answerValue) ? answerValue : [answerValue].filter(Boolean);
  const correctIds = getAssessmentOptionsForItem(item).filter((option) => option.correct).map((option) => option.id).sort();
  const selectedIds = selected.map(String).sort();
  return correctIds.length === selectedIds.length && correctIds.every((id, index) => id === selectedIds[index]);
};

const evaluateMatching = (item, answerValue = {}) =>
  item.answer.pairs.every((pair) => trimLower(answerValue[pair.id]) === trimLower(pair.right));

const evaluateFillIn = (item, answerValue = {}) =>
  item.answer.gaps.every((gap) => {
    const accepted = [gap.answer, ...(gap.alternatives || [])].map(trimLower).filter(Boolean);
    return accepted.includes(trimLower(answerValue[gap.id]));
  });

const evaluateOrder = (item, answerValue = []) =>
  Array.isArray(answerValue)
    && answerValue.length === item.answer.items.length
    && item.answer.items.every((orderItem, index) => answerValue[index] === orderItem.id);

export const evaluateAssessmentAnswer = (rawItem = {}, answerValue) => {
  const item = normalizeAssessmentItem(rawItem);
  let correct = false;

  if (item.type === 'waar-niet-waar' || item.type === 'meerkeuze') {
    correct = evaluateChoice(item, answerValue);
  } else if (item.type === 'numeriek') {
    const value = parseNumber(answerValue, Number.NaN);
    correct = Number.isFinite(value) && Math.abs(value - item.answer.expected) <= item.answer.tolerance;
  } else if (item.type === 'koppelen') {
    correct = evaluateMatching(item, answerValue);
  } else if (item.type === 'invullen') {
    correct = evaluateFillIn(item, answerValue);
  } else if (item.type === 'volgorde') {
    correct = evaluateOrder(item, answerValue);
  }

  return {
    correct,
    closed: isClosedAssessmentItem(item),
    feedback: item.feedback || ''
  };
};
