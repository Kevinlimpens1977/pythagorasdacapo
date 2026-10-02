import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MEDIA_KINDS,
  getMediaKindFromFile,
  kiesOndertitelTaal,
  normalizeMediaContent,
  normalizeOndertitels,
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
      crops: [],
      ondertitels: []
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
      crops: [],
      ondertitels: []
    }
  );
});

test('normalizeMediaContent treats normal web pages as external links', () => {
  assert.equal(
    normalizeMediaContent({ mediaUrl: 'https://schooltv.nl/video-item/wat-is-phishing' }).mediaKind,
    MEDIA_KINDS.LINK
  );
});

test('normalizeOndertitels houdt alleen bruikbare sporen over', () => {
  assert.deepEqual(
    normalizeOndertitels([
      { taal: 'NL', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: 'explainers/h2/ondertitels.nl.vtt' },
      { taal: 'ar', url: 'https://example.test/ar.vtt' },
      { taal: '', url: 'https://example.test/leeg.vtt' },
      { taal: 'en', url: 'javascript:alert(1)' },
      null
    ]),
    [
      { taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: 'explainers/h2/ondertitels.nl.vtt' },
      { taal: 'ar', label: 'AR', url: 'https://example.test/ar.vtt', storagePath: '' }
    ]
  );
  assert.deepEqual(normalizeOndertitels(undefined), []);
  assert.deepEqual(normalizeOndertitels('geen lijst'), []);
});

test('normalizeMediaContent geeft ondertitels door', () => {
  const media = normalizeMediaContent({
    mediaUrl: 'https://example.test/uitleg.mp4',
    ondertitels: [{ taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt' }]
  });
  assert.equal(media.mediaKind, 'video');
  assert.deepEqual(media.ondertitels, [
    { taal: 'nl', label: 'Nederlands', url: 'https://example.test/nl.vtt', storagePath: '' }
  ]);
});

test('kiesOndertitelTaal kiest de voorkeurstaal als het spoor bestaat', () => {
  const sporen = [{ taal: 'nl' }, { taal: 'ar' }, { taal: 'en' }];
  assert.equal(kiesOndertitelTaal(sporen, 'ar'), 'ar');
  assert.equal(kiesOndertitelTaal(sporen, 'en'), 'en');
});

test('kiesOndertitelTaal valt terug op nl, dan op de eerste taal', () => {
  // Geen voorkeur (beheer, digibord, taalknop uit): Nederlands.
  assert.equal(kiesOndertitelTaal([{ taal: 'en' }, { taal: 'nl' }], ''), 'nl');
  // Een taal waar dit blok geen spoor voor heeft: ook Nederlands.
  assert.equal(kiesOndertitelTaal([{ taal: 'en' }, { taal: 'nl' }], 'tr'), 'nl');
  // Geen Nederlands in de lijst: de eerste taal.
  assert.equal(kiesOndertitelTaal([{ taal: 'en' }, { taal: 'ar' }], 'tr'), 'en');
  assert.equal(kiesOndertitelTaal([{ taal: 'en' }, { taal: 'ar' }]), 'en');
});

test('kiesOndertitelTaal geeft een lege tekst bij een lege of ongeldige lijst', () => {
  assert.equal(kiesOndertitelTaal([], 'ar'), '');
  assert.equal(kiesOndertitelTaal(undefined, 'ar'), '');
  assert.equal(kiesOndertitelTaal('geen lijst', 'nl'), '');
});
