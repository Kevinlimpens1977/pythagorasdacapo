import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPresenterObject,
  canRotatePresenterObject,
  canDuplicatePresenterObject,
  getPresenterObjectLabel,
  updatePresenterMathToolObject
} from './presenterObjects.js';

const v1aShapeTypes = [
  'rectangle',
  'ellipse',
  'line',
  'arrow',
  'triangle',
  'polygon',
  'axes',
  'table',
  'angle'
];

const v1aShapeDefaults = {
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
  // Elf ruitjes van 96 in beide richtingen: het assenstelsel van -5 tot 6 uit
  // het wiskundeboek, waarbij één eenheid precies één ruitje is.
  axes: {
    width: 1056,
    height: 1056,
    range: { xMin: -5, xMax: 6, yMin: -5, yMax: 6 },
    labels: { x: 'x', y: 'y' }
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
  }
};

test('createPresenterObject creates rectangle defaults', () => {
  const object = createPresenterObject('rectangle', { x: 10, y: 20 });

  assert.equal(object.type, 'rectangle');
  assert.equal(object.x, 10);
  assert.equal(object.y, 20);
  assert.equal(object.width, 240);
  assert.equal(object.height, 160);
  assert.equal(object.rotation, 0);
});

test('createPresenterObject creates all V1A shape types', () => {
  const objects = v1aShapeTypes.map((type) => createPresenterObject(type));

  assert.deepEqual(objects.map((object) => object.type), v1aShapeTypes);
});

test('createPresenterObject applies exact V1A shape defaults', () => {
  for (const type of v1aShapeTypes) {
    const object = createPresenterObject(type);

    assert.deepEqual(
      Object.fromEntries(Object.keys(v1aShapeDefaults[type]).map((key) => [key, object[key]])),
      v1aShapeDefaults[type],
      `${type} defaults should match metadata`
    );
  }
});

test('createPresenterObject creates V1B text object defaults', () => {
  const object = createPresenterObject('text');

  assert.equal(object.type, 'text');
  assert.equal(object.width, 520);
  assert.equal(object.height, 180);
  assert.equal(object.content.text, '');
  assert.deepEqual(object.textStyle, {
    bold: false,
    italic: false,
    color: '#111827',
    fontSize: 48,
    fontFamily: 'helix',
    align: 'left'
  });
});

test('createPresenterObject creates Presenter math worksheet defaults', () => {
  const ratio = createPresenterObject('ratioTableTool', { id: 'ratio-object' });
  const pythagoras = createPresenterObject('pythagorasTool', { id: 'pythagoras-object' });

  assert.equal(ratio.type, 'ratioTableTool');
  assert.equal(ratio.width, 920);
  assert.equal(ratio.height, 360);
  assert.equal(ratio.content.mathTool.type, 'ratioTable');
  assert.deepEqual(ratio.content.mathTool.topValues, ['', '']);
  assert.deepEqual(ratio.content.mathTool.bottomValues, ['', '']);
  assert.deepEqual(ratio.content.mathTool.topOperations, ['']);
  assert.deepEqual(ratio.content.mathTool.bottomOperations, ['']);

  assert.equal(pythagoras.type, 'pythagorasTool');
  assert.equal(pythagoras.width, 1040);
  assert.equal(pythagoras.height, 620);
  assert.equal(pythagoras.content.mathTool.type, 'pythagoras');
  assert.deepEqual(pythagoras.content.mathTool.rows.map((row) => row.side), ['', '', '']);
  assert.equal(pythagoras.content.mathTool.workingText, '');
});

test('updatePresenterMathToolObject updates only Presenter math worksheet content', () => {
  const ratio = createPresenterObject('ratioTableTool', { id: 'ratio-object' });
  const updated = updatePresenterMathToolObject(ratio, {
    ...ratio.content.mathTool,
    topValues: ['12', '24']
  });

  assert.notEqual(updated, ratio);
  assert.deepEqual(updated.content.mathTool.topValues, ['12', '24']);
  assert.deepEqual(ratio.content.mathTool.topValues, ['', '']);
  assert.equal(updatePresenterMathToolObject({ type: 'rectangle' }, ratio.content.mathTool).type, 'rectangle');
});

test('createPresenterObject preserves nullish-safe overrides', () => {
  const object = createPresenterObject('rectangle', {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
    strokeWidth: 0,
    showLabel: false
  });

  assert.equal(object.x, 0);
  assert.equal(object.y, 0);
  assert.equal(object.width, 0);
  assert.equal(object.height, 0);
  assert.equal(object.rotation, 0);
  assert.equal(object.strokeWidth, 0);
  assert.equal(object.showLabel, false);
});

test('createPresenterObject clones nested polygon defaults', () => {
  const first = createPresenterObject('polygon');
  const second = createPresenterObject('polygon');

  assert.notEqual(first.points, second.points);
  assert.notEqual(first.points[0], second.points[0]);

  first.points[0].x = 99;

  assert.deepEqual(second.points, v1aShapeDefaults.polygon.points);
});

