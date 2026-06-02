import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const readSource = (relativePath) =>
  readFileSync(new URL(`../${relativePath}`, import.meta.url), 'utf8');

test('presenter keeps one direct CMS import entry point through the Lesstof toolbar button', () => {
  const shellSource = readSource('components/presenter/PresenterShell.jsx');
  const toolbarSource = readSource('components/presenter/PresenterToolbar.jsx');

  assert.doesNotMatch(shellSource, /Importeer CMS/);
  assert.doesNotMatch(toolbarSource, /Importeer uit CMS/);
  assert.match(toolbarSource, /category\.id === 'lesson'/);
  assert.match(toolbarSource, /runAction\(onOpenImport\)/);
});
