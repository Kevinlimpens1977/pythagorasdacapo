const toSafeString = (value = '') =>
  typeof value === 'string' ? value : String(value ?? '');

const toFiniteOffset = (value) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? Math.round(value) : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const number = Number(value);
    return Number.isFinite(number) ? Math.round(number) : null;
  }

  return null;
};

const clampOffset = (value, length) =>
  Math.max(0, Math.min(value, length));

export const insertTextAtSelection = (text = '', insertion = '', selection = null) => {
  const source = toSafeString(text);
  const insert = toSafeString(insertion);
  const length = source.length;
  const hasSelection = selection && typeof selection === 'object';
  const startOffset = hasSelection ? toFiniteOffset(selection.start) : null;
  const endOffset = hasSelection ? toFiniteOffset(selection.end) : null;
  const hasValidSelection = startOffset !== null && endOffset !== null;
  const start = hasValidSelection ? clampOffset(startOffset, length) : length;
  const end = hasValidSelection ? clampOffset(endOffset, length) : length;
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);
  const nextText = `${source.slice(0, rangeStart)}${insert}${source.slice(rangeEnd)}`;

  return {
    text: nextText,
    caretOffset: rangeStart + insert.length
  };
};
