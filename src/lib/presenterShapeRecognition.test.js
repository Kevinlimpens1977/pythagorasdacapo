import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canRecognizePresenterStroke,
  getClosedShapeCorners,
  PRESENTER_SHAPE_MIN_POINTS,
  recognizePresenterShape,
  resampleStrokePoints,
  simplifyPath
} from './presenterShapeRecognition.js';

// Een handmatige haal is nooit exact: elke reeks hieronder krijgt reproduceerbare
// ruis mee, zodat de tests meten wat een docent op een bord doet en niet wat een
// generator uitrekent.
const createJitter = (seed = 1) => {
  let state = seed;
  return (amplitude) => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return ((state / 4294967296) * 2 - 1) * amplitude;
  };
};

const penStroke = (points) => ({ id: 'stroke-1', variant: 'pen', color: '#111827', width: 6, points });

const buildCircle = ({ cx = 400, cy = 300, rx = 180, ry = 180, count = 72, noise = 0, seed = 7 } = {}) => {
  const jitter = createJitter(seed);
  const points = [];
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2;
    points.push({
      x: cx + Math.cos(angle) * rx + jitter(noise),
      y: cy + Math.sin(angle) * ry + jitter(noise)
    });
  }
  points.push({ ...points[0] });
  return points;
};

const buildPolyline = (corners, { samplesPerEdge = 14, noise = 0, seed = 11, close = true } = {}) => {
  const jitter = createJitter(seed);
  const path = close ? [...corners, corners[0]] : corners;
  const points = [];

  for (let index = 0; index < path.length - 1; index += 1) {
    const from = path[index];
    const to = path[index + 1];
    for (let step = 0; step < samplesPerEdge; step += 1) {
      const t = step / samplesPerEdge;
      points.push({
        x: from.x + (to.x - from.x) * t + jitter(noise),
        y: from.y + (to.y - from.y) * t + jitter(noise)
      });
    }
  }
  points.push({ ...path[path.length - 1] });
  return points;
};

// ---------------------------------------------------------------------------
// Hulpfuncties
// ---------------------------------------------------------------------------

test('resampleStrokePoints levert punten op gelijke booglengte', () => {
  const points = resampleStrokePoints([{ x: 0, y: 0 }, { x: 100, y: 0 }], 5);

  assert.equal(points.length, 5);
  assert.equal(points[0].x, 0);
  assert.ok(Math.abs(points[2].x - 50) < 0.001);
  assert.ok(Math.abs(points[4].x - 100) < 0.001);
});

test('resampleStrokePoints gaat om met een streek zonder lengte', () => {
  const points = resampleStrokePoints([{ x: 5, y: 5 }, { x: 5, y: 5 }], 4);

  assert.equal(points.length, 4);
  points.forEach((point) => assert.deepEqual(point, { x: 5, y: 5 }));
});

test('simplifyPath houdt alleen de vormbepalende punten over', () => {
  const points = [
    { x: 0, y: 0 },
    { x: 25, y: 1 },
    { x: 50, y: 0 },
    { x: 75, y: 1 },
    { x: 100, y: 0 }
  ];

  assert.deepEqual(simplifyPath(points, 5), [{ x: 0, y: 0 }, { x: 100, y: 0 }]);
  assert.ok(simplifyPath(points, 0.5).length > 2);
});

test('getClosedShapeCorners vindt vier hoeken van een vierkant, ook als de naad midden op een zijde ligt', () => {
  const square = buildPolyline(
    [{ x: 0, y: 0 }, { x: 200, y: 0 }, { x: 200, y: 200 }, { x: 0, y: 200 }],
    { samplesPerEdge: 16 }
  );
  // Naad verschuiven naar het midden van de bovenzijde.
  const rotated = [...square.slice(8, -1), ...square.slice(0, 8)];

  assert.equal(getClosedShapeCorners(rotated, 0.06 * Math.hypot(200, 200)).length, 4);
});

// ---------------------------------------------------------------------------
// Poortwachter
// ---------------------------------------------------------------------------

test('canRecognizePresenterStroke laat markeerstift en lijnpen met rust', () => {
  const points = buildCircle();

  assert.equal(canRecognizePresenterStroke(penStroke(points)), true);
  assert.equal(canRecognizePresenterStroke({ ...penStroke(points), variant: 'highlighter' }), false);
  assert.equal(canRecognizePresenterStroke({ ...penStroke(points), variant: 'geometry-pen' }), false);
  assert.equal(canRecognizePresenterStroke(null), false);
});

test('canRecognizePresenterStroke weigert streken met te weinig punten', () => {
  const twoPointStroke = penStroke([{ x: 0, y: 0 }, { x: 400, y: 400 }]);

  assert.ok(PRESENTER_SHAPE_MIN_POINTS > 2);
  assert.equal(canRecognizePresenterStroke(twoPointStroke), false);
  // Zo blijven gesnapte streken (liniaal, geodriehoek, lijnpen) ongemoeid.
  assert.equal(recognizePresenterShape(twoPointStroke), null);
});

