import assert from 'node:assert/strict';
import test from 'node:test';
import {
  boxesOverlap,
  buildProtractorScale,
  buildRulerTicks,
  buildTriangleScale,
  createPresenterInstrument,
  formatProtractorReading,
  formatRulerLength,
  getInstrumentAngleLabel,
  getInstrumentBounds,
  getInstrumentCenter,
  getInstrumentEdgeLine,
  getInstrumentMetrics,
  getInstrumentPivot,
  getProtractorReadingFromPoint,
  isPointNearInstrumentEdge,
  planInstrumentPlacement,
  PRESENTER_INSTRUMENT_DEFS,
  PRESENTER_INSTRUMENT_MIN_SIZE,
  PRESENTER_PAGE_BAR_RESERVE_PX,
  PRESENTER_TOOLBAR_RESERVE_PX,
  projectPointOntoEdge,
  segmentHitsBox,
  TRIANGLE_SCALE
} from './presenterInstruments.js';

test('createPresenterInstrument gebruikt defaults en kent onbekende ids niet', () => {
  const ruler = createPresenterInstrument('ruler');
  assert.equal(ruler.id, 'ruler');
  assert.equal(ruler.rotation, 0);
  assert.equal(createPresenterInstrument('onzin'), null);
});

test('liniaal heeft een top-tekenrand die meedraait met rotatie', () => {
  const ruler = createPresenterInstrument('ruler', { x: 100, y: 200, rotation: 0 });
  const edge = getInstrumentEdgeLine(ruler);
  assert.equal(edge.y1, 200);
  assert.equal(edge.y2, 200);
  assert.equal(edge.x1, 100);
  assert.equal(edge.x2, 100 + PRESENTER_INSTRUMENT_DEFS.ruler.width);

  const rotated = getInstrumentEdgeLine({ ...ruler, rotation: 90 });
  const center = getInstrumentCenter(ruler);
  assert.equal(Math.abs(rotated.x1 - rotated.x2) < 0.01, true);
  assert.equal(Math.round(rotated.x1), Math.round(center.x + (center.y - 200)));
});

test('passer heeft geen tekenrand', () => {
  const compass = createPresenterInstrument('compass');
  assert.equal(getInstrumentEdgeLine(compass), null);
  assert.equal(isPointNearInstrumentEdge({ x: 0, y: 0 }, compass), false);
});

test('projectPointOntoEdge klemt op het segment', () => {
  const edge = { x1: 0, y1: 100, x2: 200, y2: 100 };
  assert.deepEqual(projectPointOntoEdge({ x: 50, y: 80 }, edge), { x: 50, y: 100 });
  assert.deepEqual(projectPointOntoEdge({ x: -40, y: 90 }, edge), { x: 0, y: 100 });
  assert.deepEqual(projectPointOntoEdge({ x: 260, y: 90 }, edge), { x: 200, y: 100 });
});

test('isPointNearInstrumentEdge respecteert de tolerantie', () => {
  const ruler = createPresenterInstrument('ruler', { x: 0, y: 100, rotation: 0 });
  assert.equal(isPointNearInstrumentEdge({ x: 100, y: 90 }, ruler), true);
  assert.equal(isPointNearInstrumentEdge({ x: 100, y: 40 }, ruler), false);
});

test('getInstrumentAngleLabel normaliseert naar 0-360', () => {
  assert.equal(getInstrumentAngleLabel({ rotation: 45 }), '45°');
  assert.equal(getInstrumentAngleLabel({ rotation: -90 }), '270°');
  assert.equal(getInstrumentAngleLabel({}), '0°');
});

test('passer heeft het naaldpunt als middelpunt en draaipunt', () => {
  const compass = createPresenterInstrument('compass', { x: 400, y: 300 });
  assert.deepEqual(getInstrumentCenter(compass), { x: 400, y: 300 });
  assert.deepEqual(getInstrumentPivot(compass), { x: 400, y: 300 });
});

