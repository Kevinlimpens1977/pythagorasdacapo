const clone = (value) => JSON.parse(JSON.stringify(value));

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const distributeTokens = (totalTokens, parts) => {
  if (parts.length === 0) return [];

  const base = Math.floor(totalTokens / parts.length);
  let remainder = totalTokens - base * parts.length;

  return parts.map((part) => {
    const tokens = base + (remainder > 0 ? 1 : 0);
    remainder -= 1;
    return { ...part, tokens };
  });
};

const answerPartBuilders = {
  open: () => [{ id: 'model-answer', label: 'Modelantwoord' }],
  meerkeuze: (answer) => (answer.options || []).map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    label: `Antwoordoptie ${index + 1}`
  })),
  numeriek: () => [{ id: 'expected-value', label: 'Correct getal' }],
  koppelen: (answer) => (answer.pairs || []).map((pair, index) => ({
    id: pair.id || `pair-${index + 1}`,
    label: `Koppelpaar ${index + 1}`
  })),
  invullen: (answer) => (answer.gaps || []).map((gap, index) => ({
    id: gap.id || `gap-${index + 1}`,
    label: `Invulveld ${index + 1}`
  })),
  volgorde: (answer) => (answer.items || []).map((item, index) => ({
    id: item.id || `item-${index + 1}`,
    label: `Volgorde-item ${index + 1}`
  }))
};

export const QUESTION_TYPES = [
  {
    id: 'open',
    label: 'Open vraag',
    description: 'Vrij antwoord met modelantwoord of rubric.',
    template: 'Leerling typt een eigen antwoord. Jij legt vast waarop je later beoordeelt.',
    defaultAnswer: () => ({ type: 'open', modelAnswer: '' })
  },
  {
    id: 'meerkeuze',
    label: 'Meerkeuze',
    description: 'Meerdere opties waarvan een of meer correct zijn.',
    template: 'Maak antwoordopties en vink het correcte antwoord aan.',
    defaultAnswer: () => ({
      type: 'meerkeuze',
      options: [
        { id: createId('option'), text: '', correct: true, explanation: '' },
        { id: createId('option'), text: '', correct: false, explanation: '' }
      ]
    })
  },
  {
    id: 'numeriek',
    label: 'Numeriek',
    description: 'Getal met tolerantie en optionele eenheid.',
    template: 'Leg het verwachte getal, marge en eenheid vast.',
    defaultAnswer: () => ({ type: 'numeriek', expected: 0, tolerance: 0.5, unit: '', hintBijFout: '' })
  },
  {
    id: 'koppelen',
    label: 'Koppelen',
    description: 'Paren van begrippen en antwoorden.',
    template: 'Elke rij bestaat uit een linker- en rechterkant die bij elkaar horen.',
    defaultAnswer: () => ({ type: 'koppelen', pairs: [{ id: createId('pair'), left: '', right: '' }] })
  },
  {
    id: 'invullen',
    label: 'Invullen',
    description: 'Tekst met invulvelden.',
    template: 'Plaats de cursor in de tekst en klik op Maak gat. Vul daarna in het gat het correcte antwoord in.',
    defaultAnswer: () => ({ type: 'invullen', text: '', segments: [{ type: 'text', text: '' }], gaps: [] })
  },
  {
    id: 'volgorde',
    label: 'Volgorde',
    description: 'Items in de juiste volgorde zetten.',
    template: 'Voeg de stappen toe in de correcte volgorde.',
    defaultAnswer: () => ({ type: 'volgorde', items: [{ id: createId('item'), text: '' }] })
  }
];

export const QUESTION_TYPE_OPTIONS = QUESTION_TYPES.map(({ id, label, description }) => ({
  id,
  label,
  description
}));

export const getQuestionTypeDefinition = (questionType) =>
  QUESTION_TYPES.find((type) => type.id === questionType) || QUESTION_TYPES[0];

export const buildDefaultAnswerForQuestionType = (questionType) =>
  clone(getQuestionTypeDefinition(questionType).defaultAnswer());

export const getAnswerPartsForQuestionType = (questionType, answer) => {
  const definition = getQuestionTypeDefinition(questionType);
  const builder = answerPartBuilders[definition.id] || answerPartBuilders.open;
  return builder(answer || {});
};

export const buildDefaultTokenConfigForQuestionType = (questionType, answer, totalTokens = 10) => {
  const distribution = distributeTokens(totalTokens, getAnswerPartsForQuestionType(questionType, answer));
  return {
    enabled: true,
    totalTokens,
    distribution
  };
};

export const normalizeQuestionTokenConfig = (questionType, answer, tokenConfig) => {
  const fallback = buildDefaultTokenConfigForQuestionType(questionType, answer);
  const totalTokens = Number.isFinite(Number(tokenConfig?.totalTokens))
    ? Math.max(0, Math.round(Number(tokenConfig.totalTokens)))
    : fallback.totalTokens;
  const existingDistribution = Array.isArray(tokenConfig?.distribution) ? tokenConfig.distribution : [];
  const existingById = new Map(existingDistribution.map((part) => [part.id, part]));
  const fallbackById = new Map(fallback.distribution.map((part) => [part.id, part]));
  const preservedTotal = existingDistribution.reduce((sum, part) => sum + Math.max(0, Math.round(Number(part.tokens) || 0)), 0);
  const missingParts = fallback.distribution.filter((part) => !existingById.has(part.id));
  const remainingTokens = Math.max(0, totalTokens - preservedTotal);
  const missingDistribution = distributeTokens(remainingTokens, missingParts);

  return {
    enabled: tokenConfig?.enabled !== false,
    totalTokens,
    distribution: fallback.distribution.map((part) => {
      const existing = existingById.get(part.id);
      if (existing) {
        return {
          id: part.id,
          label: existing.label || fallbackById.get(part.id)?.label || part.label,
          tokens: Math.max(0, Math.round(Number(existing.tokens) || 0))
        };
      }
      return missingDistribution.find((missing) => missing.id === part.id) || part;
    })
  };
};
