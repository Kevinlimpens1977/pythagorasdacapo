import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');
const contentBlockBuilder = readFileSync(new URL('../components/cms/ContentBlockBuilder.jsx', import.meta.url), 'utf8');
const cropEditorPanel = readFileSync(new URL('../components/cms/CropEditorPanel.jsx', import.meta.url), 'utf8');

const getCssRule = (selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escapedSelector}\\s*\\{([\\s\\S]*?)\\n\\}`, 'm'));
  return match?.[1] || '';
};

test('primary buttons use the Border Signal gradient border style', () => {
  const primaryRule = getCssRule('.btn-primary');

  assert.match(css, /--helix-gradient-border:/);
  assert.match(primaryRule, /border:\s*2px solid transparent/);
  assert.match(primaryRule, /padding-box/);
  assert.match(primaryRule, /border-box/);
  assert.match(primaryRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(primaryRule, /text-white/);
});

test('progress lens active tab uses the Border Signal gradient border style', () => {
  const activeRule = getCssRule('.dashboard-lens-tab-active');

  assert.match(activeRule, /border:\s*2px solid transparent/);
  assert.match(activeRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(activeRule, /blue/);
});

test('admin header active nav uses the Border Signal gradient border style', () => {
  const activeRule = getCssRule('.admin-nav-tab-active');

  assert.match(activeRule, /border:\s*2px solid transparent/);
  assert.match(activeRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(activeRule, /text-white/);
});

test('clickable action cards show the Border Signal gradient only on interaction', () => {
  const cardRule = getCssRule('.helix-action-card');
  const hoverRule = getCssRule('.helix-action-card:hover');
  const focusRule = getCssRule('.helix-action-card:focus-visible');

  assert.match(cardRule, /border:\s*2px solid transparent/);
  assert.match(cardRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.match(cardRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(cardRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(hoverRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(focusRule, /var\(--helix-gradient-border\) border-box/);
  assert.doesNotMatch(hoverRule, /text-white/);
});

test('secondary studio buttons use the Border Signal gradient on hover and focus only', () => {
  const secondaryRule = getCssRule('.btn-secondary');
  const hoverRule = getCssRule('.btn-secondary:hover');
  const focusRule = getCssRule('.btn-secondary:focus-visible');

  assert.match(secondaryRule, /border:\s*2px solid transparent/);
  assert.match(secondaryRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.match(secondaryRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(secondaryRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(hoverRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(focusRule, /var\(--helix-gradient-border\) border-box/);
});

test('lesblok studio toolbar controls use compact outline states instead of filled gradients', () => {
  const controlRule = getCssRule('.studio-toolbar-control');
  const activeRule = getCssRule('.studio-toolbar-control-active');
  const hoverRule = getCssRule('.studio-toolbar-control:hover');

  assert.match(controlRule, /border:\s*2px solid transparent/);
  assert.match(controlRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.doesNotMatch(controlRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeRule, /color:\s*var\(--helix-navy\)/);
  assert.match(hoverRule, /var\(--helix-gradient-border\) border-box/);
  assert.doesNotMatch(contentBlockBuilder, /helix-gradient text-white/);
  assert.match(contentBlockBuilder, /studio-toolbar-control/);
});

test('presenter chrome uses the shared soft toolbar surface', () => {
  const chromeRule = getCssRule('.presenter-chrome-surface');

  assert.match(chromeRule, /rgba\(255,\s*233,\s*220,\s*0\.92\)/);
  assert.match(chromeRule, /rgba\(255,\s*230,\s*242,\s*0\.72\)/);
  assert.match(chromeRule, /rgba\(241,\s*233,\s*255,\s*0\.92\)/);
  assert.match(chromeRule, /color:\s*var\(--helix-navy\)/);
});

test('fullscreen crop editor header reuses the presenter soft chrome surface', () => {
  assert.match(cropEditorPanel, /presenter-chrome-surface/);
  assert.doesNotMatch(cropEditorPanel, /bg-slate-950 px-5 py-3 text-white/);
  assert.doesNotMatch(cropEditorPanel, /text-fuchsia-200">Crop\/OCR studio/);
  assert.match(cropEditorPanel, /btn-secondary/);
});