test('gradenboog draait om het meetpunt op de basislijn', () => {
  const protractor = createPresenterInstrument('protractor', { x: 100, y: 200, rotation: 0 });
  const def = PRESENTER_INSTRUMENT_DEFS.protractor;
  const pivot = getInstrumentPivot(protractor);
  assert.deepEqual(pivot, { x: 100 + def.pivot.x, y: 200 + def.pivot.y });

  // De tekenrand valt samen met de getekende basislijn, niet met de bbox-onderkant.
  const edge = getInstrumentEdgeLine(protractor);
  assert.equal(edge.y1, 200 + def.localEdge.y1);
  assert.equal(edge.x1, 100 + def.localEdge.x1);
  assert.equal(edge.x2, 100 + def.localEdge.x2);

  // Het meetpunt blijft liggen waar het lag als je draait.
  const rotated = getInstrumentEdgeLine({ ...protractor, rotation: 37 });
  const middle = { x: (rotated.x1 + rotated.x2) / 2, y: (rotated.y1 + rotated.y2) / 2 };
  assert.equal(Math.round(middle.x), Math.round(pivot.x));
  assert.equal(Math.round(middle.y), Math.round(pivot.y));
});

test('buildRulerTicks volgt de ruitjesmaat', () => {
  const scale = buildRulerTicks({ length: 960, gridSize: 96 });
  assert.equal(scale.unit, 96);
  assert.equal(scale.units, 10);
  assert.equal(scale.step, 9.6);
  assert.equal(scale.ticks.length, 101);
  assert.equal(scale.ticks[0].kind, 'major');
  assert.equal(scale.ticks[5].kind, 'mid');
  assert.equal(scale.ticks[3].kind, 'minor');
  assert.equal(scale.ticks[10].x, 96);
  assert.deepEqual(scale.labels.at(-1), { value: 10, x: 960 });

  const fine = buildRulerTicks({ length: 720, gridSize: 72 });
  assert.equal(fine.units, 10);
  assert.equal(fine.labels.length, 11);
});

test('formatRulerLength geeft ruitjes met een komma', () => {
  assert.equal(formatRulerLength(96, 96), '1 ruitje');
  assert.equal(formatRulerLength(240, 96), '2,5 ruitjes');
  assert.equal(formatRulerLength(0, 96), '0 ruitjes');
});

test('buildProtractorScale geeft een dubbele schaal van 1 graad', () => {
  const scale = buildProtractorScale({ cx: 320, cy: 332, radius: 284 });
  assert.equal(scale.ticks.length, 181);
  assert.equal(scale.ticks.filter((tick) => tick.kind === 'major').length, 19);
  assert.equal(scale.ticks.filter((tick) => tick.kind === 'mid').length, 18);
  assert.equal(scale.labels.length, 19);

  const first = scale.labels[0];
  assert.equal(first.degrees, 0);
  assert.equal(first.inner, 0);
  assert.equal(first.outer, 180);
  const last = scale.labels.at(-1);
  assert.equal(last.inner, 180);
  assert.equal(last.outer, 0);

  // 0 graden ligt rechts van het middelpunt, 180 graden links.
  assert.equal(Math.round(scale.ticks[0].x2), 320 + 284);
  assert.equal(Math.round(scale.ticks[0].y2), 332);
  assert.equal(Math.round(scale.ticks[180].x2), 320 - 284);
  assert.equal(Math.round(scale.ticks[90].y2), 332 - 284);
});

test('getProtractorReadingFromPoint leest de hoek af, ook gedraaid', () => {
  const pivot = { x: 100, y: 100 };
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 0, point: { x: 200, y: 100 } }), 0);
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 0, point: { x: 100, y: 0 } }), 90);
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 0, point: { x: 0, y: 100 } }), 180);
  // Onder de basislijn wordt geklemd op 0-180.
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 0, point: { x: 100, y: 200 } }), 180);
  // Bij een gedraaid instrument telt de eigen basislijn.
  assert.equal(getProtractorReadingFromPoint({ pivot, rotation: 90, point: { x: 100, y: 200 } }), 0);
  assert.equal(formatProtractorReading(59.6), '60°');
});

