import test from 'node:test';
import assert from 'node:assert/strict';
import { MEDIA_KINDS } from './mediaUtils.js';
import {
  BOARD_MEDIA_MODES,
  buildPlaybackHandoff,
  formatMediaTime,
  getBoardMediaMode,
  getSeekTarget
} from './presenterMediaControls.js';

test('every media kind gets a board rendering mode', () => {
  assert.equal(getBoardMediaMode(MEDIA_KINDS.VIDEO, 'https://x.test/a.mp4'), BOARD_MEDIA_MODES.VIDEO);
  assert.equal(getBoardMediaMode(MEDIA_KINDS.YOUTUBE, 'https://youtu.be/abc'), BOARD_MEDIA_MODES.EMBED);
  assert.equal(getBoardMediaMode(MEDIA_KINDS.PDF, 'https://x.test/a.pdf'), BOARD_MEDIA_MODES.PDF);
  assert.equal(getBoardMediaMode(MEDIA_KINDS.LINK, 'https://x.test/'), BOARD_MEDIA_MODES.LINK);
  assert.equal(getBoardMediaMode(MEDIA_KINDS.IMAGE, 'https://x.test/a.png'), BOARD_MEDIA_MODES.IMAGE);
  assert.equal(getBoardMediaMode(MEDIA_KINDS.VIDEO, ''), BOARD_MEDIA_MODES.EMPTY);
});

test('seeking stays inside the clip', () => {
  assert.equal(getSeekTarget(30, 10, 120), 40);
  assert.equal(getSeekTarget(4, -10, 120), 0);
  assert.equal(getSeekTarget(115, 10, 120), 120);
});

test('seeking survives an unknown duration', () => {
  assert.equal(getSeekTarget(30, 10, NaN), 40);
  assert.equal(getSeekTarget(undefined, 10, undefined), 10);
});

test('times are shown as minutes and seconds', () => {
  assert.equal(formatMediaTime(0), '0:00');
  assert.equal(formatMediaTime(9), '0:09');
  assert.equal(formatMediaTime(75.8), '1:15');
  assert.equal(formatMediaTime(NaN), '0:00');
});

test('opening the large view carries the playback position along', () => {
  assert.deepEqual(buildPlaybackHandoff({ currentTime: 42.5, paused: false, muted: true }), {
    currentTime: 42.5,
    wasPlaying: true,
    muted: true
  });
  assert.deepEqual(buildPlaybackHandoff(null), {
    currentTime: 0,
    wasPlaying: false,
    muted: false
  });
});
