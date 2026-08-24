import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  appendStrokePoint,
  getCoalescedPointerSamples,
  isPalmContact,
  isWithinPenHoldOff,
  PRESENTER_PALM_CONTACT_PX,
  PRESENTER_PEN_HOLD_OFF_MS,
  resolvePointerIntent
} from './presenterPointer.js';

const palm = { pointerType: 'touch', pointerWidth: PRESENTER_PALM_CONTACT_PX + 20, pointerHeight: PRESENTER_PALM_CONTACT_PX + 30 };
const finger = { pointerType: 'touch', pointerWidth: 22, pointerHeight: 26 };

test('isPalmContact ziet alleen een groot aanraakvlak als handpalm', () => {
  assert.equal(isPalmContact({ pointerType: 'touch', width: 70, height: 80 }), true);
  assert.equal(isPalmContact({ pointerType: 'touch', width: 22, height: 26 }), false);
  // Schermen die niets over het contactvlak weten melden 1x1 of niets.
  assert.equal(isPalmContact({ pointerType: 'touch' }), false);
  assert.equal(isPalmContact({ pointerType: 'touch', width: 1, height: 1 }), false);
  // Een pen met een brede punt is geen handpalm.
  assert.equal(isPalmContact({ pointerType: 'pen', width: 90, height: 90 }), false);
});

test('isWithinPenHoldOff geldt alleen kort na het laatste pensignaal', () => {
  assert.equal(isWithinPenHoldOff({ lastPenAt: 1000, now: 1200 }), true);
  assert.equal(isWithinPenHoldOff({ lastPenAt: 1000, now: 1000 + PRESENTER_PEN_HOLD_OFF_MS }), false);
  assert.equal(isWithinPenHoldOff({ lastPenAt: null, now: 1200 }), false);
  assert.equal(isWithinPenHoldOff({ lastPenAt: 5000, now: 1200 }), false);
});

test('de handpalm wordt geweigerd bij tekenen, gummen en selecteren', () => {
  for (const toolId of ['draw', 'eraser', 'select']) {
    const decision = resolvePointerIntent({ ...palm, toolId });
    assert.equal(decision.intent, 'ignore', `handpalm mag niets doen met ${toolId}`);
    assert.equal(decision.reason, 'palm');
  }
});

test('touch wordt vlak na de pen geweigerd bij tekenen, gummen en selecteren', () => {
  for (const toolId of ['draw', 'eraser', 'select']) {
    const decision = resolvePointerIntent({ ...finger, toolId, lastPenAt: 1000, now: 1100 });
    assert.equal(decision.intent, 'ignore', `touch mag niets doen met ${toolId} vlak na de pen`);
    assert.equal(decision.reason, 'pen-hold-off');
  }

  // Ruim na de pen mag de vinger weer.
  assert.equal(
    resolvePointerIntent({ ...finger, toolId: 'eraser', lastPenAt: 1000, now: 1000 + PRESENTER_PEN_HOLD_OFF_MS + 1 }).intent,
    'erase'
  );
});

test('touch wordt geweigerd zolang een penstreek loopt, ook bij gum en selectie', () => {
  for (const toolId of ['draw', 'eraser', 'select']) {
    const decision = resolvePointerIntent({ ...finger, toolId, activeStrokePointerType: 'pen' });
    assert.equal(decision.intent, 'ignore');
    assert.equal(decision.reason, 'pen-active');
  }
});

test('de pen zelf wordt nooit door de nawerktijd of het contactvlak tegengehouden', () => {
  const decision = resolvePointerIntent({
    pointerType: 'pen',
    pointerWidth: 120,
    pointerHeight: 120,
    toolId: 'draw',
    lastPenAt: 1000,
    now: 1010
  });

  assert.equal(decision.intent, 'draw');
});

test('een tweede vinger annuleert de streek en gaat pannen', () => {
  const decision = resolvePointerIntent({ ...finger, toolId: 'draw', activeStrokePointerType: 'touch' });

  assert.equal(decision.intent, 'pan');
  assert.equal(decision.cancelActiveStroke, true);
});