// ---------------------------------------------------------------------------
// Leesbaarheid van de schaalcijfers. Een digibord wordt vanaf vier meter
// gelezen: een cijfer waar maatstreepjes of de basislijn doorheen lopen, is dan
// onleesbaar. Deze tests meten dat, in plaats van erop te vertrouwen dat het op
// het oog wel goed staat. De cijferdozen zijn met opzet ruimer genomen dan de
// echte inkt, zodat een cijfer een streepje ook niet net raakt.
// ---------------------------------------------------------------------------

const asSegment = (tick) =>
  Number.isFinite(tick.x) ? { x1: tick.x, y1: tick.y1, x2: tick.x, y2: tick.y2 } : tick;

test('geodriehoek: geen enkel hoekcijfer wordt geraakt door een streepje of de basislijn', () => {
  const baseY = PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.y1;
  const baseLine = {
    x1: PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.x1,
    y1: baseY,
    x2: PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.x2,
    y2: baseY
  };

  // Ook bij een andere ruitjesmaat (kleiner instrument, ander bord) mag er geen
  // streepje door een cijfer lopen.
  for (const gridSize of [40, 56, 72, 96, 120, 144, 192]) {
    const scale = buildTriangleScale({ gridSize });
    const where = `ruitjesmaat ${gridSize}`;

    for (const label of scale.labels) {
      for (const tick of scale.baseTicks) {
        assert.ok(
          !segmentHitsBox(asSegment(tick), label.box),
          `${where}: maatstreepje op x=${tick.x} loopt door cijfer ${label.degrees}`
        );
      }

      for (const tick of scale.arcTicks) {
        assert.ok(
          !segmentHitsBox(tick, label.box),
          `${where}: boogstreepje ${tick.degrees}° loopt door cijfer ${label.degrees}`
        );
      }

      assert.ok(!segmentHitsBox(baseLine, label.box), `${where}: basislijn loopt door cijfer ${label.degrees}`);
    }

    for (let index = 0; index < scale.labels.length; index += 1) {
      for (let other = index + 1; other < scale.labels.length; other += 1) {
        assert.ok(
          !boxesOverlap(scale.labels[index].box, scale.labels[other].box, 4),
          `${where}: cijfers ${scale.labels[index].degrees} en ${scale.labels[other].degrees} staan tegen elkaar aan`
        );
      }
    }

    // De maatverdeling zelf blijft compleet: er verdwijnt geen streepje, en bij
    // de standaardruitjesmaat hoeft er ook niets ingekort te worden.
    const raw = buildRulerTicks({ length: scale.baseTickSpan, gridSize, ticksPerUnit: 5 }).ticks;
    assert.equal(scale.baseTicks.length, raw.length, `${where}: er ontbreekt een maatstreepje`);
  }

  const standard = buildTriangleScale({ gridSize: 96 });
  for (const tick of standard.baseTicks) {
    assert.equal(
      Math.round(baseY - tick.y2),
      TRIANGLE_SCALE.baseTickLength[tick.kind],
      `streepje op x=${tick.x} is onnodig ingekort`
    );
  }
});

test('geodriehoek: de eindcijfers staan boven de streepjesrij, niet erop', () => {
  const baseY = PRESENTER_INSTRUMENT_DEFS.triangle.localEdge.y1;
  const scale = buildTriangleScale({ gridSize: 96 });
  const ends = scale.labels.filter((label) => label.isEnd);

  assert.deepEqual(ends.map((label) => label.degrees), [0, 180]);

  for (const label of ends) {
    // Boven de basislijn, en boven elk streepje dat onder het cijfer door loopt:
    // dat is de vrije band waar het eindcijfer in hoort te vallen.
    assert.ok(label.box.y2 < baseY, `cijfer ${label.degrees} staat nog op de basislijn`);

    const ticksUnderLabel = scale.baseTicks.filter((tick) => tick.x >= label.box.x1 && tick.x <= label.box.x2);
    assert.ok(ticksUnderLabel.length > 0, `cijfer ${label.degrees} staat niet boven de streepjesrij`);
    for (const tick of ticksUnderLabel) {
      assert.ok(tick.y2 > label.box.y2, `streepje op x=${tick.x} reikt tot in cijfer ${label.degrees}`);
    }

    // Ze blijven wel op de cijferring van de andere hoekcijfers staan.
    assert.equal(
      Math.round(Math.hypot(label.x - scale.cx, label.y - baseY)),
      TRIANGLE_SCALE.labelRadius,
      `cijfer ${label.degrees} staat niet meer op de cijferring`
    );
  }

  // De binnenste cijfers zijn niet verplaatst: die stonden al goed.
  const inner = scale.labels.find((label) => label.degrees === 90);
  assert.equal(inner.x, scale.cx);
  assert.equal(inner.y, baseY - TRIANGLE_SCALE.labelRadius);
});

