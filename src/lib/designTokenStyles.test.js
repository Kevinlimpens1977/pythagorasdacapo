import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8');

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

test('action cards share the Border Signal active gradient outline', () => {
  const cardRule = getCssRule('.helix-action-card');
  const activeCardRule = getCssRule('.helix-action-card-active');

  assert.match(cardRule, /border:\s*2px solid transparent/);
  assert.match(cardRule, /linear-gradient\(#dfe5ee,\s*#dfe5ee\) border-box/);
  assert.match(cardRule, /color:\s*var\(--helix-navy\)/);
  assert.match(activeCardRule, /border:\s*2px solid transparent/);
  assert.match(activeCardRule, /var\(--helix-gradient-border\) border-box/);
  assert.match(activeCardRule, /color:\s*var\(--helix-navy\)/);
  assert.doesNotMatch(activeCardRule, /text-white/);
});

test('presenter chrome uses the shared soft toolbar surface', () => {
  const chromeRule = getCssRule('.presenter-chrome-surface');

  assert.match(chromeRule, /rgba\(255,\s*233,\s*220,\s*0\.92\)/);
  assert.match(chromeRule, /rgba\(255,\s*230,\s*242,\s*0\.72\)/);
  assert.match(chromeRule, /rgba\(241,\s*233,\s*255,\s*0\.92\)/);
  assert.match(chromeRule, /color:\s*var\(--helix-navy\)/);
});
