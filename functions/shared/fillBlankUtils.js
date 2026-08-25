const GAP_MARKER = '[GAP]';

const createGapId = (index) => `gap-${index + 1}`;

const normalizeText = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/²/g, '2')
    .replace(/\^2/g, '2')
    .replace(/kwadraat/g, '2')
    .replace(/vierkante\s*/g, 'square ')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

const canonicalUnit = (value) => {
  const normalized = normalizeText(value)
    .replace(/squarecentimeter/g, 'cm2')
    .replace(/squarecentimetre/g, 'cm2')
    .replace(/squarecentimeters/g, 'cm2')
    .replace(/squarecentimetres/g, 'cm2')
    .replace(/vierkantecentimeter/g, 'cm2')
    .replace(/vierkantecentimeters/g, 'cm2')
    .replace(/centimeter2/g, 'cm2')
    .replace(/centimeters2/g, 'cm2')
    .replace(/centimetre2/g, 'cm2')
    .replace(/centimetres2/g, 'cm2');

  return normalized;
};

const levenshteinDistance = (left, right) => {
  if (left === right) return 0;
  if (!left) return right.length;
  if (!right) return left.length;

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = Array(right.length + 1).fill(0);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    current[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const cost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

const isCloseEnough = (student, correct) => {
  if (!student || !correct) return false;
  if (student === correct) return true;

  const maxDistance = correct.length >= 8 ? 1 : 0;
  return levenshteinDistance(student, correct) <= maxDistance;
};

export const buildSegmentsFromLegacyFillBlank = (text = '', gaps = []) => {
  const parts = String(text || '').split(GAP_MARKER);
  const segments = [];

  parts.forEach((part, index) => {
    segments.push({ type: 'text', text: part });
    if (index < parts.length - 1) {
      const gap = gaps[index] || {};
      segments.push({
        type: 'gap',
        id: gap.id || createGapId(index),
        answer: gap.answer || ''
      });
    }
  });

  return segments.length > 0 ? segments : [{ type: 'text', text: '' }];
};

export const buildFillBlankTextFromSegments = (segments = []) =>
  segments.map((segment) => segment.type === 'gap' ? GAP_MARKER : segment.text || '').join('');

export const getFillBlankGapsFromSegments = (segments = []) =>
  segments
    .filter((segment) => segment.type === 'gap')
    .map((segment, index) => ({
      id: segment.id || createGapId(index),
      answer: segment.answer || '',
      smartCheck: segment.smartCheck !== false
    }));

export const isSmartFillBlankAnswerCorrect = (studentAnswer, correctAnswer) => {
  const student = canonicalUnit(studentAnswer);
  const correct = canonicalUnit(correctAnswer);
  return isCloseEnough(student, correct);
};