test('gradenboog: de eindcijfers staan op de voet onder de basislijn', () => {
  const def = PRESENTER_INSTRUMENT_DEFS.protractor;
  const cy = def.pivot.y;
  const radius = 284;
  const scale = buildProtractorScale({ cx: def.pivot.x, cy, radius });
  const baseLine = { x1: def.pivot.x - radius, y1: cy, x2: def.pivot.x + radius, y2: cy };
  const ends = scale.labels.filter((label) => label.isEnd);

  assert.deepEqual(ends.map((label) => label.degrees), [0, 180]);

  for (const label of ends) {
    for (const box of [label.outerBox, label.innerBox]) {
      // Onder de dikke basislijn en binnen de voet van het instrument.
      assert.ok(box.y1 > cy + 2.5, `eindcijfer bij ${label.degrees}° ligt nog op de basislijn`);
      assert.ok(box.y2 < def.height - 1.5, `eindcijfer bij ${label.degrees}° valt van de voet af`);
      assert.ok(!segmentHitsBox(baseLine, box), `basislijn loopt door het eindcijfer bij ${label.degrees}°`);
      assert.equal(box.rotation, 0, `eindcijfer bij ${label.degrees}° hoort rechtop te staan`);

      for (const tick of scale.ticks) {
        assert.ok(!segmentHitsBox(tick, box), `streepje ${tick.degrees}° loopt door het eindcijfer bij ${label.degrees}°`);
      }
    }

    assert.ok(
      !boxesOverlap(label.outerBox, label.innerBox, 4),
      `de twee eindcijfers bij ${label.degrees}° staan tegen elkaar aan`
    );
  }

  // De cijfers langs de boog zelf zijn niet verplaatst.
  const ninety = scale.labels.find((label) => label.degrees === 90);
  assert.equal(ninety.outerY, cy - 224);
  assert.equal(ninety.rotation, 0);
});

// ---------------------------------------------------------------------------
// Plaatsing. De harde eis: de omhullende rechthoek van het instrument, met de
// knoppenrij erbij, valt binnen het zichtbare deel van het bord. Deze tests
// controleren die eis rechtstreeks, niet een afgeleide coordinaat, zodat een
// gewijzigde vorm of knoppenrij hier meteen doorheen valt.
// ---------------------------------------------------------------------------

const INSTRUMENT_IDS = Object.keys(PRESENTER_INSTRUMENT_DEFS);

// Vensters zoals een docent ze echt gebruikt, doorgerekend zoals
// PresenterBoard het doet: het bord schaalt op de vensterbreedte, en van de
// hoogte gaan de kopregel, de paginabalk en de werkbalk (met open paneel) af.
const buildViewport = ({ name, windowWidth, windowHeight, pageWidth = 1920, pageHeight = 1400 }) => {
  const boardScale = Math.min(1, (windowWidth - 32) / pageWidth);
  const surfaceHeight = windowHeight - 76;
  const bandPx = surfaceHeight - PRESENTER_TOOLBAR_RESERVE_PX - PRESENTER_PAGE_BAR_RESERVE_PX;

  return {
    name,
    page: { width: pageWidth, height: pageHeight },
    boardScale,
    visible: {
      x: 0,
      y: PRESENTER_PAGE_BAR_RESERVE_PX / boardScale,
      width: pageWidth,
      height: bandPx / boardScale
    }
  };
};

