import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ANGLE_LEG_BASE_LENGTH,
  clampAngleDegrees,
  formatAngleDegrees,
  getAngleDegreesFromReading,
  getAngleFrameGeometry,
  getAngleLegDirections,
  getAngleLegLength,
  getAngleObjectBoardPoint,
  getAngleObjectFrame,
  isInstrumentTap,
  parseAngleInput,
  planAngleObjectPlacement
} from './presenterAngleTool.js';
import {
  buildTriangleMoveArea,
  buildTriangleScale,
  buildTriangleScaleBand,
  createPresenterInstrument,
  getInstrumentPivot,
  getProtractorReadingFromPoint,
  PRESENTER_INSTRUMENT_DEFS,
  PRESENTER_INSTRUMENT_EDGE_TOLERANCE,
  segmentHitsBox,
  TRIANGLE_SCALE
} from './presenterInstruments.js';

// ---------------------------------------------------------------------------
// 1. Van een klikpunt naar een aantal graden
// ---------------------------------------------------------------------------

test('een tik op de schaal wordt een hoekmaat vanaf het gekozen eerste been', () => {
  const triangle = createPresenterInstrument('triangle', { x: 0, y: 0, rotation: 0 });
  const pivot = getInstrumentPivot(triangle);

  // Recht boven het hoekpunt is 90 graden op de schaal.
  const boven = { x: pivot.x, y: pivot.y - 200 };
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 0, point: boven }), 90);
  assert.equal(getAngleDegreesFromReading(90, 'right'), 90);
  assert.equal(getAngleDegreesFromReading(90, 'left'), 90);

  // Schuin rechtsboven wijst 45 aan. Met het been naar rechts is dat een hoek
  // van 45 graden; ligt het been naar links, dan is diezelfde richting 135.
  const rechtsboven = { x: pivot.x + 100, y: pivot.y - 100 };
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 0, point: rechtsboven }), 45);
  assert.equal(getAngleDegreesFromReading(45, 'right'), 45);
  assert.equal(getAngleDegreesFromReading(45, 'left'), 135);

  assert.equal(getAngleDegreesFromReading(null, 'right'), null);
  // De schaal loopt 0-180: daarbuiten wordt geklemd voor hij omgerekend wordt.
  assert.equal(getAngleDegreesFromReading(400, 'right'), 180);
});

test('een tik op de schaal telt ook als het instrument gedraaid staat', () => {
  const triangle = createPresenterInstrument('triangle', { x: 0, y: 0, rotation: 90 });
  const pivot = getInstrumentPivot(triangle);

  // Bij een kwartslag wijst de eigen basislijn recht omlaag; recht onder het
  // hoekpunt is dus de nul van de schaal.
  const reading = getProtractorReadingFromPoint({ pivot, rotation: 90, point: { x: pivot.x, y: pivot.y + 200 } });
  assert.equal(getAngleDegreesFromReading(reading, 'right'), 0);
});

test('het gradenveldje neemt alleen 0 tot en met 360 aan', () => {
  assert.equal(parseAngleInput('0'), 0);
  assert.equal(parseAngleInput('47'), 47);
  assert.equal(parseAngleInput(' 135 '), 135);
  assert.equal(parseAngleInput('90°'), 90);
  assert.equal(parseAngleInput('44,6'), 45);
  assert.equal(parseAngleInput('360'), 360);

  assert.equal(parseAngleInput('361'), null);
  assert.equal(parseAngleInput('-1'), null);
  assert.equal(parseAngleInput('90 graden'), null);
  assert.equal(parseAngleInput(''), null);
  assert.equal(parseAngleInput(null), null);

  assert.equal(clampAngleDegrees(180.4), 180);
  assert.equal(clampAngleDegrees('90'), null);
  assert.equal(formatAngleDegrees(47), '47°');
});

// ---------------------------------------------------------------------------
// 2. Van graden naar de twee beenrichtingen
// ---------------------------------------------------------------------------

