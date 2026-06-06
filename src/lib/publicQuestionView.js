const cleanText = (value) => String(value || '').trim();

const getQuestionType = (vraag = {}) =>
  vraag.vraagtype || vraag.questionType || vraag.antwoord?.type || vraag.answer?.type || 'open';

const sanitizeOptions = (options = []) =>
  (Array.isArray(options) ? options : []).map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    text: cleanText(option.text || option.label || `Optie ${index + 1}`)
  }));

const sanitizeSegments = (segments = []) =>
  (Array.isArray(segments) ? segments : []).map((segment) => {
    if (segment?.type === 'gap') {
      return {
        type: 'gap',
        id: segment.id || ''
      };
    }
    return {
      type: segment?.type || 'text',
      text: String(segment?.text || '')
    };
  });

const sanitizeGaps = (gaps = [], segments = []) => {
  const sourceGaps = Array.isArray(gaps) && gaps.length > 0
    ? gaps
    : segments.filter((segment) => segment?.type === 'gap');
  return sourceGaps.map((gap, index) => ({
    id: gap.id || `gap-${index + 1}`
  }));
};

const sanitizeOrderItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item, index) => ({
    id: item.id || `item-${index + 1}`,
    text: cleanText(item.text || item.label)
  })).filter((item) => item.text);

const buildPublicOrderItems = (items = []) => {
  const sanitizedItems = sanitizeOrderItems(items);
  if (sanitizedItems.length <= 1) return sanitizedItems;
  return [
    sanitizedItems[sanitizedItems.length - 1],
    ...sanitizedItems.slice(0, -1)
  ];
};

const buildPublicAnswer = (vraag = {}) => {
  const type = getQuestionType(vraag);
  const antwoord = vraag.antwoord || vraag.answer || {};

  if (type === 'meerkeuze' || type === 'waar-niet-waar') {
    return {
      type: 'meerkeuze',
      options: sanitizeOptions(antwoord.options)
    };
  }

  if (type === 'numeriek') {
    return {
      type: 'numeriek',
      unit: cleanText(antwoord.unit)
    };
  }

  if (type === 'invullen') {
    const segments = sanitizeSegments(antwoord.segments || []);
    return {
      type: 'invullen',
      text: cleanText(antwoord.text),
      segments,
      gaps: sanitizeGaps(antwoord.gaps, segments)
    };
  }

  if (type === 'volgorde') {
    return {
      type: 'volgorde',
      items: buildPublicOrderItems(antwoord.items)
    };
  }

  return { type };
};

export const buildPublicQuestionSnapshot = (vraag = {}) => {
  const type = getQuestionType(vraag);
  return {
    id: vraag.id || '',
    vakId: vraag.vakId || '',
    leerjaarId: vraag.leerjaarId || '',
    niveauId: vraag.niveauId || '',
    hoofdstukId: vraag.hoofdstukId || '',
    paragraafId: vraag.paragraafId || '',
    number: vraag.number || '',
    title: vraag.title || '',
    vraagtype: type,
    status: vraag.status || 'draft',
    order: vraag.order || 0,
    content: {
      text: vraag.content?.text || '',
      images: Array.isArray(vraag.content?.images) ? vraag.content.images : []
    },
    vraagMetadata: {
      difficulty: vraag.vraagMetadata?.difficulty || 3
    },
    antwoord: buildPublicAnswer(vraag),
    isArchived: vraag.isArchived === true,
    publicSnapshotVersion: 1
  };
};

export const hasQuestionAnswerKey = (vraag = {}) => {
  const type = getQuestionType(vraag);
  const antwoord = vraag.antwoord || vraag.answer || {};

  if (type === 'meerkeuze' || type === 'waar-niet-waar') {
    return Array.isArray(antwoord.options) && antwoord.options.some((option) => option.correct === true);
  }

  if (type === 'numeriek') {
    return antwoord.expected !== undefined || antwoord.correctValue !== undefined || antwoord.correctAnswer !== undefined;
  }

  if (type === 'invullen') {
    return Array.isArray(antwoord.gaps) && antwoord.gaps.some((gap) => cleanText(gap.answer || gap.correctAnswer));
  }

  if (type === 'volgorde') {
    return Array.isArray(antwoord.items) && antwoord.items.length > 0 && vraag.publicSnapshotVersion !== 1;
  }

  return Boolean(cleanText(antwoord.modelAnswer || antwoord.answer || antwoord.expected || antwoord.correctValue));
};
