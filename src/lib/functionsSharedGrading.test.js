import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  SHARED_ENTRY_POINTS,
  SHARED_PACKAGE_JSON,
  collectSharedGradingFiles,
  verifySharedGradingSync
} from '../../scripts/sync-functions-shared.mjs';

// De beoordelingslaag mag maar op EEN plek bestaan: src/lib. functions/ is een
// apart npm-pakket dat los wordt gedeployed, dus daar staat een gegenereerde
// kopie (scripts/sync-functions-shared.mjs). Deze test is de rem op drift:
// zodra iemand src/lib aanpast en de sync vergeet, valt hij om. Dezelfde
// controle draait aan de functions-kant in functions/sharedGrading.test.js.
const syncCommand = 'node scripts/sync-functions-shared.mjs';

test('the shared grading layer copy in functions/shared is byte-identical to src/lib', () => {
  const status = verifySharedGradingSync();

  assert.deepEqual(status.missing, [], `ontbreekt in functions/shared. Draai: ${syncCommand}`);
  assert.deepEqual(status.drifted, [], `wijkt af van src/lib. Draai: ${syncCommand}`);
  assert.deepEqual(status.stale, [], `staat nog in functions/shared maar hoort er niet meer. Draai: ${syncCommand}`);
  assert.equal(status.packageJsonInSync, true, `functions/shared/package.json is verouderd. Draai: ${syncCommand}`);
  assert.equal(status.inSync, true);
});

test('the shared grading closure covers the graders plus the preview model', () => {
  const files = collectSharedGradingFiles();

  SHARED_ENTRY_POINTS.forEach((entry) => {
    assert.equal(files.includes(entry), true, `${entry} hoort in de gedeelde laag`);
  });
  assert.equal(files.includes('questionGrading.js'), true);
  assert.equal(files.includes('publicQuestionView.js'), true);
  assert.equal(files.includes('questionTypeRegistry.js'), true);
});

test('functions/shared stays plain ESM so the CommonJS functions package can import it', () => {
  assert.equal(
    readFileSync(new URL('../../functions/shared/package.json', import.meta.url), 'utf8'),
    SHARED_PACKAGE_JSON
  );
  assert.match(SHARED_PACKAGE_JSON, /"type": "module"/);
});

test('the shared grading layer stays free of React, Firebase and browser APIs', () => {
  collectSharedGradingFiles().forEach((fileName) => {
    const source = readFileSync(new URL(`./${fileName}`, import.meta.url), 'utf8');
    assert.doesNotMatch(source, /from\s+['"](react|firebase|firebase\/[^'"]+)['"]/, `${fileName} mag geen React of Firebase importeren`);
    assert.doesNotMatch(source, /\b(?:window|document|localStorage)\./, `${fileName} mag geen browser-API gebruiken`);
  });
});
