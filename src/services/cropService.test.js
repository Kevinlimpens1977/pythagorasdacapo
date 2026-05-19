import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAndClipCoordinates } from './cropService.js';

test('validateAndClipCoordinates clips crops to the image bounds', () => {
  assert.deepEqual(
    validateAndClipCoordinates(
      { x: 80, y: 10, width: 50, height: 40 },
      { width: 100, height: 100 }
    ),
    { x: 80, y: 10, width: 20, height: 40 }
  );

  assert.deepEqual(
    validateAndClipCoordinates(
      { x: -10, y: -5, width: 30, height: 20 },
      { width: 100, height: 100 }
    ),
    { x: 0, y: 0, width: 20, height: 15 }
  );
});

test('validateAndClipCoordinates rejects crops outside the image', () => {
  assert.equal(
    validateAndClipCoordinates(
      { x: 120, y: 10, width: 20, height: 20 },
      { width: 100, height: 100 }
    ),
    null
  );
});
