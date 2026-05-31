export const MATH_TOOL_TYPES = {
  ratioTable: 'ratioTable',
  pythagoras: 'pythagoras'
};

export const MATH_TOOL_LABELS = {
  ratioTable: 'Verhoudingstabel',
  pythagoras: 'Pythagoras schema'
};

const createId = (prefix = 'tool') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const asText = (value) => String(value ?? '');

const normalizeArrayLength = (values = [], length = 2) => {
  const nextValues = Array.isArray(values) ? values.map(asText) : [];
  while (nextValues.length < length) nextValues.push('');
  return nextValues.slice(0, length);
};

const normalizeRatioTable = (tool = {}) => {
  const columnCount = Math.max(
    2,
    Array.isArray(tool.topValues) ? tool.topValues.length : 0,
    Array.isArray(tool.bottomValues) ? tool.bottomValues.length : 0
  );

  return {
    id: tool.id || createId('ratio'),
    type: MATH_TOOL_TYPES.ratioTable,
    title: tool.title || MATH_TOOL_LABELS.ratioTable,
    topLabel: asText(tool.topLabel),
    bottomLabel: asText(tool.bottomLabel),
    topValues: normalizeArrayLength(tool.topValues, columnCount),
    bottomValues: normalizeArrayLength(tool.bottomValues, columnCount),
    operations: normalizeArrayLength(tool.operations, columnCount - 1)
  };
};

const normalizePythagoras = (tool = {}) => {
  const rows = Array.isArray(tool.rows) ? tool.rows : [];
  const normalizedRows = [0, 1, 2].map((index) => {
    const row = rows[index] || {};
    return {
      id: row.id || `pythagoras-row-${index + 1}`,
      side: asText(row.side),
      length: asText(row.length),
      square: asText(row.square)
    };
  });

  return {
    id: tool.id || createId('pythagoras'),
    type: MATH_TOOL_TYPES.pythagoras,
    title: tool.title || MATH_TOOL_LABELS.pythagoras,
    rows: normalizedRows,
    squareAddition: {
      top: asText(tool.squareAddition?.top),
      bottom: asText(tool.squareAddition?.bottom),
      sum: asText(tool.squareAddition?.sum)
    },
    conclusion: {
      lzSquared: asText(tool.conclusion?.lzSquared),
      root: asText(tool.conclusion?.root),
      length: asText(tool.conclusion?.length)
    }
  };
};

export const createMathToolWork = (type, id) => {
  if (type === MATH_TOOL_TYPES.ratioTable) {
    return normalizeRatioTable({ id });
  }

  if (type === MATH_TOOL_TYPES.pythagoras) {
    return normalizePythagoras({ id });
  }

  throw new Error(`Onbekend wiskunde-tooltype: ${type}`);
};

export const normalizeMathTool = (tool = {}) => {
  if (tool.type === MATH_TOOL_TYPES.ratioTable) return normalizeRatioTable(tool);
  if (tool.type === MATH_TOOL_TYPES.pythagoras) return normalizePythagoras(tool);
  return null;
};

export const normalizeMathToolWork = (tools = []) =>
  (Array.isArray(tools) ? tools : [])
    .map(normalizeMathTool)
    .filter(Boolean);

export const addRatioColumn = (tool = {}) => {
  const ratio = normalizeRatioTable(tool);
  return {
    ...ratio,
    topValues: [...ratio.topValues, ''],
    bottomValues: [...ratio.bottomValues, ''],
    operations: [...ratio.operations, '']
  };
};

export const removeRatioColumn = (tool = {}, columnIndex) => {
  const ratio = normalizeRatioTable(tool);
  if (ratio.topValues.length <= 2) return ratio;
  const safeIndex = Math.min(Math.max(Number(columnIndex) || 0, 0), ratio.topValues.length - 1);
  const operationIndex = Math.min(Math.max(safeIndex - 1, 0), ratio.operations.length - 1);

  return normalizeRatioTable({
    ...ratio,
    topValues: ratio.topValues.filter((_, index) => index !== safeIndex),
    bottomValues: ratio.bottomValues.filter((_, index) => index !== safeIndex),
    operations: ratio.operations.filter((_, index) => index !== operationIndex)
  });
};

export const updateMathToolValue = (tool = {}, path = [], value = '') => {
  const normalized = normalizeMathTool(tool);
  if (!normalized || !Array.isArray(path) || path.length === 0) return normalized;

  const clone = structuredClone(normalized);
  let cursor = clone;
  for (let index = 0; index < path.length - 1; index += 1) {
    cursor = cursor?.[path[index]];
    if (cursor === undefined || cursor === null) return normalized;
  }
  cursor[path[path.length - 1]] = asText(value);
  return normalizeMathTool(clone);
};

export const resetMathTool = (tool = {}) => {
  const normalized = normalizeMathTool(tool);
  if (!normalized) return null;
  return createMathToolWork(normalized.type, normalized.id);
};

const summarizeRatio = (tool) => {
  const filledCells = [...tool.topValues, ...tool.bottomValues, tool.topLabel, tool.bottomLabel, ...tool.operations]
    .filter((value) => String(value).trim()).length;
  return `${MATH_TOOL_LABELS.ratioTable}: ${tool.topValues.length} kolommen, ${filledCells} ingevulde velden`;
};

const summarizePythagoras = (tool) => {
  const filledCells = [
    ...tool.rows.flatMap((row) => [row.side, row.length, row.square]),
    tool.squareAddition.top,
    tool.squareAddition.bottom,
    tool.squareAddition.sum,
    tool.conclusion.lzSquared,
    tool.conclusion.root,
    tool.conclusion.length
  ].filter((value) => String(value).trim()).length;
  return `${MATH_TOOL_LABELS.pythagoras}: ${filledCells} ingevulde velden`;
};

export const getMathToolSummary = (tools = []) => {
  const normalized = normalizeMathToolWork(tools);
  if (!normalized.length) return 'Geen wiskunde-uitwerkingen toegevoegd.';
  return normalized.map((tool) => {
    if (tool.type === MATH_TOOL_TYPES.ratioTable) return summarizeRatio(tool);
    if (tool.type === MATH_TOOL_TYPES.pythagoras) return summarizePythagoras(tool);
    return tool.title || 'Wiskunde-uitwerking';
  }).join('\n');
};

export const hasFilledMathToolWork = (tools = []) =>
  normalizeMathToolWork(tools).some((tool) => {
    if (tool.type === MATH_TOOL_TYPES.ratioTable) {
      return [
        tool.topLabel,
        tool.bottomLabel,
        ...tool.topValues,
        ...tool.bottomValues,
        ...tool.operations
      ].some((value) => String(value).trim());
    }

    if (tool.type === MATH_TOOL_TYPES.pythagoras) {
      return [
        ...tool.rows.flatMap((row) => [row.side, row.length, row.square]),
        tool.squareAddition.top,
        tool.squareAddition.bottom,
        tool.squareAddition.sum,
        tool.conclusion.lzSquared,
        tool.conclusion.root,
        tool.conclusion.length
      ].some((value) => String(value).trim());
    }

    return false;
  });
