import assert from 'node:assert/strict';
import test from 'node:test';
import {
  FULLSCREEN_SURFACE_ROOT_CLASS,
  resolveFullscreenEscapeAction,
  shouldExitNativeFullscreenOnDeactivate
} from './fullscreenSurfaceState.js';

test('escape sluit eerst native fullscreen', () => {
  assert.equal(resolveFullscreenEscapeAction({ hasNativeFullscreen: true }), 'exit-native');
});

test('escape zonder native fullscreen deactiveert de overlay', () => {
  assert.equal(resolveFullscreenEscapeAction({ hasNativeFullscreen: false }), 'deactivate');
  assert.equal(resolveFullscreenEscapeAction(), 'deactivate');
});

test('native fullscreen wordt alleen verlaten voor het eigen rootelement', () => {
  const root = { id: 'root' };
  const other = { id: 'other' };

  assert.equal(
    shouldExitNativeFullscreenOnDeactivate({ active: false, nativeFullscreenElement: root, rootElement: root }),
    true
  );
  assert.equal(
    shouldExitNativeFullscreenOnDeactivate({ active: false, nativeFullscreenElement: other, rootElement: root }),
    false
  );
  assert.equal(
    shouldExitNativeFullscreenOnDeactivate({ active: true, nativeFullscreenElement: root, rootElement: root }),
    false
  );
  assert.equal(
    shouldExitNativeFullscreenOnDeactivate({ active: false, nativeFullscreenElement: null, rootElement: root }),
    false
  );
});

test('overlay rootclass gebruikt de gedeelde z-index laag', () => {
  assert.match(FULLSCREEN_SURFACE_ROOT_CLASS, /z-\[1200\]/);
});
