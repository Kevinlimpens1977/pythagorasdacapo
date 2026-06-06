import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCOUNT_ESCAPE_MISSIONS,
  ACCOUNT_ESCAPE_SKILL_SUMMARY,
  calculateAccountEscapeScore,
  createAccountEscapeProgressSummary,
  evaluateAccountEscapeChoice,
  getAccountEscapeMissionById
} from './accountEscapeLogic.js';

test('Account Escape contains the five planned school start missions in order', () => {
  assert.deepEqual(
    ACCOUNT_ESCAPE_MISSIONS.map((mission) => mission.id),
    ['helix', 'onedrive', 'bestand', 'outlook', 'uitloggen']
  );

  assert.deepEqual(ACCOUNT_ESCAPE_SKILL_SUMMARY, [
    'Je weet waar je lesroute staat.',
    'Je bewaart schoolwerk in OneDrive.',
    'Je herkent een duidelijke bestandsnaam.',
    'Je gebruikt Outlook voor schoolmail.',
    'Je deelt je wachtwoord niet en logt veilig uit.'
  ]);
});

test('Account Escape marks the intended safe choices as correct', () => {
  assert.equal(evaluateAccountEscapeChoice('helix', 'helix-platform').isCorrect, true);
  assert.equal(evaluateAccountEscapeChoice('onedrive', 'onedrive').isCorrect, true);
  assert.equal(evaluateAccountEscapeChoice('bestand', 'les01-schooltas').isCorrect, true);
  assert.equal(evaluateAccountEscapeChoice('outlook', 'docent-mail').isCorrect, true);
  assert.equal(evaluateAccountEscapeChoice('outlook', 'deel-nooit').isCorrect, true);
  assert.equal(evaluateAccountEscapeChoice('uitloggen', 'opslaan-sluiten-uitloggen').isCorrect, true);
});

test('Account Escape gives a hint for unsafe or unclear choices', () => {
  const result = evaluateAccountEscapeChoice('outlook', 'deel-wachtwoord');

  assert.equal(result.isCorrect, false);
  assert.match(result.feedback, /wachtwoord/i);
  assert.match(result.feedback, /nooit/i);
});

test('Account Escape score counts completed missions instead of total clicks', () => {
  const progress = {
    helix: { isCorrect: true },
    onedrive: { isCorrect: true },
    bestand: { isCorrect: false },
    outlook: { isCorrect: true },
    uitloggen: { isCorrect: false }
  };

  assert.equal(calculateAccountEscapeScore(progress), 3);
});

test('Account Escape progress summary reports unlocked and remaining missions', () => {
  const summary = createAccountEscapeProgressSummary({
    helix: { isCorrect: true },
    onedrive: { isCorrect: false }
  });

  assert.deepEqual(summary, {
    unlockedCount: 1,
    totalCount: 5,
    remainingMissionIds: ['onedrive', 'bestand', 'outlook', 'uitloggen']
  });
});

test('Account Escape lookup returns null for unknown mission ids', () => {
  assert.equal(getAccountEscapeMissionById('helix').title, 'HELIX vinden');
  assert.equal(getAccountEscapeMissionById('onbekend'), null);
});
