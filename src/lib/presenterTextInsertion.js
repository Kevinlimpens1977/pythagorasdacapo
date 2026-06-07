const toSafeString = (value = '') =>
  typeof value === 'string' ? value : String(value ?? '');

const toFiniteOffset = (value, fallback) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : fallback;
};

const clampOffset = (value, length) =>
  Math.max(0, Math.min(toFiniteOffset(value, length), length));

export const insertTextAtSelection = (text = '', insertion = '', selection = null) => {
  const source = toSafeString(text);
  const insert = toSafeString(insertion);
  const length = source.length;
  const rawStart = selection && typeof selection === 'object' ? selection.start : length;
  const rawEnd = selection && typeof selection === 'object' ? selection.end : rawStart;
  const start = clampOffset(rawStart, length);
  const end = clampOffset(rawEnd, length);
  const rangeStart = Math.min(start, end);
  const rangeEnd = Math.max(start, end);
  const nextText = `${source.slice(0, rangeStart)}${insert}${source.slice(rangeEnd)}`;

  return {
    text: nextText,
    caretOffset: rangeStart + insert.length
  };
};
