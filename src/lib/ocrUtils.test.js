import test from 'node:test';
import assert from 'node:assert/strict';
import { buildOcrMessages, isOcrRefusalText } from './ocrUtils.js';

test('buildOcrMessages sends images in chat vision image_url format', () => {
  const messages = buildOcrMessages('abc123', 'image/png');

  assert.equal(messages[0].role, 'user');
  assert.equal(messages[0].content[1].type, 'image_url');
  assert.equal(messages[0].content[1].image_url.url, 'data:image/png;base64,abc123');
});

test('isOcrRefusalText detects model refusal messages', () => {
  assert.equal(
    isOcrRefusalText("I apologize, but as a text-based model, I'm unable to extract text."),
    true
  );
  assert.equal(isOcrRefusalText('Bereken met pythagorasschema de lengte van steunbalk AC.'), false);
});