test('createPresenterObject clones nested override values', () => {
  const points = [
    { x: 10, y: 20 },
    { x: 30, y: 40 }
  ];
  const style = {
    stroke: '#111827',
    shadow: { enabled: true }
  };
  const object = createPresenterObject('polygon', { points, style });

  points[0].x = 99;
  points.push({ x: 50, y: 60 });
  style.stroke = '#ffffff';
  style.shadow.enabled = false;

  assert.deepEqual(object.points, [
    { x: 10, y: 20 },
    { x: 30, y: 40 }
  ]);
  assert.deepEqual(object.style, {
    stroke: '#111827',
    shadow: { enabled: true }
  });
});

test('canRotatePresenterObject returns true for V1A shapes and false for content/question objects', () => {
  for (const type of v1aShapeTypes) {
    if (type === 'axes') continue;
    assert.equal(canRotatePresenterObject({ type }), true, `${type} should rotate`);
  }

  assert.equal(canRotatePresenterObject({ type: 'lessonBlock' }), false);
  assert.equal(canRotatePresenterObject({ type: 'questionWindow' }), false);
  assert.equal(canRotatePresenterObject({ type: 'ratioTableTool' }), false);
  assert.equal(canRotatePresenterObject({ type: 'pythagorasTool' }), false);
});

// Bewuste gedragswijziging: een gedraaid assenstelsel valt niet meer op de
// ruitjes en zet de getallen scheef. Het rotatiehandvat hoort er dus niet te
// zijn, terwijl dupliceren gewoon blijft werken.
test('canRotatePresenterObject refuses to rotate the axes figure off the grid', () => {
  assert.equal(canRotatePresenterObject({ type: 'axes' }), false);
  assert.equal(canDuplicatePresenterObject({ type: 'axes' }), true);
});

test('createPresenterObject clones the axes range so two figures never share one', () => {
  const first = createPresenterObject('axes');
  const second = createPresenterObject('axes');

  assert.notEqual(first.range, second.range);
  assert.notEqual(first.labels, second.labels);

  first.range.xMax = 99;
  first.labels.x = 't (s)';

  assert.deepEqual(second.range, { xMin: -5, xMax: 6, yMin: -5, yMax: 6 });
  assert.deepEqual(second.labels, { x: 'x', y: 'y' });
});

test('createPresenterObject repairs an axes object with a broken range', () => {
  const object = createPresenterObject('axes', {
    width: 384,
    height: 288,
    range: { xMin: 6, xMax: 6, yMin: -5, yMax: 6 },
    labels: { x: '  t (s) ' }
  });

  assert.deepEqual(object.range, { xMin: -1, xMax: 3, yMin: -1, yMax: 2 });
  assert.deepEqual(object.labels, { x: 't (s)', y: 'y' });
});

test('canDuplicatePresenterObject returns true for V1A shapes, text and math tools, false for lesson blocks', () => {
  for (const type of v1aShapeTypes) {
    assert.equal(canDuplicatePresenterObject({ type }), true, `${type} should duplicate`);
  }

  assert.equal(canDuplicatePresenterObject({ type: 'text' }), true);
  assert.equal(canDuplicatePresenterObject({ type: 'ratioTableTool' }), true);
  assert.equal(canDuplicatePresenterObject({ type: 'pythagorasTool' }), true);
  assert.equal(canDuplicatePresenterObject({ type: 'lessonBlock' }), false);
});

test('getPresenterObjectLabel returns readable Dutch labels', () => {
  assert.equal(getPresenterObjectLabel({ type: 'rectangle' }), 'Rechthoek');
  assert.equal(getPresenterObjectLabel({ type: 'ellipse' }), 'Cirkel/ovaal');
  assert.equal(getPresenterObjectLabel({ type: 'line' }), 'Lijn');
  assert.equal(getPresenterObjectLabel({ type: 'arrow' }), 'Pijl');
  assert.equal(getPresenterObjectLabel({ type: 'triangle' }), 'Driehoek');
  assert.equal(getPresenterObjectLabel({ type: 'polygon' }), 'Veelhoek');
  assert.equal(getPresenterObjectLabel({ type: 'axes' }), 'Assenstelsel');
  assert.equal(getPresenterObjectLabel({ type: 'table' }), 'Tabel/raster');
  assert.equal(getPresenterObjectLabel({ type: 'angle' }), 'Hoekmarkering');
  assert.equal(getPresenterObjectLabel({ type: 'text' }), 'Tekst');
  assert.equal(getPresenterObjectLabel({ type: 'ratioTableTool' }), 'Verhoudingstabel');
  assert.equal(getPresenterObjectLabel({ type: 'pythagorasTool' }), 'Pythagoras schema');
  assert.equal(getPresenterObjectLabel({ type: 'lessonBlock' }), 'Lesblok');
  assert.equal(getPresenterObjectLabel({ type: 'questionWindow' }), 'Vraag');
  assert.equal(getPresenterObjectLabel({ type: 'unknown' }), 'Object');
});