test('de twee benen wijzen de goede kant op, ook links en gedraaid', () => {
  // Been naar rechts, instrument recht: eerste been langs +x, tweede been
  // tegen de klok in (op het bord dus omhoog).
  assert.deepEqual(getAngleLegDirections({ instrumentRotation: 0, legDirection: 'right', degrees: 90 }), {
    size: 90,
    legDirection: 'right',
    first: 0,
    second: 270
  });

  // Been naar links: het been ligt langs -x, maar de hoek opent nog steeds naar
  // boven - dus naar de kant waar het lichaam van de geodriehoek ligt.
  assert.deepEqual(getAngleLegDirections({ instrumentRotation: 0, legDirection: 'left', degrees: 90 }), {
    size: 90,
    legDirection: 'left',
    first: 180,
    second: 270
  });

  // De rotatie van het instrument telt gewoon op.
  assert.deepEqual(getAngleLegDirections({ instrumentRotation: 30, legDirection: 'right', degrees: 45 }), {
    size: 45,
    legDirection: 'right',
    first: 30,
    second: 345
  });

  // Nul graden laat de benen samenvallen; 360 ook.
  assert.equal(getAngleLegDirections({ degrees: 0 }).second, 0);
  assert.equal(getAngleLegDirections({ degrees: 360 }).second, 0);
});

test('de beenrichtingen kloppen met de benen die het hoekobject tekent', () => {
  for (const rotation of [0, 15, 45, 90, 180, 285]) {
    for (const legDirection of ['right', 'left']) {
      for (const degrees of [0, 30, 90, 135, 180, 270, 360]) {
        const pivot = { x: 700, y: 500 };
        const placement = planAngleObjectPlacement({
          pivot,
          instrumentRotation: rotation,
          legDirection,
          degrees,
          legLength: ANGLE_LEG_BASE_LENGTH
        });
        const geometry = getAngleFrameGeometry({
          width: placement.width,
          height: placement.height,
          angleDegrees: placement.angleDegrees
        });
        const directions = getAngleLegDirections({ instrumentRotation: rotation, legDirection, degrees });
        const where = `rotatie ${rotation}, been ${legDirection}, ${degrees}°`;

        // Welk van de twee getekende benen "de eerste" heet is rekenwerk; wat
        // telt is dat de twee benen samen precies de twee richtingen bestrijken.
        const drawn = [geometry.leg1End, geometry.leg2End].map((end) => {
          const board = getAngleObjectBoardPoint(end, placement);
          return ((Math.atan2(board.y - pivot.y, board.x - pivot.x) * 180) / Math.PI + 360) % 360;
        });

        for (const expected of [directions.first, directions.second]) {
          const best = Math.min(...drawn.map((actual) => Math.abs(((actual - expected + 540) % 360) - 180)));
          assert.ok(best < 0.02, `${where}: geen been wijst ${expected}° (gevonden ${drawn.map((a) => a.toFixed(1))})`);
        }
      }
    }
  }
});

