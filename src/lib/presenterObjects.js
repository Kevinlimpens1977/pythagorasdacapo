import { createMathToolWork, MATH_TOOL_TYPES, normalizeMathTool } from './mathToolboxUtils.js';
import {
  AXES_DEFAULT_GRID_SIZE,
  AXES_DEFAULT_LABELS,
  AXES_DEFAULT_RANGE,
  getAxesFrame,
  getAxesModel
} from './presenterAxes.js';

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

const MATH_WORKSHEET_TYPES = new Set([
  'ratioTableTool',
  'pythagorasTool'
]);

const DUPLICATABLE_TYPES = new Set([
  ...V1A_SHAPE_TYPES,
  'text',
  ...MATH_WORKSHEET_TYPES
]);

// Een gedraaid assenstelsel ligt per definitie niet meer op de ruitjes, en de
// getallen zouden scheef of op hun kop komen te staan. Draaien kan dus niet;
// het rotatiehandvat verdwijnt daarmee vanzelf uit de selectiebox.
const NON_ROTATABLE_SHAPE_TYPES = new Set(['axes']);

const AXES_DEFAULT_FRAME = getAxesFrame({
  range: AXES_DEFAULT_RANGE,
  gridSize: AXES_DEFAULT_GRID_SIZE
});

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
  // Het assenstelsel is precies een heel aantal ruitjes groot, want één eenheid
  // is één ruitje. Het standaardbereik is dat van het wiskundeboek: -5 tot 6 op
  // beide assen, dus vier kwadranten. Maat en bereik horen bij elkaar; zie
  // presenterAxes.js voor de enige plek waar dat verband uitgerekend wordt.
  axes: {
    width: AXES_DEFAULT_FRAME.width,
    height: AXES_DEFAULT_FRAME.height,
    range: { ...AXES_DEFAULT_RANGE },
    labels: { ...AXES_DEFAULT_LABELS }
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
  },
  ratioTableTool: {
    width: 920,
    height: 360,
    content: {
      mathTool: createMathToolWork(MATH_TOOL_TYPES.ratioTable, 'presenter-ratio')
    }
  },
  pythagorasTool: {
    width: 1040,
    height: 620,
    content: {
      mathTool: createMathToolWork(MATH_TOOL_TYPES.pythagoras, 'presenter-pythagoras')
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
  ratioTableTool: 'Verhoudingstabel',
  pythagorasTool: 'Pythagoras schema',
  lessonBlock: 'Lesblok',
  questionWindow: 'Vraag'
};

const cloneValue = (value) => structuredClone(value);

export const createPresenterObject = (type, overrides = {}) => {
  const defaults = cloneValue(SHAPE_DEFAULTS[type] ?? {});
  const clonedOverrides = cloneValue(overrides);
  const objectId = clonedOverrides.id;
  const objectType = clonedOverrides.type ?? type;
  const defaultMathTool = defaults.content?.mathTool;
  const overrideMathTool = clonedOverrides.content?.mathTool;
  const mathTool = MATH_WORKSHEET_TYPES.has(objectType)
    ? normalizeMathTool({
        ...(defaultMathTool || {}),
        ...(overrideMathTool || {}),
        id: overrideMathTool?.id || (objectId ? `${objectId}-tool` : defaultMathTool?.id)
      })
    : null;

  const object = {
    ...defaults,
    ...clonedOverrides,
    type: objectType,
    x: clonedOverrides.x ?? 0,
    y: clonedOverrides.y ?? 0,
    width: clonedOverrides.width ?? defaults.width ?? 0,
    height: clonedOverrides.height ?? defaults.height ?? 0,
    rotation: clonedOverrides.rotation ?? 0
  };

  // Bereik en asnamen zijn geneste objecten: ze gaan door getAxesModel zodat
  // twee assenstelsels nooit hetzelfde bereik delen en een half ingevuld
  // overschrijf-object toch een tekenbare figuur oplevert.
  if (objectType === 'axes') {
    const { range, labels } = getAxesModel(object, AXES_DEFAULT_GRID_SIZE);

    return {
      ...object,
      range: { ...range },
      labels: { ...labels }
    };
  }

  if (!mathTool) return object;

  return {
    ...object,
    content: {
      ...(defaults.content || {}),
      ...(clonedOverrides.content || {}),
      mathTool
    }
  };
};

export const canRotatePresenterObject = (object) =>
  V1A_SHAPE_TYPES.has(object?.type) && !NON_ROTATABLE_SHAPE_TYPES.has(object?.type);

export const canDuplicatePresenterObject = (object) =>
  DUPLICATABLE_TYPES.has(object?.type);

export const getPresenterObjectLabel = (object) =>
  OBJECT_LABELS[object?.type] ?? 'Object';

export const isPresenterMathToolObject = (object) =>
  MATH_WORKSHEET_TYPES.has(object?.type);

export const updatePresenterMathToolObject = (object, mathTool) => {
  if (!isPresenterMathToolObject(object)) return object;

  const normalized = normalizeMathTool(mathTool);
  if (!normalized) return object;

  return {
    ...object,
    content: {
      ...(object.content || {}),
      mathTool: normalized
    }
  };
};
