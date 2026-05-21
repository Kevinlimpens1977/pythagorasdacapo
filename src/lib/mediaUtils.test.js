import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MEDIA_KINDS,
  getMediaKindFromFile,
  normalizeMediaContent,
  parseYouTubeUrl
} from './mediaUtils.js';

test('parseYouTubeUrl normalizes watch, short and embed links', () => {
  assert.equal(
    parseYouTubeUrl('https://www.youtube.com/watch?v=abc123')?.embedUrl,
    'https://www.youtube.com/embed/abc123'
  );
  assert.equal(
    parseYouTubeUrl('https://youtu.be/xyz789')?.embedUrl,
    'https://www.youtube.com/embed/xyz789'
  );
  assert.equal(
    parseYouTubeUrl('https://www.youtube.com/embed/demo')?.id,
    'demo'
  );
});

test('getMediaKindFromFile recognizes supported media types', () => {
  assert.equal(getMediaKindFromFile({ type: 'image/png' }), MEDIA_KINDS.IMAGE);
  assert.equal(getMediaKindFromFile({ type: 'video/mp4' }), MEDIA_KINDS.VIDEO);
  assert.equal(getMediaKindFromFile({ type: 'application/pdf' }), MEDIA_KINDS.PDF);
  assert.equal(getMediaKindFromFile({ type: 'text/plain' }), '');
});

test('getMediaKindFromFile recognizes video extensions when browser omits mime type', () => {
  assert.equal(getMediaKindFromFile({ name: 'uitleg.mp4', type: '' }), MEDIA_KINDS.VIDEO);
  assert.equal(getMediaKindFromFile({ name: 'uitleg.mov', type: 'application/octet-stream' }), MEDIA_KINDS.VIDEO);
});

test('normalizeMediaContent keeps legacy image media usable', () => {
  assert.deepEqual(
    normalizeMediaContent({ mediaUrl: 'https://example.test/image.jpg', caption: 'Schema' }),
    {
      mediaKind: 'image',
      mediaUrl: 'https://example.test/image.jpg',
      storagePath: '',
      fileName: '',
      contentType: '',
      size: 0,
      caption: 'Schema',
      altText: '',
      thumbnailUrl: '',
      html: '',
      crops: []
    }
  );
});

test('normalizeMediaContent supports uploaded video aliases', () => {
  assert.deepEqual(
    normalizeMediaContent({
      videoUrl: 'https://example.test/clip.mp4?alt=media',
      contentType: 'video/mp4',
      fileName: 'clip.mp4'
    }),
    {
      mediaKind: 'video',
      mediaUrl: 'https://example.test/clip.mp4?alt=media',
      storagePath: '',
      fileName: 'clip.mp4',
      contentType: 'video/mp4',
      size: 0,
      caption: '',
      altText: '',
      thumbnailUrl: '',
      html: '',
      crops: []
    }
  );
});