test('een hoek opent altijd naar de kant waar de geodriehoek ligt', () => {
  // Boven de basislijn van het instrument, dus nooit eronder weg. In het lokale
  // stelsel van het instrument betekent "boven" een negatieve y.
  for (const rotation of [0, 30, 90, 200, 315]) {
    for (const legDirection of ['right', 'left']) {
      for (const degrees of [10, 45, 90, 135, 170]) {
        const pivot = { x: 900, y: 700 };
        const placement = planAngleObjectPlacement({ pivot, instrumentRotation: rotation, legDirection, degrees });
        const geometry = getAngleFrameGeometry({
          width: placement.width,
          height: placement.height,
          angleDegrees: placement.angleDegrees
        });
        const where = `rotatie ${rotation}, been ${legDirection}, ${degrees}°`;

        for (const end of [geometry.leg1End, geometry.leg2End]) {
          const board = getAngleObjectBoardPoint(end, placement);
          // Terugdraaien naar het stelsel van het instrument.
          const radians = (-rotation * Math.PI) / 180;
          const dx = board.x - pivot.x;
          const dy = board.y - pivot.y;
          const local = dx * Math.sin(radians) + dy * Math.cos(radians);

          assert.ok(local <= 0.01, `${where}: een been duikt onder de basislijn van het instrument`);
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// 3. Plaatsing: het hoekpunt landt op het draaipunt van de geodriehoek
// ---------------------------------------------------------------------------

test('het hoekpunt van een geplaatste hoek valt precies op het draaipunt', () => {
  for (const rotation of [0, 45, 90, 180, 240, 345]) {
    for (const legDirection of ['right', 'left']) {
      const triangle = createPresenterInstrument('triangle', { x: 320, y: 260, rotation, sizeScale: 0.76 });
      const pivot = getInstrumentPivot(triangle);
      const placement = planAngleObjectPlacement({
        pivot,
        instrumentRotation: rotation,
        legDirection,
        degrees: 60,
        legLength: getAngleLegLength(0.76)
      });
      const geometry = getAngleFrameGeometry({
        width: placement.width,
        height: placement.height,
        angleDegrees: placement.angleDegrees
      });
      const vertex = getAngleObjectBoardPoint({ x: geometry.originX, y: geometry.originY }, placement);

      assert.ok(
        Math.hypot(vertex.x - pivot.x, vertex.y - pivot.y) < 0.05,
        `rotatie ${rotation}, been ${legDirection}: hoekpunt ligt niet op het draaipunt`
      );
    }
  }
});

test('het kader van een nieuwe hoek levert precies de gevraagde beenlengte op', () => {
  for (const legLength of [90, 144, 240, 300]) {
    const frame = getAngleObjectFrame(legLength);
    const geometry = getAngleFrameGeometry({ ...frame, angleDegrees: 90 });

    assert.equal(geometry.legLength, legLength);
    assert.equal(geometry.originX, legLength);
    assert.equal(geometry.originY, frame.height);
    // Beide benen zijn even lang; een rechte hoek mag niet scheef ogen.
    assert.equal(Math.round(Math.hypot(geometry.leg1End.x - geometry.originX, geometry.leg1End.y - geometry.originY)), legLength);
    assert.equal(Math.round(Math.hypot(geometry.leg2End.x - geometry.originX, geometry.leg2End.y - geometry.originY)), legLength);
  }

  assert.equal(getAngleLegLength(1), ANGLE_LEG_BASE_LENGTH);
  assert.equal(getAngleLegLength(0.5), ANGLE_LEG_BASE_LENGTH / 2);
  assert.equal(planAngleObjectPlacement({ pivot: null, degrees: 90 }), null);
  assert.equal(planAngleObjectPlacement({ pivot: { x: 0, y: 0 }, degrees: 'onzin' }), null);
});

// ---------------------------------------------------------------------------
// 4. Het boogje en het label
// ---------------------------------------------------------------------------

const frame = getAngleObjectFrame(ANGLE_LEG_BASE_LENGTH);
const geometryFor = (angleDegrees) => getAngleFrameGeometry({ ...frame, angleDegrees });

test('het boogje zit tussen de benen, en bij een inspringende hoek aan de buitenkant', () => {
  // Een gewone hoek: kleine boog.
  const scherp = geometryFor(60);
  assert.equal(scherp.marker.kind, 'arc');
  assert.match(scherp.marker.d, /A 62\.4 62\.4 0 0 0/);

  // Precies 90 graden krijgt het rechte-hoekteken, geen boogje.
  assert.equal(geometryFor(90).marker.kind, 'right');

  // Boven de 180 graden is het de grote boog: die ligt aan de buitenkant.
  for (const degrees of [181, 240, 300, 359]) {
    const geometry = geometryFor(degrees);
    assert.equal(geometry.marker.kind, 'arc', `${degrees}° hoort een boog te zijn`);
    assert.ok(geometry.marker.d.includes(' 0 1 0 '), `${degrees}°: boogje staat aan de binnenkant`);
  }
  for (const degrees of [1, 60, 179]) {
    assert.ok(geometryFor(degrees).marker.d.includes(' 0 0 0 '), `${degrees}°: boogje staat aan de buitenkant`);
  }

  // 180 graden is een gestrekte hoek: nog steeds de kleine boog (halve cirkel).
  assert.ok(geometryFor(180).marker.d.includes(' 0 0 0 '));

  // Bij 0 graden vallen de benen samen: geen boogje, wel een label.
  assert.equal(geometryFor(0).marker.kind, 'none');
  assert.equal(geometryFor(0).marker.d, '');
  assert.equal(geometryFor(0).label.text, '0°');

  // Bij 360 graden zou één boogsegment door SVG worden overgeslagen; dat wordt
  // een volle cirkel van twee halve bogen.
  const vol = geometryFor(360);
  assert.equal(vol.marker.kind, 'full');
  assert.equal(vol.marker.d.match(/A /g).length, 2);
});

test('het gradenlabel staat bij het boogje en loopt niet door een been', () => {
  for (let degrees = 0; degrees <= 360; degrees += 1) {
    const geometry = geometryFor(degrees);
    const where = `${degrees}°`;

    assert.equal(geometry.label.text, `${degrees}°`, `${where}: verkeerd label`);
    // Klein, maar op een digibord vanaf vier meter leesbaar: fors kleiner dan
    // een tekstobject (48) en fors groter dan de inktdikte.
    assert.ok(geometry.label.fontSize >= 20 && geometry.label.fontSize <= 34, `${where}: labelmaat ${geometry.label.fontSize}`);

    // Bij een hoek van 8 graden of meer past het label naast de benen. Daaronder
    // liggen de benen zo dicht op elkaar dat het label zo ver mogelijk naar
    // buiten schuift; dat is het beste wat er dan te doen valt.
    if (degrees >= 8 && degrees <= 352) {
      for (const leg of geometry.legs) {
        assert.ok(!segmentHitsBox(leg, geometry.label.box), `${where}: het label loopt door een been`);
      }
    }

    if (degrees > 0) {
      // Het label hoort bij het boogje: net erbuiten, niet erbovenop en niet
      // ergens los in het vlak.
      const distance = Math.hypot(geometry.label.x - geometry.originX, geometry.label.y - geometry.originY);
      assert.ok(distance > geometry.marker.reach, `${where}: het label ligt op het boogje`);
    }
  }
});

test('het gradenlabel ligt aan de kant van de hoek die bedoeld is', () => {
  // Op de deellijn: even ver van beide benen af. Bij een inspringende hoek wijst
  // die deellijn naar buiten, dus het label komt daar ook aan de buitenkant.
  for (const degrees of [30, 90, 120, 200, 300]) {
    const geometry = geometryFor(degrees);
    const bisector = ((degrees / 2) * Math.PI) / 180;
    const actual = Math.atan2(geometry.originY - geometry.label.y, geometry.label.x - geometry.originX);
    const diff = Math.abs(((((actual - bisector) * 180) / Math.PI + 540) % 360) - 180);

    assert.ok(diff < 0.01, `${degrees}°: het label staat niet op de deellijn`);
  }
});

test('een kleinere hoek krijgt een kleiner boogje en label, maar blijft leesbaar', () => {
  const klein = getAngleFrameGeometry({ ...getAngleObjectFrame(120), angleDegrees: 60 });
  const groot = getAngleFrameGeometry({ ...getAngleObjectFrame(240), angleDegrees: 60 });

  assert.ok(klein.arcRadius < groot.arcRadius);
  assert.ok(klein.label.fontSize < groot.label.fontSize);
  assert.ok(klein.label.fontSize >= 20);
});

// ---------------------------------------------------------------------------
// 5. De aanraakband op de schaal van de geodriehoek
// ---------------------------------------------------------------------------

const pointInTriangle = (point, [a, b, c]) => {
  const sign = (p, q, r) => (p.x - r.x) * (q.y - r.y) - (q.x - r.x) * (p.y - r.y);
  const d1 = sign(point, a, b);
  const d2 = sign(point, b, c);
  const d3 = sign(point, c, a);
  const hasNegative = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPositive = d1 > 0 || d2 > 0 || d3 > 0;

  return !(hasNegative && hasPositive);
};

test('de aanraakband blijft binnen het sleepvlak en buiten de tekenrand', () => {
  const baseY = PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.y1;
  const band = buildTriangleScaleBand();
  const moveArea = buildTriangleMoveArea();

  assert.ok(band.points.length > 40);

  for (const point of band.points) {
    // Niets van de band mag in de tolerantieband rond de tekenrand komen, want
    // daar klikt de pen vast op de basislijn.
    assert.ok(
      baseY - point.y > PRESENTER_INSTRUMENT_EDGE_TOLERANCE,
      `bandpunt (${point.x}, ${point.y}) ligt in de tolerantieband van de tekenrand`
    );

    // En de band blijft binnen het bestaande sleepvlak: buiten dat vlak ving het
    // instrument nog nooit pointers, en dat moet zo blijven.
    assert.ok(
      pointInTriangle(point, moveArea.points),
      `bandpunt (${point.x}, ${point.y}) valt buiten het sleepvlak`
    );
  }
});

test('de aanraakband ligt om de hoekschaal heen, niet op de cijfers', () => {
  const scale = buildTriangleScale({ gridSize: 96 });
  const band = buildTriangleScaleBand();

  // De boog met zijn streepjes valt in de band...
  assert.ok(band.innerRadius < scale.arcRadius && scale.arcRadius < band.outerRadius);
  for (const tick of scale.arcTicks) {
    if (tick.degrees < band.minDegrees || tick.degrees > band.maxDegrees) continue;

    for (const point of [{ x: tick.x1, y: tick.y1 }, { x: tick.x2, y: tick.y2 }]) {
      const radius = Math.hypot(point.x - scale.cx, point.y - scale.baseY);
      assert.ok(
        radius >= band.innerRadius && radius <= band.outerRadius,
        `boogstreepje ${tick.degrees}° valt buiten de aanraakband`
      );
    }
  }

  // ...maar de cijferring niet: geen enkele hoek van geen enkel cijfer komt in
  // de band, dus de cijfers blijven onbedekt en leesbaar.
  assert.ok(TRIANGLE_SCALE.labelRadius < band.innerRadius);
  for (const label of scale.labels) {
    for (const corner of label.box.corners) {
      assert.ok(
        Math.hypot(corner.x - scale.cx, corner.y - scale.baseY) < band.innerRadius,
        `cijfer ${label.degrees} steekt in de aanraakband`
      );
    }
  }
});

// ---------------------------------------------------------------------------
// 6. Tik of sleep
// ---------------------------------------------------------------------------

test('een tik wijst graden aan, een sleep verplaatst het instrument', () => {
  const startClient = { x: 400, y: 300 };

  assert.equal(isInstrumentTap({ startClient, client: { x: 402, y: 303 }, startTime: 0, time: 120 }), true);
  // Te ver verschoven: dit was verslepen.
  assert.equal(isInstrumentTap({ startClient, client: { x: 430, y: 300 }, startTime: 0, time: 120 }), false);
  // Te lang blijven staan: ook geen tik meer.
  assert.equal(isInstrumentTap({ startClient, client: { x: 401, y: 301 }, startTime: 0, time: 4000 }), false);
  assert.equal(isInstrumentTap({ startClient, client: null }), false);
  assert.equal(isInstrumentTap({}), false);
});
