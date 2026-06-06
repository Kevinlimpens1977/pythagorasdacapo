const cleanText = (value) => String(value || '').trim();

const getItemType = (item = {}) =>
  item.type || item.vraagtype || item.answer?.type || item.antwoord?.type || 'open';

const sanitizeOptions = (options = []) =>
  (Array.isArray(options) ? options : []).map((option, index) => ({
    id: option.id || `option-${index + 1}`,
    text: cleanText(option.text || option.label || `Optie ${index + 1}`)
  })).filter((option) => option.text);

const rotateItems = (items = []) => {
  if (items.length <= 1) return items;
  return [items[items.length - 1], ...items.slice(0, -1)];
};

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

const sanitizeMatchingPairs = (pairs = []) =>
  (Array.isArray(pairs) ? pairs : []).map((pair, index) => ({
    id: pair.id || `pair-${index + 1}`,
    left: cleanText(pair.left || pair.term || `Begrip ${index + 1}`)
  })).filter((pair) => pair.left);

const sanitizeMatchingOptions = (pairs = []) =>
  rotateItems((Array.isArray(pairs) ? pairs : []).map((pair, index) => ({
    id: `${pair.id || `pair-${index + 1}`}-option`,
    text: cleanText(pair.right || pair.match || `Optie ${index + 1}`)
  })).filter((option) => option.text));

const sanitizeOrderItems = (items = []) =>
  rotateItems((Array.isArray(items) ? items : []).map((item, index) => ({
    id: item.id || `item-${index + 1}`,
    text: cleanText(item.text || item.label || `Stap ${index + 1}`)
  })).filter((item) => item.text));

const buildPublicAssessmentAnswer = (item = {}) => {
  const type = getItemType(item);
  const answer = item.answer || item.antwoord || {};

  if (type === 'meerkeuze' || type === 'waar-niet-waar') {
    return {
      type: 'meerkeuze',
      options: sanitizeOptions(answer.options || item.options)
    };
  }

  if (type === 'numeriek') {
    return {
      type: 'numeriek',
      unit: cleanText(answer.unit)
    };
  }

  if (type === 'koppelen') {
    const pairs = Array.isArray(answer.pairs) ? answer.pairs : [];
    return {
      type: 'koppelen',
      pairs: sanitizeMatchingPairs(pairs),
      options: sanitizeMatchingOptions(pairs)
    };
  }

  if (type === 'invullen') {
    const segments = sanitizeSegments(answer.segments || []);
    return {
      type: 'invullen',
      text: cleanText(answer.text),
      segments,
      gaps: sanitizeGaps(answer.gaps, segments)
    };
  }

  if (type === 'volgorde') {
    return {
      type: 'volgorde',
      items: sanitizeOrderItems(answer.items)
    };
  }

  return { type: 'open' };
};

const sanitizeAssessmentItems = (items = []) =>
  (Array.isArray(items) ? items : []).map((item, index) => {
    const type = getItemType(item);
    return {
      id: item.id || `assessment-${index + 1}`,
      type,
      vraagtype: type,
      prompt: String(item.prompt || item.question || item.title || ''),
      answer: buildPublicAssessmentAnswer(item),
      options: type === 'meerkeuze' || type === 'waar-niet-waar'
        ? sanitizeOptions(item.answer?.options || item.antwoord?.options || item.options)
        : [],
      feedback: '',
      tokens: Math.max(0, Math.round(Number(item.tokens) || 0)),
      answerKeyAvailable: false,
      publicSnapshotVersion: 1
    };
  });

const sanitizeContent = (block = {}) => {
  const content = block.content || {};
  const base = {
    html: content.html || '',
    text: content.text || '',
    imageUrl: content.imageUrl || '',
    mediaUrl: content.mediaUrl || '',
    mediaKind: content.mediaKind || '',
    storagePath: content.storagePath || '',
    thumbnailUrl: content.thumbnailUrl || '',
    caption: content.caption || '',
    altText: content.altText || '',
    crops: Array.isArray(content.crops) ? content.crops : []
  };

  if (block.type === 'quiz' || block.type === 'toets') {
    return {
      html: content.html || '',
      assessmentType: content.assessmentType || block.type,
      items: sanitizeAssessmentItems(content.items),
      attemptPolicy: {
        maxAttempts: content.attemptPolicy?.maxAttempts ?? (block.type === 'toets' ? 2 : null),
        scoring: content.attemptPolicy?.scoring || 'best',
        allowTeacherReset: content.attemptPolicy?.allowTeacherReset !== false
      },
      tokenConfig: {
        enabled: content.tokenConfig?.enabled !== false,
        totalTokens: Math.max(0, Math.round(Number(content.tokenConfig?.totalTokens || block.tokenTotal || 0)))
      }
    };
  }

  if (block.type === 'slidedeck') {
    return {
      html: content.html || '',
      slidedeckPackageId: content.slidedeckPackageId || '',
      deckTitle: content.deckTitle || '',
      generatedDeckUrl: content.generatedDeckUrl || '',
      generatedDeckStoragePath: content.generatedDeckStoragePath || '',
      sourcePdfUrl: content.sourcePdfUrl || '',
      sourcePdfStoragePath: content.sourcePdfStoragePath || ''
    };
  }

  if (block.type === 'game') {
    return {
      html: content.html || '',
      gameId: content.gameId || '',
      gameTitle: content.gameTitle || '',
      settings: content.settings || {},
      crops: Array.isArray(content.crops) ? content.crops : []
    };
  }

  return base;
};

export const buildPublicContentBlockSnapshot = (block = {}) => ({
  id: block.id || '',
  vakId: block.vakId || '',
  leerjaarId: block.leerjaarId || '',
  niveauId: block.niveauId || '',
  hoofdstukId: block.hoofdstukId || '',
  paragraafId: block.paragraafId || '',
  type: block.type || 'theory',
  order: block.order || 0,
  title: block.title || '',
  status: block.status || 'draft',
  content: sanitizeContent(block),
  settings: block.settings || {},
  linkedVraagId: block.linkedVraagId || null,
  linkedVraagTitle: block.linkedVraagTitle || '',
  isArchived: block.isArchived === true,
  publicSnapshotVersion: 1
});

export const hasAssessmentItemAnswerKey = (item = {}) => {
  if (item.answerKeyAvailable === false || item.publicSnapshotVersion === 1) return false;

  const type = getItemType(item);
  const answer = item.answer || item.antwoord || {};

  if (type === 'meerkeuze' || type === 'waar-niet-waar') {
    return Array.isArray(answer.options) && answer.options.some((option) => option.correct === true);
  }

  if (type === 'numeriek') {
    return answer.expected !== undefined || answer.correctValue !== undefined || answer.correctAnswer !== undefined;
  }

  if (type === 'koppelen') {
    return Array.isArray(answer.pairs) && answer.pairs.some((pair) => cleanText(pair.right || pair.match));
  }

  if (type === 'invullen') {
    return Array.isArray(answer.gaps) && answer.gaps.some((gap) => cleanText(gap.answer || gap.correctAnswer));
  }

  if (type === 'volgorde') {
    return Array.isArray(answer.items) && answer.items.length > 0;
  }

  return Boolean(cleanText(answer.modelAnswer || answer.correctAnswer || answer.answer || answer.rubric));
};