const VIEWPORTS = [
  buildViewport({ name: 'digibord 1920x1080', windowWidth: 1920, windowHeight: 1080 }),
  buildViewport({ name: 'laptop 1280x860', windowWidth: 1280, windowHeight: 860 }),
  buildViewport({ name: 'kleine laptop 1024x700', windowWidth: 1024, windowHeight: 700 }),
  buildViewport({ name: 'smalle pagina 1280x960', windowWidth: 1180, windowHeight: 800, pageWidth: 1280, pageHeight: 960 })
];

const placeInstrument = (instrumentId, viewport, gridSize = 96) => {
  const placement = planInstrumentPlacement({
    instrumentId,
    visibleRect: viewport.visible,
    boardWidth: viewport.page.width,
    boardHeight: viewport.page.height,
    boardScale: viewport.boardScale,
    gridSize
  });
  const instrument = createPresenterInstrument(instrumentId, placement);

  return {
    placement,
    instrument,
    bounds: getInstrumentBounds(instrument, { boardScale: viewport.boardScale, includeChrome: true })
  };
};

const assertInsideRect = (bounds, rect, message) => {
  assert.ok(bounds.x >= rect.x - 0.5, `${message}: links (${bounds.x} < ${rect.x})`);
  assert.ok(bounds.y >= rect.y - 0.5, `${message}: boven (${bounds.y} < ${rect.y})`);
  assert.ok(
    bounds.x + bounds.width <= rect.x + rect.width + 0.5,
    `${message}: rechts (${bounds.x + bounds.width} > ${rect.x + rect.width})`
  );
  assert.ok(
    bounds.y + bounds.height <= rect.y + rect.height + 0.5,
    `${message}: onder (${bounds.y + bounds.height} > ${rect.y + rect.height})`
  );
};

test('elk instrument landt met knoppenrij en al volledig in het zichtbare deel', () => {
  for (const viewport of VIEWPORTS) {
    for (const instrumentId of INSTRUMENT_IDS) {
      const { bounds } = placeInstrument(instrumentId, viewport);
      assertInsideRect(bounds, viewport.visible, `${instrumentId} op ${viewport.name}`);
    }
  }
});

test('de passer steekt niet door de bovenrand: de benen tellen mee', () => {
  const viewport = VIEWPORTS[1];
  const { instrument, bounds } = placeInstrument('compass', viewport);

  // De kop zit boven het naaldpunt; zonder die hoogte mee te rekenen zou het
  // instrument te hoog geplaatst worden.
  assert.ok(bounds.y < instrument.y, 'de kop hoort boven het naaldpunt te liggen');
  assert.ok(bounds.y >= viewport.visible.y, 'de kop mag niet door de bovenrand');
  assert.ok(instrument.y - bounds.y > 200, 'de benen steken flink boven de naald uit');
});

test('krappe vensters maken het instrument kleiner in plaats van het af te snijden', () => {
  const roomy = VIEWPORTS[0];
  const cramped = VIEWPORTS[2];

  for (const instrumentId of INSTRUMENT_IDS) {
    const wide = placeInstrument(instrumentId, roomy);
    const tight = placeInstrument(instrumentId, cramped);

    // Kleiner venster mag nooit een groter instrument opleveren.
    assert.ok(
      tight.placement.sizeScale <= wide.placement.sizeScale,
      `${instrumentId} werd groter in een krapper venster`
    );
    assert.ok(tight.placement.sizeScale >= PRESENTER_INSTRUMENT_MIN_SIZE);
    assertInsideRect(tight.bounds, cramped.visible, `${instrumentId} krap`);
  }

  // De passer is het hoogste instrument en past op een kleine laptop niet meer
  // op volle maat; die hoort dus echt te krimpen in plaats van af te lopen.
  const compass = placeInstrument('compass', cramped);
  assert.ok(
    compass.placement.sizeScale < 1,
    `de passer hoort kleiner te worden op een kleine laptop (was ${compass.placement.sizeScale})`
  );
  assert.ok(compass.bounds.height < placeInstrument('compass', roomy).bounds.height);
});