// ---------------------------------------------------------------------------
// Herkenning
// ---------------------------------------------------------------------------

test('een gerammelde cirkel wordt een ellips met de juiste omhullende', () => {
  const shape = recognizePresenterShape(penStroke(buildCircle({ noise: 6 })));

  assert.equal(shape?.type, 'ellipse');
  assert.ok(Math.abs(shape.x - 220) < 20, `x=${shape.x}`);
  assert.ok(Math.abs(shape.y - 120) < 20, `y=${shape.y}`);
  assert.ok(Math.abs(shape.width - 360) < 30, `width=${shape.width}`);
  assert.ok(Math.abs(shape.height - 360) < 30, `height=${shape.height}`);
  assert.ok(shape.confidence > 0.6);
});

test('een uitgerekte ovaal blijft een ellips', () => {
  const shape = recognizePresenterShape(penStroke(buildCircle({ rx: 300, ry: 110, noise: 5, seed: 21 })));

  assert.equal(shape?.type, 'ellipse');
  assert.ok(shape.width > shape.height);
});

test('een handmatig getrokken rechthoek wordt een rechthoek', () => {
  const points = buildPolyline(
    [{ x: 100, y: 120 }, { x: 520, y: 116 }, { x: 524, y: 380 }, { x: 96, y: 384 }],
    { samplesPerEdge: 18, noise: 4, seed: 33 }
  );
  const shape = recognizePresenterShape(penStroke(points));

  assert.equal(shape?.type, 'rectangle');
  assert.ok(Math.abs(shape.width - 424) < 30, `width=${shape.width}`);
  assert.ok(Math.abs(shape.height - 264) < 30, `height=${shape.height}`);
});

test('een gelijkbenige driehoek wordt het bestaande driehoek-object', () => {
  const points = buildPolyline(
    [{ x: 300, y: 100 }, { x: 480, y: 380 }, { x: 120, y: 380 }],
    { samplesPerEdge: 20, noise: 4, seed: 5 }
  );
  const shape = recognizePresenterShape(penStroke(points));

  assert.equal(shape?.type, 'triangle');
});

test('een scheve driehoek wordt een veelhoek met drie punten', () => {
  const points = buildPolyline(
    [{ x: 120, y: 100 }, { x: 520, y: 220 }, { x: 180, y: 400 }],
    { samplesPerEdge: 20, noise: 4, seed: 9 }
  );
  const shape = recognizePresenterShape(penStroke(points));

  assert.equal(shape?.type, 'polygon');
  assert.equal(shape.points.length, 3);
  // Punten staan relatief ten opzichte van de objectoorsprong.
  assert.ok(shape.points.every((point) => point.x >= -1 && point.y >= -1));
});

test('een rechte haal wordt een lijnobject van begin naar eind', () => {
  const points = buildPolyline([{ x: 100, y: 200 }, { x: 700, y: 260 }], {
    samplesPerEdge: 40,
    noise: 3,
    seed: 17,
    close: false
  });
  const shape = recognizePresenterShape(penStroke(points));

  assert.equal(shape?.type, 'line');
  assert.ok(Math.abs(shape.width - 600) < 12, `width=${shape.width}`);
  assert.ok(Math.abs(shape.height - 60) < 12, `height=${shape.height}`);
});

// ---------------------------------------------------------------------------
// Liever niets doen dan de verkeerde vorm
// ---------------------------------------------------------------------------

test('een zigzag levert geen vorm op', () => {
  const points = [];
  for (let index = 0; index < 40; index += 1) {
    points.push({ x: index * 12, y: index % 2 === 0 ? 0 : 90 });
  }

  assert.equal(recognizePresenterShape(penStroke(points)), null);
});

test('handschrift levert geen vorm op', () => {
  // Een golvende, open haal zoals bij het schrijven van een woord.
  const points = [];
  for (let index = 0; index < 90; index += 1) {
    const t = index / 6;
    points.push({ x: index * 7, y: 200 + Math.sin(t) * 55 + Math.sin(t * 2.7) * 22 });
  }

  assert.equal(recognizePresenterShape(penStroke(points)), null);
});

test('een te kleine krabbel wordt genegeerd', () => {
  const shape = recognizePresenterShape(penStroke(buildCircle({ rx: 12, ry: 12, noise: 1 })));

  assert.equal(shape, null);
});

test('een open boog wordt niet als gesloten vorm gelezen', () => {
  const points = [];
  for (let index = 0; index <= 40; index += 1) {
    const angle = (index / 40) * Math.PI;
    points.push({ x: 400 + Math.cos(angle) * 200, y: 400 + Math.sin(angle) * 200 });
  }

  assert.equal(recognizePresenterShape(penStroke(points)), null);
});

test('een hogere drempel maakt de herkenning strenger', () => {
  const stroke = penStroke(buildCircle({ noise: 16, seed: 41 }));

  assert.equal(recognizePresenterShape(stroke, { minConfidence: 1.01 }), null);
});
