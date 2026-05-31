import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAiTutorPreviousMessages } from './aiTutorConversation.js';

test('buildAiTutorPreviousMessages drops incomplete assistant messages from tutor history', () => {
  const messages = buildAiTutorPreviousMessages([
    { role: 'assistant', content: 'Hoi Kevin! Kun je' },
    { role: 'user', content: 'Die zin is niet af.' },
    { role: 'assistant', content: 'Klopt, mijn zin was afgebroken.' },
    { role: 'user', content: 'Maar klopt mijn antwoord?' }
  ]);

  assert.deepEqual(messages, [
    { role: 'user', content: 'Die zin is niet af.' },
    { role: 'assistant', content: 'Klopt, mijn zin was afgebroken.' }
  ]);
});
