import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldCollapseAiTutorOnMouseLeave, shouldExpandAiTutorOnHover } from './aiTutorPanelState.js';

test('shouldCollapseAiTutorOnMouseLeave allows auto-close when draft input is empty', () => {
  assert.equal(shouldCollapseAiTutorOnMouseLeave({ draftInput: '' }), true);
  assert.equal(shouldCollapseAiTutorOnMouseLeave({ draftInput: '   ' }), true);
});

test('shouldCollapseAiTutorOnMouseLeave keeps Digidocent open when draft input exists', () => {
  assert.equal(shouldCollapseAiTutorOnMouseLeave({ draftInput: 'dit verdwijnt' }), false);
});

test('shouldExpandAiTutorOnHover only expands on hover-capable devices', () => {
  assert.equal(shouldExpandAiTutorOnHover({ supportsHover: true }), true);
  assert.equal(shouldExpandAiTutorOnHover({ supportsHover: false }), false);
  assert.equal(shouldExpandAiTutorOnHover(), true);
});
