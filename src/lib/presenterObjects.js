const V1A_SHAPE_TYPES = new Set([
  'rectangle',
  'ellipse',
  'line',
  'arrow',
  'triangle',
  'polygon',
  'axes',
  'table',
  'angle'
]);

const DUPLICATABLE_TYPES = new Set([
  ...V1A_SHAPE_TYPES,
  'text'
]);

const SHAPE_DEFAULTS = {
  rectangle: {
    width: 240,
    height: 160
  },
  ellipse: {
    width: 220,
    height: 160
  },
  line: {
    width: 260,
    height: 0
  },
  arrow: {
    width: 260,
    height: 0
  },
  triangle: {
    width: 240,
    height: 180
  },
  polygon: {
    width: 240,
    height: 180,
    points: [
      { x: 0, y: 180 },
      { x: 120, y: 0 },
      { x: 240, y: 180 }
    ]
  },
  axes: {
    width: 360,
    height: 260
  },
  table: {
    width: 360,
    height: 240,
    rows: 4,
    columns: 5
  },
  angle: {
    width: 180,
    height: 120,
    angleDegrees: 90
  },
  text: {
    width: 520,
    height: 180,
    content: {
      text: ''
    },
    textStyle: {
      bold: false,
      italic: false,
      color: '#111827',
      fontSize: 48,
      fontFamily: 'helix',
      align: 'left'
    }
  }
};

const OBJECT_LABELS = {
  rectangle: 'Rechthoek',
  ellipse: 'Cirkel/ovaal',
  line: 'Lijn',
  arrow: 'Pijl',
  triangle: 'Driehoek',
  polygon: 'Veelhoek',
  axes: 'Assenstelsel',
  table: 'Tabel/raster',
  angle: 'Hoekmarkering',
  text: 'Tekst',
  lessonBlock: 'Lesblok',
  questionWindow: 'Vraag'
};

const cloneValue = (value) => structuredClone(value);

export const createPresenterObject = (type, overrides = {}) => {
  const defaults = cloneValue(SHAPE_DEFAULTS[type] ?? {});
  const clonedOverrides = cloneValue(overrides);

  return {
    ...defaults,
    ...clonedOverrides,
    type: clonedOverrides.type ?? type,
    x: clonedOverrides.x ?? 0,
    y: clonedOverrides.y ?? 0,
    width: clonedOverrides.width ?? defaults.width ?? 0,
    height: clonedOverrides.height ?? defaults.height ?? 0,
    rotation: clonedOverrides.rotation ?? 0
  };
};

export const canRotatePresenterObject = (object) =>
  V1A_SHAPE_TYPES.has(object?.type);

export const canDuplicatePresenterObject = (object) =>
  DUPLICATABLE_TYPES.has(object?.type);

export const getPresenterObjectLabel = (object) =>
  OBJECT_LABELS[object?.type] ?? 'Object';