test('de pen neemt het over van een vingerstreek', () => {
  const decision = resolvePointerIntent({ pointerType: 'pen', toolId: 'draw', activeStrokePointerType: 'touch' });

  assert.equal(decision.intent, 'draw');
  assert.equal(decision.cancelActiveStroke, true);
});

test('vingertekenen uit betekent pannen in plaats van tekenen', () => {
  assert.equal(resolvePointerIntent({ ...finger, toolId: 'draw', allowFingerDrawing: false }).intent, 'pan');
  assert.equal(resolvePointerIntent({ ...finger, toolId: 'draw', allowFingerDrawing: true }).intent, 'draw');
  assert.equal(resolvePointerIntent({ ...finger, toolId: 'draw', touchPanActive: true }).intent, 'pan');
});

test('alleen de primaire knop start iets, en tekenen vraagt een handler', () => {
  assert.equal(resolvePointerIntent({ pointerType: 'mouse', button: 2, toolId: 'eraser' }).intent, 'ignore');
  assert.equal(resolvePointerIntent({ pointerType: 'mouse', button: 0, toolId: 'draw' }).intent, 'draw');
  assert.equal(resolvePointerIntent({ pointerType: 'mouse', toolId: 'draw', canDraw: false }).intent, 'ignore');
  // Gummen en selecteren hebben die handler niet nodig.
  assert.equal(resolvePointerIntent({ pointerType: 'mouse', toolId: 'eraser', canDraw: false }).intent, 'erase');
});

test('getCoalescedPointerSamples gebruikt de tussenliggende events', () => {
  const samples = [{ clientX: 1 }, { clientX: 2 }, { clientX: 3 }];
  const event = { nativeEvent: { clientX: 3, getCoalescedEvents: () => samples } };

  assert.deepEqual(getCoalescedPointerSamples(event), samples);
});

test('getCoalescedPointerSamples valt terug op het event zelf', () => {
  const bare = { clientX: 7 };
  assert.deepEqual(getCoalescedPointerSamples({ nativeEvent: bare }), [bare]);
  assert.deepEqual(getCoalescedPointerSamples(bare), [bare]);

  const empty = { clientX: 9, getCoalescedEvents: () => [] };
  assert.deepEqual(getCoalescedPointerSamples(empty), [empty]);

  const broken = {
    clientX: 11,
    getCoalescedEvents: () => {
      throw new Error('niet beschikbaar');
    }
  };
  assert.deepEqual(getCoalescedPointerSamples(broken), [broken]);
  assert.deepEqual(getCoalescedPointerSamples(null), []);
});

test('appendStrokePoint houdt de puntenlijst kort zonder de haal te vergroven', () => {
  const points = [{ x: 0, y: 0 }];

  const same = appendStrokePoint(points, { x: 0.2, y: 0.1 });
  assert.equal(same, points, 'een sample op dezelfde plek voegt niets toe');

  const grown = appendStrokePoint(points, { x: 1.4, y: 0 });
  assert.equal(grown.length, 2);
  assert.deepEqual(grown[1], { x: 1.4, y: 0 });

  assert.equal(appendStrokePoint(points, { x: Number.NaN, y: 3 }), points);
  assert.deepEqual(appendStrokePoint([], { x: 0.1, y: 0.1 }), [{ x: 0.1, y: 0.1 }]);
});

test('het bord weegt de pointer af voordat het gereedschap aan bod komt', () => {
  const source = readFileSync(new URL('../components/presenter/PresenterBoard.jsx', import.meta.url), 'utf8');
  const downIndex = source.indexOf('const handlePointerDown');
  const decisionIndex = source.indexOf('resolvePointerIntent({', downIndex);
  const eraserIndex = source.indexOf("decision.intent === 'erase'", downIndex);
  const selectIndex = source.indexOf("decision.intent === 'select'", downIndex);

  assert.ok(downIndex > -1);
  assert.ok(decisionIndex > downIndex, 'de afweging staat in handlePointerDown');
  assert.ok(eraserIndex > decisionIndex, 'de gum komt na de afweging');
  assert.ok(selectIndex > decisionIndex, 'de selectie komt na de afweging');
  assert.match(source, /getCoalescedPointerSamples\(event\)/);
});