test('een kleinere passer krijgt een kleinere straal op hele of halve ruitjes', () => {
  const tight = placeInstrument('compass', VIEWPORTS[2]);
  const roomy = placeInstrument('compass', VIEWPORTS[0]);
  assert.ok(tight.placement.sizeScale < roomy.placement.sizeScale);

  assert.ok(tight.instrument.radius < roomy.instrument.radius);
  assert.equal(tight.instrument.radius % 48, 0, 'straal valt op een halve ruit');
  assert.equal(roomy.instrument.radius % 48, 0, 'straal valt op een halve ruit');
});

test('een kleinere liniaal houdt de schaal van het ruitjespapier', () => {
  const metrics = getInstrumentMetrics(createPresenterInstrument('ruler', { sizeScale: 0.5 }));
  assert.equal(metrics.width, PRESENTER_INSTRUMENT_DEFS.ruler.width / 2);
  assert.equal(metrics.pivot.x, PRESENTER_INSTRUMENT_DEFS.ruler.pivot.x / 2);

  // De tekening blijft in lokale units; de aanroeper deelt de ruitjesmaat door
  // de maatfactor. Rendered komt een eenheid dan weer op precies een ruitje uit.
  const local = buildRulerTicks({ length: PRESENTER_INSTRUMENT_DEFS.ruler.width, gridSize: 96 / 0.5 });
  assert.equal(local.unit * 0.5, 96);
  assert.equal(local.units, 5);
});

test('de tekenrand en het draaipunt schalen mee met de maat', () => {
  const half = createPresenterInstrument('ruler', { x: 100, y: 200, sizeScale: 0.5, rotation: 0 });
  const edge = getInstrumentEdgeLine(half);
  assert.equal(edge.x1, 100);
  assert.equal(edge.x2, 100 + PRESENTER_INSTRUMENT_DEFS.ruler.width / 2);
  assert.deepEqual(getInstrumentPivot(half), { x: 100 + 240, y: 200 + 33 });
  assert.deepEqual(getInstrumentCenter(half), { x: 100 + 240, y: 200 + 33 });
});

test('getInstrumentBounds telt rotatie mee', () => {
  const flat = createPresenterInstrument('ruler', { x: 100, y: 200 });
  const upright = createPresenterInstrument('ruler', { x: 100, y: 200, rotation: 90 });
  const def = PRESENTER_INSTRUMENT_DEFS.ruler;

  assert.deepEqual(getInstrumentBounds(flat), { x: 100, y: 200, width: def.width, height: def.height });

  const rotated = getInstrumentBounds(upright);
  assert.equal(Math.round(rotated.width), def.height);
  assert.equal(Math.round(rotated.height), def.width);
});

test('planInstrumentPlacement valt netjes terug zonder viewport of op onzin', () => {
  assert.equal(planInstrumentPlacement({ instrumentId: 'onzin' }), null);
  assert.equal(planInstrumentPlacement(), null);

  const fallback = planInstrumentPlacement({ instrumentId: 'triangle' });
  const instrument = createPresenterInstrument('triangle', fallback);
  const bounds = getInstrumentBounds(instrument, { includeChrome: true });
  assertInsideRect(bounds, { x: 0, y: 0, width: 1920, height: 1400 }, 'triangle zonder viewport');
});

test('past het instrument echt niet, dan blijft de bovenkant in beeld', () => {
  const viewport = { x: 0, y: 400, width: 300, height: 160 };
  const placement = planInstrumentPlacement({
    instrumentId: 'protractor',
    visibleRect: viewport,
    boardScale: 1
  });
  const bounds = getInstrumentBounds(createPresenterInstrument('protractor', placement), {
    includeChrome: true
  });

  assert.equal(placement.sizeScale, PRESENTER_INSTRUMENT_MIN_SIZE);
  assert.ok(bounds.x >= viewport.x - 0.5, 'linkerkant in beeld');
  assert.ok(bounds.y >= viewport.y - 0.5, 'bovenkant in beeld');
});
