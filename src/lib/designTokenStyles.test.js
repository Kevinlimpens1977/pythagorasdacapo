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
